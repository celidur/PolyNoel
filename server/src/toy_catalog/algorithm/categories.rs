use super::category::Category;
use super::category::SimpleCategory;
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

    pub fn get_all_simple(&self, selected: &Categories) -> Vec<SimpleCategory> {
        self.iter()
            .map(|c| SimpleCategory {
                id: c.id.to_string(),
                name: c.name.to_string(),
                is_selected: selected
                    .iter()
                    .find(|selected| selected.id == c.id)
                    .is_some(),
            })
            .collect()
    }

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

    /// This only get existing category
    pub fn get(&self, id: &str) -> Option<&Category> {
        self.categories.iter().find(|c| c.id == id)
    }
}
