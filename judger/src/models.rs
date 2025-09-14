use serde::{Deserialize, Serialize};
use sqlx;
use strum_macros::{Display, EnumString};
use uuid::Uuid;

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct JudgerJob {
    pub id: Uuid,
    pub problem_id: Uuid,
    pub source_code: String,
    pub language: String,
}

#[derive(Deserialize, Serialize, Clone)]
pub struct JudgerAck {
    pub id: Uuid,
}

#[derive(Deserialize, Serialize, Clone)]
pub enum ResultStatus {
    CE,
    IE,
    OK,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub enum Status {
    AC,
    WA,
    RTE,
    TLE,
    MLE,
}

#[derive(Deserialize, Serialize, Clone)]
pub struct TestResult {
    pub slug: String,
    pub status: Status,
    pub time: u64,
    pub memory: u64,
}

#[derive(Deserialize, Serialize, Clone)]
pub struct JudgerResult {
    pub id: Uuid,
    pub log: String,
    pub status: ResultStatus,
    pub test_results: Vec<TestResult>,
}

pub struct TestCase {
    pub input: String,
    pub output: String,
}

#[derive(EnumString, Display, PartialEq, Eq, Deserialize, Serialize, sqlx::Type)]
#[sqlx(type_name = "problems_iomode_enum")]
#[sqlx(rename_all = "lowercase")]
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
    pub id: Uuid,
}

pub struct LanguageConfig {
    pub language: &'static str,
    pub ext: &'static str,
    pub compile_command: &'static str,
    pub run_command: &'static str,
}

#[derive(Serialize)]
pub struct JudgerHeartbeat {
    pub judger_id: String,
    pub timestamp: i64,
}
