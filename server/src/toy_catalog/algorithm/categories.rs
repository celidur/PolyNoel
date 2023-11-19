use super::category::Category;
use std::fs;
use std::ops::Deref;
use std::ops::DerefMut;
use std::path::Path;

#[derive(Default, Debug, Clone)]
pub struct Categories {
    pub categories: Vec<Category>,
}

impl DerefMut for Categories {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.categories
    }
}

impl Deref for Categories {
    type Target = Vec<Category>;

    fn deref(&self) -> &Self::Target {
        &self.categories
    }
}

impl Categories {
    // read all toys in data/items/*.json  and return a HashMap

    pub fn new() -> Self {
        let mut categories = Vec::new();
        let path = Path::new("src/toy_catalog/data/categories");
        for dir in fs::read_dir(path).unwrap() {
            if let Ok(dir) = dir {
                let path = dir.path();
                let category = Category::read_category(&path);
                categories.push(category);
            }
        }

        Self { categories }
    }
}
