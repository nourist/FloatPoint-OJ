use serde::{Deserialize, Serialize};
use sqlx;
use strum_macros::{Display, EnumString};

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct JudgerJob {
    pub id: String,
    pub problem_id: String,
    pub source_code: String,
    pub language: String,
}

#[derive(Deserialize, Serialize)]
pub struct JudgerAck {
    pub id: String,
}

#[derive(Deserialize, Serialize)]
pub enum ResultStatus {
    CE,
    IE,
    OK,
}

#[derive(Deserialize, Serialize)]
pub enum Status {
    AC,
    WA,
    RTE,
    OLE,
    TLE,
    MLE,
}

#[derive(Deserialize, Serialize)]
pub struct TestResult {
    pub status: Status,
    pub time: u64,
    pub memory: u64,
}

#[derive(Deserialize, Serialize)]
pub struct JudgerResult {
    pub id: String,
    pub log: String,
    pub status: ResultStatus,
    pub test_results: Vec<TestResult>,
}

pub struct TestCase {
    pub input: String,
    pub output: String,
}

#[derive(EnumString, Display, PartialEq, Eq, Deserialize, Serialize, sqlx::Type)]
pub enum IoMode {
    Standard,
    File,
}

#[derive(Deserialize, Serialize)]
pub struct Problem {
    pub io_mode: IoMode,
    pub input_file: Option<String>,
    pub output_file: Option<String>,
    pub time_limit: u64,
    pub memory_limit: u64,
    pub id: String,
}

pub struct LanguageConfig {
    pub language: &'static str,
    pub ext: &'static str,
    pub compile_command: &'static str,
    pub run_command: &'static str,
}
