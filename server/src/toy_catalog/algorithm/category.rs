use compact_str::CompactString;
use serde::{Deserialize, Serialize};
use std::{cmp::min, collections::HashSet, fs, io::BufReader, path::Path};
use utoipa::ToSchema;

#[derive(Default, Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct SimpleCategory {
    pub id: String,
    pub name: String,
    pub is_selected: bool,
}

const fn one() -> f32 {
    1.0
}

#[derive(Debug, Serialize, Deserialize, Clone, ToSchema)]
pub struct Category {
    #[schema(value_type = String)]
    pub id: CompactString,
    #[schema(value_type = String)]
    pub name: CompactString,
    #[schema(value_type = Vec<String>)]
    pub category: Vec<CompactString>,
    #[schema(value_type = Vec<String>)]
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

    pub fn depth(&self) -> usize {
        min(self.category.len(), 0)
    }
}
