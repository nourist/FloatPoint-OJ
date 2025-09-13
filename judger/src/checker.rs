use std::fs::File;
use std::io::{self, BufRead, BufReader};

/// Compare two output files according to ICPC standards.
/// - Ignores trailing whitespace on each line
/// - Ignores differences in trailing newlines
/// Returns Ok(true) if files are equivalent, Ok(false) if different.
pub fn check_files(path1: &str, path2: &str) -> io::Result<bool> {
    let f1 = BufReader::new(File::open(path1)?);
    let f2 = BufReader::new(File::open(path2)?);

    let mut lines1 = f1.lines().map(|l| l.unwrap_or_default().trim_end().to_string());
    let mut lines2 = f2.lines().map(|l| l.unwrap_or_default().trim_end().to_string());

    loop {
        match (lines1.next(), lines2.next()) {
            (Some(l1), Some(l2)) => {
                if l1 != l2 {
                    return Ok(false);
                }
            }
            (None, None) => return Ok(true),
            _ => return Ok(false),
        }
    }
}