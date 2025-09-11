use crate::env_tool;

pub fn get_rabbitmq_url() -> String {
    let rabbitmq_host = env_tool::env_or_default("RABBITMQ_HOST", "localhost");
    let rabbitmq_port = env_tool::env_or_default("RABBITMQ_PORT", "5672");
    let rabbitmq_user = env_tool::env_or_default("RABBITMQ_USER", "guest");
    let rabbitmq_pass = env_tool::env_or_default("RABBITMQ_PASS", "guest");
    format!(
        "amqp://{}:{}@{}:{}",
        rabbitmq_user, rabbitmq_pass, rabbitmq_host, rabbitmq_port
    )
}
