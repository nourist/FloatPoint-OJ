use aws_config::Region;
use aws_credential_types::Credentials;
use aws_sdk_s3::{
    Client, config::Builder as S3ConfigBuilder, operation::get_object::GetObjectOutput,
};
use std::env;
use std::error::Error;

fn get_minio_endpoint_url() -> String {
    let minio_endpoint = env::var("MINIO_ENDPOINT").unwrap_or("localhost".into());
    let minio_port = env::var("MINIO_PORT").unwrap_or("9000".into());
    format!("http://{}:{}", minio_endpoint, minio_port)
}

pub fn make_minio_client() -> Client {
    let creds = Credentials::new(
        env::var("MINIO_ACCESS_KEY").unwrap_or("admin".into()), // access key
        env::var("MINIO_SECRET_KEY").unwrap_or("admin".into()), // secret key
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
