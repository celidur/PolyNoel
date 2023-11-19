use std::sync::Arc;
use tokio::sync::Mutex;

use super::user::User;

#[derive(Clone)]
pub struct App {
    pub users: Arc<Mutex<User>>,
}

impl App {
    pub fn new() -> App {
        Self {
            users: Arc::new(Mutex::new(User::default())),
        }
    }
}
