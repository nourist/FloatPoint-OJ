use sqlx;
use sqlx::Row;
use std::collections::HashMap;
use std::env;
use std::error::Error;
use std::fs;
use std::fs::File;
use std::io::Write;
use std::process::Command;
use tracing::{error, info, debug};
use uuid::Uuid;

use crate::db::get_db_url;
use crate::languages::get_language_config;
use crate::metadata::{get_f64, get_u64, metadata_file_to_hashmap};
use crate::minio::{make_minio_client, minio_object_to_string};
use crate::models::{
    IoMode, JudgerJob, JudgerResult, LanguageConfig, Problem, ResultStatus, Status, TestCase,
    TestResult,
};
use crate::checker::check_files;

async fn get_problem(problem_id: &Uuid) -> Result<Problem, Box<dyn Error>> {
    info!("Fetching problem with id: {}", problem_id);
    let pool = sqlx::PgPool::connect(&get_db_url()).await?;

    let row = sqlx::query(
        r#"
        SELECT "ioMode", "inputFile", "outputFile", "timeLimit", "memoryLimit", "id"
        FROM problems
        WHERE id = $1::uuid
        "#,
    )
    .bind(problem_id)
    .fetch_one(&pool)
    .await?;

    let problem = Problem {
        io_mode: row.try_get::<IoMode, _>("ioMode")?,
        input_file: row.try_get::<Option<String>, _>("inputFile")?,
        output_file: row.try_get::<Option<String>, _>("outputFile")?,
        time_limit: row.try_get::<i32, _>("timeLimit")? as u64,
        memory_limit: row.try_get::<i32, _>("memoryLimit")? as u64,
        id: row.try_get::<Uuid, _>("id")?,
    };

    info!("Successfully fetched problem: {}", problem_id);
    Ok(problem)
}

async fn get_test_cases(problem_id: &Uuid) -> Result<Vec<String>, sqlx::Error> {
    info!("Fetching test cases for problem: {}", problem_id);
    let pool = sqlx::PgPool::connect(&get_db_url()).await?;

    let rows = sqlx::query(
        r#"
        SELECT subtasks.slug || '/' || test_cases.slug AS merge
        FROM subtasks
        INNER JOIN test_cases
            ON test_cases."subtaskId" = subtasks.id
        WHERE subtasks."problemId" = $1::uuid
        "#,
    )
    .bind(problem_id)
    .fetch_all(&pool)
    .await?;

    let test_cases: Vec<String> = rows
        .into_iter()
        .map(|row| row.get::<String, _>("merge"))
        .collect();

    info!("Found {} test cases for problem: {}", test_cases.len(), problem_id);
    Ok(test_cases)
}

async fn get_test_case_content(problem_id: &Uuid, slug: &str) -> Result<TestCase, Box<dyn Error>> {
    info!("Fetching test case content for {}/{}", problem_id, slug);
    let minio_client = make_minio_client();

    let input_content = minio_client
        .get_object()
        .bucket("test-cases")
        .key(format!("{}/{}/{}", problem_id, slug, "input"))
        .send()
        .await?;

    let output_content = minio_client
        .get_object()
        .bucket("test-cases")
        .key(format!("{}/{}/{}", problem_id, slug, "output"))
        .send()
        .await?;

    let test_case = TestCase {
        input: minio_object_to_string(input_content).await?,
        output: minio_object_to_string(output_content).await?,
    };
    
    debug!("Successfully fetched test case content for {}/{}", problem_id, slug);
    Ok(test_case)
}

async fn write_test_case_input(slug: &str, problem: &Problem) -> Result<(), Box<dyn Error>> {
    debug!("Writing test case input for: {}", slug);
    let input_file_name = if problem.io_mode == IoMode::Standard {
        "input.txt"
    } else {
        problem.input_file.as_ref().unwrap()
    };

    let test_case_content = get_test_case_content(&problem.id, slug).await?;

    let mut input_file = File::create(format!(
        "/var/local/lib/isolate/{}/box/{}",
        env::var("JUDGER_ID").unwrap(),
        input_file_name
    ))?;

    input_file.write_all(test_case_content.input.as_bytes())?;

    debug!("Test case input written successfully for: {}", slug);
    Ok(())
}

async fn write_test_case_answer(slug: &str, problem: &Problem) -> Result<(), Box<dyn Error>> {
    debug!("Writing test case answer for: {}", slug);
    let output_file_name = if problem.io_mode == IoMode::Standard {
        "output.txt"
    } else {
        problem.output_file.as_ref().unwrap()
    };

    let test_case_content = get_test_case_content(&problem.id, slug).await?;

    let mut output_file = File::create(format!(
        "/var/local/lib/isolate/{}/box/{}.ans",
        env::var("JUDGER_ID").unwrap(),
        output_file_name
    ))?;

    output_file.write_all(test_case_content.output.as_bytes())?;

    debug!("Test case answer written successfully for: {}", slug);
    Ok(())
}

fn create_isolate_box() -> Result<(), Box<dyn Error>> {
    info!("Creating isolate box with ID: {}", env::var("JUDGER_ID").unwrap());
    let create_box_res = Command::new("isolate")
        .arg("--init")
        .arg(format!("--box-id={}", env::var("JUDGER_ID").unwrap()))
        .output()?;

    if !create_box_res.status.success() {
        error!(
            "Failed to create isolate box: {}",
            String::from_utf8_lossy(&create_box_res.stderr).to_string()
        );
        return Err("Failed to create isolate box".into());
    }

    info!("Isolate box created successfully");
    Ok(())
}

fn write_source_code(source_code: &str, ext: &str) -> Result<(), Box<dyn Error>> {
    info!("Writing source code with extension: {}", ext);
    let mut source_file = File::create(format!(
        "/var/local/lib/isolate/{}/box/main.{}",
        env::var("JUDGER_ID").unwrap(),
        ext
    ))?;

    source_file.write_all(source_code.as_bytes())?;

    info!("Source code written successfully");
    Ok(())
}

fn compile_source_code(job_id: &Uuid, compile_command: &str) -> Result<(), JudgerResult> {
    info!("Compiling source code with command: {}", compile_command);
    let args = compile_command.split_whitespace().collect::<Vec<&str>>();

    let output = Command::new(args[0])
        .current_dir(format!(
            "/var/local/lib/isolate/{}/box",
            env::var("JUDGER_ID").unwrap()
        ))
        .args(&args[1..])
        .output()
        .map_err(|e| JudgerResult {
            id: job_id.clone(),
            log: e.to_string(),
            status: ResultStatus::CE,
            test_results: vec![],
        })?;

    if !output.status.success() {
        error!(
            "Failed to compile source code: {}",
            String::from_utf8_lossy(&output.stderr).to_string()
        );
        return Err(JudgerResult {
            id: job_id.clone(),
            log: String::from_utf8_lossy(&output.stderr).to_string(),
            status: ResultStatus::CE,
            test_results: vec![],
        });
    }

    info!("Source code compiled successfully");
    Ok(())
}

fn run_testcase(language_config: &LanguageConfig, problem: &Problem) -> Result<(), Box<dyn Error>> {
    info!("Running testcase with time limit: {}ms, memory limit: {}KB", 
          problem.time_limit, problem.memory_limit);
          
    let arg_box_id = format!("--box-id={}", env::var("JUDGER_ID").unwrap());
    let arg_time = format!("--time={}", (problem.time_limit as f64) / 1000.0);
    let arg_wall_time = format!("--wall-time={}", (problem.time_limit as f64) / 1000.0 + 1.0);
    let arg_mem = format!("--mem={}", problem.memory_limit);
    let arg_fsize = format!("--fsize={}", 131072);
    let arg_meta = format!(
        "--meta=/var/local/lib/isolate/{}/box/meta.txt",
        env::var("JUDGER_ID").unwrap()
    );

    let mut cmd = Command::new("isolate");
    cmd.arg("--run")
        .arg(&arg_box_id)
        .arg(&arg_time)
        .arg(&arg_wall_time)
        .arg(&arg_mem)
        .arg(&arg_fsize)
        .arg(&arg_meta);

    if problem.io_mode == IoMode::Standard {
        let arg_input = format!("--stdin=input.txt");
        let arg_output = format!("--stdout=output.txt");

        cmd.arg(&arg_input).arg(&arg_output);
    }

    let args = language_config
        .run_command
        .split_whitespace()
        .collect::<Vec<&str>>();

    let _output = cmd.args(&args).output()?; // Prefix with underscore to mark as intentionally unused

    debug!("Testcase run completed");
    Ok(())
}

fn check_result(problem: &Problem, test_case_slug: &str) -> Result<TestResult, Box<dyn Error>> {
    info!("Checking result for test case: {}", test_case_slug);
    
    fn is_memory_limit_exceeded(
        metadata: &HashMap<String, String>,
        memory_limit_kb: usize,
    ) -> bool {
        // Trường hợp chết bởi SIGSEGV (exitsig == "11")
        if metadata.get("exitsig").map(|v| v == "11").unwrap_or(false) {
            let max_rss = get_u64(metadata, "max-rss");

            if max_rss as usize > (memory_limit_kb as f64 * 0.95) as usize {
                return true;
            }
        }

        // Trường hợp bị killed
        if metadata.contains_key("killed") {
            let max_rss = get_u64(metadata, "max-rss");

            if max_rss as usize > (memory_limit_kb as f64 * 0.9) as usize {
                return true;
            }
        }

        // Trường hợp runtime error với status == "RE"
        if metadata.get("status").map(|v| v == "RE").unwrap_or(false) {
            let max_rss = get_u64(metadata, "max-rss");

            if max_rss as usize > (memory_limit_kb as f64 * 0.95) as usize {
                return true;
            }
        }

        false
    }

    let meta_data = metadata_file_to_hashmap(format!(
        "/var/local/lib/isolate/{}/box/meta.txt",
        env::var("JUDGER_ID").unwrap()
    ))?;

    if is_memory_limit_exceeded(&meta_data, problem.memory_limit as usize) {
        info!("Test case {} resulted in MLE", test_case_slug);
        return Ok(TestResult {
            slug: test_case_slug.to_string(),
            status: Status::MLE,
            time: (get_f64(&meta_data, "time") * 1000.0) as u64,
            memory: 0,
        });
    }

    match meta_data.get("status") {
        Some(status) => {
            if status == "TO" {
                info!("Test case {} resulted in TLE", test_case_slug);
                return Ok(TestResult {
                    slug: test_case_slug.to_string(),
                    status: Status::TLE,
                    time: 0,
                    memory: get_u64(&meta_data, "max-rss"),
                });
            } else {
                info!("Test case {} resulted in RTE", test_case_slug);
                return Ok(TestResult {
                    slug: test_case_slug.to_string(),
                    status: Status::RTE,
                    time: (get_f64(&meta_data, "time") * 1000.0) as u64,
                    memory: get_u64(&meta_data, "max-rss"),
                });
            }
        }
        _ => {
            let output_file_name = if problem.io_mode == IoMode::Standard {
                "output.txt"
            } else {
                problem.output_file.as_ref().unwrap()
            };

            // Define file paths for actual and expected outputs
            let actual_output_path = format!(
                "/var/local/lib/isolate/{}/box/{}",
                env::var("JUDGER_ID").unwrap(),
                output_file_name
            );
            
            let expected_output_path = format!(
                "/var/local/lib/isolate/{}/box/{}.ans",
                env::var("JUDGER_ID").unwrap(),
                output_file_name
            );

            // Use the Rust checker instead of the bash script
            match check_files(&actual_output_path, &expected_output_path) {
                Ok(true) => {
                    info!("Test case {} resulted in AC", test_case_slug);
                    return Ok(TestResult {
                        slug: test_case_slug.to_string(),
                        status: Status::AC,
                        time: (get_f64(&meta_data, "time") * 1000.0) as u64,
                        memory: get_u64(&meta_data, "max-rss"),
                    });
                }
                Ok(false) => {
                    // Read the actual and expected outputs for logging
                    let actual_output = fs::read_to_string(&actual_output_path).unwrap_or_else(|_| "Failed to read actual output".to_string());
                    let expected_output = fs::read_to_string(&expected_output_path).unwrap_or_else(|_| "Failed to read expected output".to_string());
                    
                    // Log detailed information about the outputs including their lengths and byte representations
                    info!("Test case {} resulted in WA. Actual output length: {}, Expected output length: {}", 
                          test_case_slug, 
                          actual_output.len(),
                          expected_output.len());
                    
                    // Log the outputs with special characters made visible
                    let actual_escaped = actual_output.escape_debug().to_string();
                    let expected_escaped = expected_output.escape_debug().to_string();
                    
                    info!("Actual output (escaped): '{}'", actual_escaped);
                    info!("Expected output (escaped): '{}'", expected_escaped);
                    
                    // Also log raw bytes for more detailed analysis
                    let actual_bytes: Vec<u8> = actual_output.bytes().collect();
                    let expected_bytes: Vec<u8> = expected_output.bytes().collect();
                    
                    info!("Actual output bytes: {:?}", actual_bytes);
                    info!("Expected output bytes: {:?}", expected_bytes);
                    
                    return Ok(TestResult {
                        slug: test_case_slug.to_string(),
                        status: Status::WA,
                        time: (get_f64(&meta_data, "time") * 1000.0) as u64,
                        memory: get_u64(&meta_data, "max-rss"),
                    });
                }
                Err(e) => {
                    error!("Error reading output files for test case {}: {}", test_case_slug, e);
                    return Ok(TestResult {
                        slug: test_case_slug.to_string(),
                        status: Status::RTE,
                        time: (get_f64(&meta_data, "time") * 1000.0) as u64,
                        memory: get_u64(&meta_data, "max-rss"),
                    });
                }
            }
        }
    }
}

pub async fn judge(job: &JudgerJob) -> Result<JudgerResult, Box<dyn Error>> {
    info!("Starting judge process for job: {}, problem: {}, language: {}", 
          job.id, job.problem_id, job.language);
          
    let test_cases = get_test_cases(&job.problem_id).await?;

    let problem = get_problem(&job.problem_id).await?;

    let language_config = get_language_config(&job.language)?;

    create_isolate_box()?;

    write_source_code(&job.source_code, &language_config.ext)?;

    //compile source code
    if !language_config.compile_command.is_empty() {
        if let Err(res) = compile_source_code(&job.id, &language_config.compile_command) {
            return Ok(res);
        }
    }

    let mut test_results: Vec<TestResult> = vec![];
    
    info!("Running {} test cases", test_cases.len());

    //run source code
    for (index, test_case) in test_cases.iter().enumerate() {
        info!("Running test case {}/{}: {}", index + 1, test_cases.len(), test_case);
        write_test_case_input(test_case, &problem).await?;
        run_testcase(&language_config, &problem)?;
        write_test_case_answer(test_case, &problem).await?;
        let result = check_result(&problem, test_case)?;
        test_results.push(result);
        info!("Completed test case {}/{}: {} with status {:?}", 
              index + 1, test_cases.len(), test_case, test_results.last().unwrap().status);
    }

    info!("Judge process completed successfully for job: {}", job.id);
    Ok(JudgerResult {
        id: job.id.clone(),
        log: "".to_string(),
        status: ResultStatus::OK,
        test_results,
    })
}