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
    fn push(&mut self, task: CreateTask) -> &Task {
        self.tasks.push(task.build());
        self.tasks.last().unwrap()
    }
    fn remove(&mut self, id: &str) -> bool {
        if let Some(i) = self.tasks.iter().position(|t| t.id == id) {
            self.tasks.remove(i);
            true
        } else {
            false
        }
    }
    fn mark_done(&mut self, id: &str) -> bool {
        if let Some(task) = self.tasks.iter_mut().find(|t| t.id == id) {
            task.need_review = true;
            true
        } else {
            false
        }
    }
}

/// Return the id of the added task
pub async fn add_task(
    State(app): State<App>,
    Json(task): Json<CreateTask>,
) -> impl IntoApiResponse {
    let id = app.users.lock().await.tasks.push(task).id.clone();

    (StatusCode::CREATED, Json(id))
}

pub async fn remove_task(State(app): State<App>, Json(id): Json<String>) -> impl IntoApiResponse {
    match app.users.lock().await.tasks.remove(&id) {
        true => StatusCode::OK,
        false => StatusCode::NOT_FOUND,
    }
}

pub async fn get_tasks(State(app): State<App>) -> impl IntoApiResponse {
    let tasks = app.users.lock().await.tasks.tasks.clone();
    (StatusCode::OK, Json(tasks))
}

pub async fn mark_task_done(
    State(app): State<App>,
    Json(id): Json<String>,
) -> impl IntoApiResponse {
    match app.users.lock().await.tasks.mark_done(&id) {
        true => StatusCode::OK,
        false => StatusCode::NOT_FOUND,
    }
}
