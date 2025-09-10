use aws_config::Region;
use aws_credential_types::Credentials;
use aws_sdk_s3::{
    Client, config::Builder as S3ConfigBuilder, operation::get_object::GetObjectOutput,
};
use std::error::Error;
use crate::env_tool;

fn get_minio_endpoint_url() -> String {
    let minio_endpoint = env_tool::env_or_default("MINIO_ENDPOINT", "localhost");
    let minio_port = env_tool::env_or_default("MINIO_PORT", "9000");
    format!("http://{}:{}", minio_endpoint, minio_port)
}

pub fn make_minio_client() -> Client {
    let creds = Credentials::new(
        env_tool::env_or_default("MINIO_ACCESS_KEY", "minioadmin"), // access key
        env_tool::env_or_default("MINIO_SECRET_KEY", "minioadmin"), // secret key
        None,                                                   // optional token
        None,                                                   // optional expiry
        "static",                                               // provider name
    );

    let config = S3ConfigBuilder::new()
        .endpoint_url(get_minio_endpoint_url())
        .region(Region::new("us-east-1"))
        .credentials_provider(creds)
        .force_path_style(true)
        .build();

    Client::from_conf(config)
}

pub async fn minio_object_to_string(obj: GetObjectOutput) -> Result<String, Box<dyn Error>> {
    let bytes = obj.body.collect().await?.into_bytes();
    let content = String::from_utf8(bytes.to_vec())?;
    return Ok(content);
}
