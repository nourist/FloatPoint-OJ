use sqlx;
use sqlx::Row;
use std::collections::HashMap;
use std::error::Error;
use std::fs::File;
use std::io::Write;
use std::process::Command;
use tracing::{error, info};

use crate::db::get_db_url;
use crate::languages::get_language_config;
use crate::metadata::{get_f64, get_u64, metadata_file_to_hashmap};
use crate::minio::{make_minio_client, minio_object_to_string};
use crate::models::{
    IoMode, JudgerJob, JudgerResult, LanguageConfig, Problem, ResultStatus, Status, TestCase,
    TestResult,
};

async fn get_problem(problem_id: &str) -> Result<Problem, Box<dyn Error>> {
    let pool = sqlx::PgPool::connect(&get_db_url()).await?;

    let row = sqlx::query(
        r#"
        SELECT ioMode, inputFile, outputFile, timeLimit, memoryLimit, id
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
        time_limit: row.try_get::<i64, _>("timeLimit")? as u64,
        memory_limit: row.try_get::<i64, _>("memoryLimit")? as u64,
        id: row.try_get::<String, _>("id")?,
    };

    Ok(problem)
}

async fn get_test_cases(problem_id: &str) -> Result<Vec<String>, sqlx::Error> {
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

    Ok(test_cases)
}

async fn get_test_case_content(problem_id: &str, slug: &str) -> Result<TestCase, Box<dyn Error>> {
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

    Ok(TestCase {
        input: minio_object_to_string(input_content).await?,
        output: minio_object_to_string(output_content).await?,
    })
}

async fn write_test_case_input(
    job_id: &str,
    slug: &str,
    problem: &Problem,
) -> Result<(), Box<dyn Error>> {
    let input_file_name = if problem.io_mode == IoMode::Standard {
        "input.txt"
    } else {
        problem.input_file.as_ref().unwrap()
    };

    let test_case_content = get_test_case_content(&problem.id, slug).await?;

    let mut input_file = File::create(format!(
        "/var/local/lib/isolate/{}/box/{}",
        job_id, input_file_name
    ))?;

    input_file.write_all(test_case_content.input.as_bytes())?;

    Ok(())
}

async fn write_test_case_answer(
    job_id: &str,
    slug: &str,
    problem: &Problem,
) -> Result<(), Box<dyn Error>> {
    let output_file_name = if problem.io_mode == IoMode::Standard {
        "output.txt"
    } else {
        problem.output_file.as_ref().unwrap()
    };

    let test_case_content = get_test_case_content(&problem.id, slug).await?;

    let mut output_file = File::create(format!(
        "/var/local/lib/isolate/{}/box/{}.ans",
        job_id, output_file_name
    ))?;

    output_file.write_all(test_case_content.output.as_bytes())?;

    Ok(())
}

fn create_isolate_box(job_id: &str) -> Result<(), Box<dyn Error>> {
    let create_box_res = Command::new("isolate")
        .arg("--init")
        .arg(format!("--box-id={}", job_id))
        .output()?;

    if !create_box_res.status.success() {
        error!("Failed to create box");
        return Err("Failed to create box".into());
    }

    info!("Isolate box created successfully");

    Ok(())
}

fn cleanup_isolate_box(job_id: &str) -> Result<(), Box<dyn Error>> {
    let cleanup_res = Command::new("isolate")
        .arg(format!("--box-id={}", job_id))
        .arg("--cleanup")
        .output()?;

    if !cleanup_res.status.success() {
        error!("Failed to cleanup box");
        return Err("Failed to cleanup box".into());
    }

    info!("Isolate box cleaned up successfully");

    Ok(())
}

fn write_source_code(job_id: &str, source_code: &str, ext: &str) -> Result<(), Box<dyn Error>> {
    let mut source_file = File::create(format!(
        "/var/local/lib/isolate/{}/box/main.{}",
        job_id, ext
    ))?;

    source_file.write_all(source_code.as_bytes())?;

    info!("Source code written successfully");

    Ok(())
}

fn compile_source_code(job_id: &str, compile_command: &str) -> Result<(), JudgerResult> {
    let compile_res = Command::new("isolate")
        .arg(format!("--box-id={}", job_id))
        .arg("--run")
        .arg(compile_command)
        .output()
        .map_err(|e| JudgerResult {
            id: job_id.to_string(),
            log: e.to_string(),
            status: ResultStatus::CE,
            test_results: vec![],
        })?;

    if !compile_res.status.success() {
        error!("Failed to compile source code");
        return Err(JudgerResult {
            id: job_id.to_string(),
            log: String::from_utf8_lossy(&compile_res.stderr).to_string(),
            status: ResultStatus::CE,
            test_results: vec![],
        });
    }

    info!("Source code compiled successfully");

    Ok(())
}

fn run_testcase(
    job_id: &str,
    language_config: &LanguageConfig,
    problem: &Problem,
) -> Result<(), Box<dyn Error>> {
    let arg_box_id = format!("--box-id={}", job_id);
    let arg_time = format!("--time={}", (problem.time_limit as f64) / 1000.0);
    let arg_wall_time = format!("--wall-time={}", (problem.time_limit as f64) / 1000.0 + 1.0);
    let arg_mem = format!("--mem={}", problem.memory_limit);
    let arg_fsize = format!("--fsize={}", 131072);
    let arg_meta = format!("--meta=/var/local/lib/isolate/{}/box/meta.txt", job_id);

    let mut run_res = Command::new("isolate");
    run_res
        .arg(&arg_box_id)
        .arg("--run")
        .arg(&arg_time)
        .arg(&arg_wall_time)
        .arg(&arg_mem)
        .arg(&arg_fsize)
        .arg(&arg_meta)
        .arg(&language_config.run_command);

    if problem.io_mode == IoMode::Standard {
        let arg_input = format!("--input=/var/local/lib/isolate/{}/box/input.txt", job_id);
        let arg_output = format!("--output=/var/local/lib/isolate/{}/box/output.txt", job_id);

        run_res.arg(&arg_input).arg(&arg_output);
    }

    let output = run_res.output()?;

    if !output.status.success() {
        error!("Failed to run testcase");
        return Err("Failed to run testcase".into());
    }

    info!("Testcase run successfully");

    Ok(())
}

fn check_result(job_id: &str, problem: &Problem) -> Result<TestResult, Box<dyn Error>> {
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

    let meta_data =
        metadata_file_to_hashmap(format!("/var/local/lib/isolate/{}/box/meta.txt", job_id))?;

    if is_memory_limit_exceeded(&meta_data, problem.memory_limit as usize) {
        return Ok(TestResult {
            status: Status::MLE,
            time: (get_f64(&meta_data, "time") * 1000.0) as u64,
            memory: 0,
        });
    }

    match meta_data.get("status") {
        Some(status) => {
            if status == "TO" {
                return Ok(TestResult {
                    status: Status::TLE,
                    time: 0,
                    memory: get_u64(&meta_data, "max-rss"),
                });
            } else {
                return Ok(TestResult {
                    status: Status::RTE,
                    time: (get_f64(&meta_data, "time") * 1000.0) as u64,
                    memory: get_u64(&meta_data, "max-rss"),
                });
            }
        }
        _ => {
            return Ok(TestResult {
                status: Status::AC,
                time: (get_f64(&meta_data, "time") * 1000.0) as u64,
                memory: get_u64(&meta_data, "max-rss"),
            });
        }
    }
}

pub async fn judge(job: &JudgerJob) -> Result<JudgerResult, Box<dyn Error>> {
    let test_cases = get_test_cases(&job.problem_id).await?;

    let problem = get_problem(&job.problem_id).await?;

    let language_config = get_language_config(&job.language)?;

    create_isolate_box(&job.id)?;

    write_source_code(&job.id, &job.source_code, &language_config.ext)?;

    //compile source code
    if !language_config.compile_command.is_empty() {
        if let Err(res) = compile_source_code(&job.id, &language_config.compile_command) {
            return Ok(res);
        }
    }

    //run source code
    for test_case in test_cases {
        write_test_case_input(&job.id, &test_case, &problem).await?;
        run_testcase(&job.id, &language_config, &problem)?;
        write_test_case_answer(&job.id, &test_case, &problem).await?;
        check_result(&job.id, &problem)?;
    }

    cleanup_isolate_box(&job.id)?;

    Ok(JudgerResult {
        id: job.id.clone(),
        log: "".to_string(),
        status: ResultStatus::OK,
        test_results: vec![],
    })
}
