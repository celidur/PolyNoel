use std::{fs, io::BufReader, path::Path};

use serde::Deserialize;

#[derive(Default, Debug, Clone, PartialEq, Deserialize)]
pub struct Category {
    pub id: String,
    pub name: String,
    pub category: Vec<String>,
    pub items: Vec<String>,
}

impl Category {
    pub fn read_category(path: &Path) -> Self {
        let file = fs::File::open(path).unwrap();
        let reader = BufReader::new(file);
        let category: Category = serde_json::from_reader(reader).unwrap();
        category
    }
}
