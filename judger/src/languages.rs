use crate::models::LanguageConfig;
use std::error::Error;

const LANGUAGES: &[LanguageConfig] = &[
    // C
    LanguageConfig {
        language: "C99",
        ext: "c",
        compile_command: "gcc -std=c99 main.c -o main",
        run_command: "./main",
    },
    LanguageConfig {
        language: "C11",
        ext: "c",
        compile_command: "gcc -std=c11 main.c -o main",
        run_command: "./main",
    },
    LanguageConfig {
        language: "C17",
        ext: "c",
        compile_command: "gcc -std=c17 main.c -o main",
        run_command: "./main",
    },
    LanguageConfig {
        language: "C23",
        ext: "c",
        compile_command: "gcc -std=c2x main.c -o main",
        run_command: "./main",
    },
    // C++
    LanguageConfig {
        language: "CPP03",
        ext: "cpp",
        compile_command: "g++ -std=c++03 main.cpp -o main",
        run_command: "./main",
    },
    LanguageConfig {
        language: "CPP11",
        ext: "cpp",
        compile_command: "g++ -std=c++11 main.cpp -o main",
        run_command: "./main",
    },
    LanguageConfig {
        language: "CPP14",
        ext: "cpp",
        compile_command: "g++ -std=c++14 main.cpp -o main",
        run_command: "./main",
    },
    LanguageConfig {
        language: "CPP17",
        ext: "cpp",
        compile_command: "g++ -std=c++17 main.cpp -o main",
        run_command: "./main",
    },
    LanguageConfig {
        language: "CPP20",
        ext: "cpp",
        compile_command: "g++ -std=c++20 main.cpp -o main",
        run_command: "./main",
    },
    LanguageConfig {
        language: "CPP23",
        ext: "cpp",
        compile_command: "g++ -std=c++23 main.cpp -o main",
        run_command: "./main",
    },
    // Java
    LanguageConfig {
        language: "JAVA_8",
        ext: "java",
        compile_command: "javac main.java",
        run_command: "java main",
    },
    LanguageConfig {
        language: "JAVA_11",
        ext: "java",
        compile_command: "javac main.java",
        run_command: "java main",
    },
    LanguageConfig {
        language: "JAVA_17",
        ext: "java",
        compile_command: "javac main.java",
        run_command: "java main",
    },
    // Python
    LanguageConfig {
        language: "PYTHON2",
        ext: "py",
        compile_command: "",
        run_command: "python2 main.py",
    },
    LanguageConfig {
        language: "PYTHON3",
        ext: "py",
        compile_command: "",
        run_command: "python3 main.py",
    },
];

pub fn get_language_config(language: &str) -> Result<&'static LanguageConfig, Box<dyn Error>> {
    LANGUAGES
        .iter()
        .find(|&lang| lang.language == language)
        .ok_or_else(|| "Language not found".into())
}
