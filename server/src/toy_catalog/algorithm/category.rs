use compact_str::CompactString;
use serde::Deserialize;
use std::{collections::HashSet, fs, io::BufReader, path::Path};

const fn one() -> f32 {
    1.0
}

#[derive(Debug, Deserialize, Clone)]
pub struct Category {
    pub id: CompactString,
    pub name: CompactString,
    pub category: Vec<CompactString>,
    pub items: HashSet<CompactString>,
    #[serde(default = "one")]
    pub score: f32,
}

impl Category {
    pub fn read_category(path: &Path) -> Self {
        let file = fs::File::open(path).unwrap();
        let reader = BufReader::new(file);
        serde_json::from_reader(reader).unwrap()
    }
}
