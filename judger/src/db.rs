use crate::env_tool;

pub fn get_db_url() -> String {
    let db_host = env_tool::env_or_default("DB_HOST", "localhost");
    let db_port = env_tool::env_or_default("DB_PORT", "5432");
    let db_user = env_tool::env_or_default("DB_USER", "postgres");
    let db_pass = env_tool::env_or_default("DB_PASS", "postgres");
    let db_name = env_tool::env_or_default("DB_NAME", "postgres");
    return format!(
        "postgres://{}:{}@{}:{}/{}",
        db_user, db_pass, db_host, db_port, db_name
    );
}
