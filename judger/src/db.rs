use std::env;

pub fn get_db_url() -> String {
    let db_host = env::var("DB_HOST").unwrap_or("localhost".into());
    let db_port = env::var("DB_PORT").unwrap_or("5432".into());
    let db_user = env::var("DB_USER").unwrap_or("postgres".into());
    let db_pass = env::var("DB_PASS").unwrap_or("postgres".into());
    let db_name = env::var("DB_NAME").unwrap_or("postgres".into());
    return format!(
        "postgres://{}:{}@{}:{}/{}",
        db_user, db_pass, db_host, db_port, db_name
    );
}
