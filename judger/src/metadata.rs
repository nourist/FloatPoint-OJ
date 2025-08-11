use std::collections::HashMap;
use std::error::Error;
use std::fs;
use std::path::Path;

pub fn metadata_file_to_hashmap<P: AsRef<Path>>(
    path: P,
) -> Result<HashMap<String, String>, Box<dyn Error>> {
    let content = fs::read_to_string(path)?;
    let mut data = HashMap::new();

    for line in content.lines() {
        if let Some(pos) = line.find(':') {
            let key = line[..pos].trim().to_string();
            let value = line[pos + 1..].trim().to_string();
            data.insert(key, value);
        }
    }

    Ok(data)
}

pub fn get_u64(meta: &HashMap<String, String>, key: &str) -> u64 {
    meta.get(key)
        .and_then(|v| v.parse::<u64>().ok())
        .unwrap_or(0)
}

pub fn get_f64(meta: &HashMap<String, String>, key: &str) -> f64 {
    meta.get(key)
        .and_then(|v| v.parse::<f64>().ok())
        .unwrap_or(0.0)
}
