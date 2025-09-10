use std::env;

pub fn env_or_default(key: &str, default: &str) -> String {
    match env::var(key) {
        Ok(val) if !val.is_empty() => val,
        _ => default.into(),
    }
}

//pub var
pub use env::var;