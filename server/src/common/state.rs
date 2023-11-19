use std::sync::Arc;
use tokio::sync::Mutex;

use super::user::User;
use crate::toy_catalog::algorithm::categories::Categories;
use crate::toy_catalog::toys::Toys;

#[derive(Clone)]
pub struct App {
    pub users: Arc<Mutex<User>>,
    pub toys: Arc<Toys>,
    pub categories: Arc<Categories>,
}

impl App {
    pub fn new() -> App {
        let categories = Categories::new();
        Self {
            users: Arc::new(Mutex::new(User::new(&categories))),
            toys: Arc::new(Toys::new()),
            categories: Arc::new(categories),
        }
    }
}
