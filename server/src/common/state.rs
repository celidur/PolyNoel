use super::user::User;
use crate::toy_catalog::algorithm::categories::Categories;
use crate::toy_catalog::toys::Toys;
use flate2::Compression;
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::{Read, Write};
use std::sync::Arc;
use std::time::Duration;
use tokio::sync::Mutex;
use tokio::time::sleep;

#[derive(Clone)]
pub struct App {
    pub users: Arc<Mutex<User>>,
    pub toys: Arc<Toys>,
    pub categories: Arc<Categories>,
}

impl App {
    fn new_blank() -> Self {
        let categories = Categories::new();
        Self {
            users: Arc::new(Mutex::new(User::new(&categories))),
            toys: Arc::new(Toys::new()),
            categories: Arc::new(categories),
        }
    }
    pub fn new() -> Self {
        let mut file_buffer = vec![];
        let Ok(mut file) = File::open("dump/dump.json.gz") else {
            return App::new_blank();
        };
        file.read_to_end(&mut file_buffer).unwrap();
        let mut decoder = flate2::write::GzDecoder::new(Vec::new());
        decoder.write_all(&file_buffer).unwrap();
        let mut buffer = decoder.finish().unwrap();
        let Ok(serializeable_app) = simd_json::from_slice::<SerializeableApp>(&mut buffer) else {
            return App::new_blank();
        };
        println!("Server restored");
        serializeable_app.into()
    }
    /// For all your persistence needs
    pub async fn dump_o_matic(&self) {
        loop {
            let serializable_app = SerializeableApp::from(self.clone()).await;
            let buffer = simd_json::to_vec_pretty(&serializable_app).unwrap();
            let file = File::create("dump/dump.json.gz").unwrap();
            let mut e = flate2::write::GzEncoder::new(file, Compression::default());
            e.write_all(&buffer).unwrap();
            e.finish().unwrap();
            sleep(Duration::from_secs(5 * 60)).await
        }
    }
}

#[derive(Clone, Serialize, Deserialize)]
struct SerializeableApp {
    pub users: User,
    pub toys: Arc<Toys>,
    pub categories: Arc<Categories>,
}

impl From<SerializeableApp> for App {
    fn from(value: SerializeableApp) -> Self {
        Self {
            users: Arc::new(Mutex::new(value.users)),
            toys: value.toys,
            categories: value.categories,
        }
    }
}

impl SerializeableApp {
    async fn from(value: App) -> Self {
        Self {
            users: value.users.lock().await.clone(),
            toys: value.toys,
            categories: value.categories,
        }
    }
}
