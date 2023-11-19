use std::sync::Arc;
use tokio::sync::Mutex;

use super::user::User;
use crate::toy_catalog::categories::Categories;
use crate::toy_catalog::toys::Toys;

#[derive(Clone)]
pub struct App {
    pub users: Arc<Mutex<User>>,
    pub toys: Arc<Toys>,
    pub categories: Arc<Categories>,
}

impl App {
    pub fn new() -> App {
        Self {
            users: Arc::new(Mutex::new(User::default())),
            toys: Arc::new(Toys::new()),
            categories: Arc::new(Categories::new()),
        }
    }
}
