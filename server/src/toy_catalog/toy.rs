use std::{fs, io::BufReader, path::Path};

use serde::Deserialize;

#[derive(Default, Debug, Clone, PartialEq, Deserialize)]
pub struct Toy {
    pub id: String,
    pub name: String,
    pub description: String,
    pub price: u32,
    pub image: String,
    pub categories: Vec<String>,
}

impl Toy {
    pub fn read_toy(path: &Path) -> Self {
        let file = fs::File::open(path).unwrap();
        let reader = BufReader::new(file);
        let toy: Toy = serde_json::from_reader(reader).unwrap();
        toy
    }
}
