use super::task::{CreateTask, Task};
use crate::common::state::App;
use aide::axum::IntoApiResponse;
use axum::{extract::State, http::StatusCode};
use axum_jsonschema::Json;

#[derive(Debug, Default)]
pub struct Tasks {
    tasks: Vec<Task>,
}

impl Tasks {
    fn push(&mut self, task: CreateTask) {
        self.tasks.push(task.build());
    }
}

pub async fn add_task(
    State(app): State<App>,
    Json(task): Json<CreateTask>,
) -> impl IntoApiResponse {
    app.users.lock().await.tasks.push(task);
    StatusCode::CREATED
}

pub async fn remove_task(State(app): State<App>, Json(id): Json<String>) -> impl IntoApiResponse {
    let tasks = &mut app.users.lock().await.tasks.tasks;
    if let Some(i) = tasks.iter().position(|t| t.id == id) {
        tasks.remove(i);
        StatusCode::OK
    } else {
        StatusCode::NOT_FOUND
    }
}
