use std::collections::HashMap;

use super::category::Category;

use std::fs;
use std::path::Path;

#[derive(Default, Debug)]
pub struct Categories {
    pub categories: HashMap<String, Category>,
}

impl Categories {
    // read all toys in data/items/*.json  and return a HashMap

    pub fn new() -> Self {
        let mut categories = HashMap::new();
        let path = Path::new("src/toy_catalog/data/categories");
        for dir in fs::read_dir(path).unwrap() {
            if let Ok(dir) = dir {
                let path = dir.path();
                let category = Category::read_category(&path);
                categories.insert(category.id.clone(), category);
            }
        }

        Self { categories }
    }
}
