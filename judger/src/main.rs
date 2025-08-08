use dotenvy::dotenv;
use futures_lite::stream::StreamExt;
use lapin::{
    BasicProperties, Connection, ConnectionProperties, message::Delivery, options::*,
    types::FieldTable,
};
use serde::{Deserialize, Serialize};
use serde_json;
use std::env;
use tokio;
use tracing::{error, info};
use tracing_subscriber;
use uuid;

#[tokio::main]
async fn main() {
    dotenv().ok();
    tracing_subscriber::fmt::init();

    info!("Judger is running...");

    let rabbitmq_url =
        env::var("RABBITMQ_URL").unwrap_or("amqp://guest:guest@localhost:5672".into());

    let conn = Connection::connect(&rabbitmq_url, ConnectionProperties::default())
        .await
        .expect("failed to connect");

    info!("Connected to RabbitMQ");

    let channel = conn
        .create_channel()
        .await
        .expect("failed to create channel");

    channel
        .queue_declare(
            "judger.job",
            QueueDeclareOptions {
                durable: true,
                ..QueueDeclareOptions::default()
            },
            FieldTable::default(),
        )
        .await
        .expect("failed to declare queue");

    channel
        .basic_qos(1, BasicQosOptions::default())
        .await
        .expect("failed to set QoS");

    let tag = format!("judger_consumer_{}", uuid::Uuid::new_v4());

    let mut consumer = channel
        .basic_consume(
            "judger.job",
            &tag,
            BasicConsumeOptions::default(),
            FieldTable::default(),
        )
        .await
        .expect("failed to create consumer");

    info!("Judger is ready to receive messages");

    while let Some(delivery_result) = consumer.next().await {
        match delivery_result {
            Ok(delivery) => {
                handle_message(&channel, delivery).await;
            }
            Err(e) => {
                error!("Error receiving message: {:?}", e);
            }
        }
    }
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct JudgerJob {
    id: String,
    problem_id: String,
    source_code: String,
    language: String,
}

#[derive(Deserialize, Serialize)]
struct JudgerAck {
    id: String,
}

#[derive(Deserialize, Serialize)]
struct JudgerResult {
    id: String,
}

async fn send_ack_message(channel: &lapin::Channel, ack: JudgerAck) {
    #[derive(Serialize)]
    struct AckMessage {
        pattern: String,
        data: JudgerAck,
    }

    let ack_json = serde_json::to_string(&AckMessage {
        pattern: "judger.ack".to_string(),
        data: ack,
    })
    .unwrap();
    channel
        .basic_publish(
            "",
            "judger.ack",
            BasicPublishOptions::default(),
            ack_json.as_bytes(),
            BasicProperties::default(),
        )
        .await
        .expect("failed to publish message");
}

async fn send_result_message(channel: &lapin::Channel, result: JudgerResult) {
    #[derive(Serialize)]
    struct ResultMessage {
        pattern: String,
        data: JudgerResult,
    }

    let result_json = serde_json::to_string(&ResultMessage {
        pattern: "judger.result".to_string(),
        data: result,
    })
    .unwrap();
    channel
        .basic_publish(
            "",
            "judger.result",
            BasicPublishOptions::default(),
            result_json.as_bytes(),
            BasicProperties::default(),
        )
        .await
        .expect("failed to publish message");
}

fn parse_job_message(delivery: &Delivery) -> JudgerJob {
    #[derive(Deserialize)]
    struct JobMessage {
        // pattern: String,
        data: JudgerJob,
    }

    let body = String::from_utf8_lossy(&delivery.data);
    let message: JobMessage = serde_json::from_str(&body).unwrap();

    let data = message.data;

    return data;
}

async fn handle_message(channel: &lapin::Channel, delivery: Delivery) {
    let message = parse_job_message(&delivery);

    info!("Received message with id: {:?}", message.id);

    send_ack_message(
        channel,
        JudgerAck {
            id: message.id.clone(),
        },
    )
    .await;

    info!("Sent ack message with id: {:?}", message.id);

    tokio::time::sleep(std::time::Duration::from_secs(2)).await;

    send_result_message(
        channel,
        JudgerResult {
            id: message.id.clone(),
        },
    )
    .await;

    delivery.ack(BasicAckOptions::default()).await.unwrap();

    info!("Sent result message with id: {:?}", message.id);
}
