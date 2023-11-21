use super::toy::Toy;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::ops::Deref;
use std::path::Path;

#[derive(Clone, Default, Debug, Serialize, Deserialize)]
pub struct Toys {
    pub toys: HashMap<String, Toy>,
}

impl Deref for Toys {
    type Target = HashMap<String, Toy>;

    fn deref(&self) -> &Self::Target {
        &self.toys
    }
}

impl Toys {
    // read all toys in data/items/*.json  and return a HashMap

    pub fn new() -> Self {
        let mut toys = HashMap::new();
        let path = Path::new("data/items");
        for dir in fs::read_dir(path).unwrap().flatten() {
            let path = dir.path();
            let toy = Toy::read_toy(&path);
            toys.insert(toy.id.clone(), toy);
        }

        Self { toys }
    }
}
