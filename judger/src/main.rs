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
use tracing::{error, info, debug};
use tracing_subscriber;

mod db;
mod judger;
mod languages;
mod metadata;
mod minio;
mod models;
mod checker;

#[tokio::main]
async fn main() {
    dotenv().ok();
    tracing_subscriber::fmt::init();

    info!("Judger is starting...");
    
    let judger_id = env::var("JUDGER_ID").unwrap_or("unknown".to_string());
    info!("Judger ID: {}", judger_id);

    let rabbitmq_url =
        env::var("RABBITMQ_URL").unwrap_or("amqp://guest:guest@localhost:5672".into());

    let conn = Connection::connect(&rabbitmq_url, ConnectionProperties::default())
        .await
        .expect("failed to connect");

    info!("Connected to RabbitMQ at: {}", rabbitmq_url);

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

    let tag = format!("judger_consumer_{}", judger_id);

    let mut consumer = channel
        .basic_consume(
            "judger.job",
            &tag,
            BasicConsumeOptions::default(),
            FieldTable::default(),
        )
        .await
        .expect("failed to create consumer");

    info!("Judger is ready to receive messages with consumer tag: {}", tag);

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

async fn send_ack_message(channel: &lapin::Channel, ack: models::JudgerAck) {
    #[derive(Serialize)]
    struct AckMessage {
        pattern: String,
        data: models::JudgerAck,
    }

    let ack_id = ack.id; // Clone the ID before moving ack
    let ack_json = serde_json::to_string(&AckMessage {
        pattern: "judger.ack".to_string(),
        data: ack, // Now we can move ack safely
    })
    .unwrap();
    
    debug!("Sending ack message for job: {}", ack_id);
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

async fn send_result_message(channel: &lapin::Channel, result: models::JudgerResult) {
    #[derive(Serialize)]
    struct ResultMessage {
        pattern: String,
        data: models::JudgerResult,
    }

    let result_id = result.id; // Clone the ID before moving result
    let result_json = serde_json::to_string(&ResultMessage {
        pattern: "judger.result".to_string(),
        data: result, // Now we can move result safely
    })
    .unwrap();
    
    debug!("Sending result message for job: {}", result_id);
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

fn parse_job_message(delivery: &Delivery) -> models::JudgerJob {
    #[derive(Deserialize)]
    struct JobMessage {
        // pattern: String,
        data: models::JudgerJob,
    }

    let body = String::from_utf8_lossy(&delivery.data);
    debug!("Parsing job message with size: {} bytes", body.len());
    let message: JobMessage = serde_json::from_str(&body).unwrap();

    let data = message.data;
    
    info!("Parsed job message for job: {}, problem: {}", data.id, data.problem_id);

    return data;
}

async fn handle_message(channel: &lapin::Channel, delivery: Delivery) {
    let message = parse_job_message(&delivery);

    info!("Received message with id: {:?}", message.id);

    send_ack_message(
        channel,
        models::JudgerAck {
            id: message.id.clone(),
        },
    )
    .await;

    info!("Sent ack message with id: {:?}", message.id);

    match judger::judge(&message).await {
        Ok(result) => {
            info!("Judged successfully with id: {:?}", message.id);
            send_result_message(channel, result).await;
        }
        Err(e) => {
            error!("Error judging message with id {:?}: {:?}", message.id, e);
            send_result_message(
                channel,
                models::JudgerResult {
                    id: message.id.clone(),
                    log: e.to_string(),
                    status: models::ResultStatus::IE,
                    test_results: vec![],
                },
            )
            .await;
        }
    }

    delivery.ack(BasicAckOptions::default()).await.unwrap();

    info!("Sent result message with id: {:?}", message.id);
}