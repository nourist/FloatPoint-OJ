use std::env;
pub fn get_rabbitmq_url() -> String {
    let rabbitmq_host = env::var("RABBITMQ_HOST").unwrap_or("localhost".into());
    let rabbitmq_port = env::var("RABBITMQ_PORT").unwrap_or("5672".into());
    let rabbitmq_user = env::var("RABBITMQ_USER").unwrap_or("guest".into());
    let rabbitmq_pass = env::var("RABBITMQ_PASS").unwrap_or("guest".into());
    format!(
        "amqp://{}:{}@{}:{}",
        rabbitmq_user, rabbitmq_pass, rabbitmq_host, rabbitmq_port
    )
}
