use chrono::Utc;
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
use tracing::{debug, error, info};
use tracing_subscriber;
mod checker;
mod db;
mod judger;
mod languages;
mod metadata;
mod minio;
mod models;
mod rabbitmq;

#[tokio::main]
async fn main() {
    dotenv().ok();
    tracing_subscriber::fmt::init();

    info!("Judger is starting...");

    let judger_id = env::var("JUDGER_ID").unwrap_or("unknown".to_string());
    info!("Judger ID: {}", judger_id);

    let rabbitmq_url = rabbitmq::get_rabbitmq_url();

    let conn = Connection::connect(&rabbitmq_url, ConnectionProperties::default())
        .await
        .expect("failed to connect");

    info!("Connected to RabbitMQ at: {}", rabbitmq_url);

    let channel = conn
        .create_channel()
        .await
        .expect("failed to create channel");

    // spawn heartbeat task
    let heartbeat_channel = channel.clone();
    tokio::spawn(async move {
        let mut ticker = tokio::time::interval(tokio::time::Duration::from_secs(10)); // 10s một lần
        loop {
            ticker.tick().await;
            send_heartbeat_message(&heartbeat_channel).await;
        }
    });

    //judger job queue
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

    info!(
        "Judger is ready to receive messages with consumer tag: {}",
        tag
    );

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
    struct JudgerAckWithJudgerId {
        #[serde(flatten)]
        ack: models::JudgerAck,
        judger_id: String,
    }

    let ack_id = ack.id.clone(); // Clone the ID before moving ack
    let judger_ack = JudgerAckWithJudgerId {
        ack: ack,
        judger_id: env::var("JUDGER_ID").unwrap(),
    };

    #[derive(Serialize)]
    struct AckMessage {
        pattern: String,
        data: JudgerAckWithJudgerId,
    }

    let ack_json = serde_json::to_string(&AckMessage {
        pattern: "judger.ack".to_string(),
        data: judger_ack, // Now we can move ack safely
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
    struct JudgerResultWithJudgerId {
        #[serde(flatten)]
        result: models::JudgerResult,
        judger_id: String,
    }

    #[derive(Serialize)]
    struct ResultMessage {
        pattern: String,
        data: JudgerResultWithJudgerId,
    }

    let result_id = result.id.clone(); // Clone the ID before moving result
    let judger_result = JudgerResultWithJudgerId {
        result: result,
        judger_id: env::var("JUDGER_ID").unwrap(),
    };

    let result_json = serde_json::to_string(&ResultMessage {
        pattern: "judger.result".to_string(),
        data: judger_result, // Now we can move result safely
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

async fn send_heartbeat_message(channel: &lapin::Channel) {
    let judger_id = env::var("JUDGER_ID").unwrap_or("unknown".to_string());

    #[derive(Serialize)]
    struct HeartbeatMessage {
        pattern: String,
        data: models::JudgerHeartbeat,
    }

    let heartbeat = models::JudgerHeartbeat {
        judger_id: judger_id.clone(),
        timestamp: Utc::now().timestamp(),
    };

    let heartbeat_json = serde_json::to_string(&HeartbeatMessage {
        pattern: "judger.heartbeat".to_string(),
        data: heartbeat, // Now we can move result safely
    })
    .unwrap();

    debug!("Sending heartbeat message for judger: {}", judger_id);
    channel
        .basic_publish(
            "",
            "judger.heartbeat",
            BasicPublishOptions::default(),
            heartbeat_json.as_bytes(),
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

    info!(
        "Parsed job message for job: {}, problem: {}",
        data.id, data.problem_id
    );

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
