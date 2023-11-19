use crate::child_labor::tasks::Tasks;

#[derive(Default)]
pub struct User {
    pub tasks: Tasks,
    pub categories: Vec<String>,
    pub select_item: Vec<String>,
}

impl User {
    pub fn add_category(&mut self, category: String) {
        self.categories.push(category);
    }
}
