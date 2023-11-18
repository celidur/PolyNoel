use super::task::Task;
use crate::common::state::App;
use aide::axum::IntoApiResponse;
use axum::{extract::State, http::StatusCode};
use axum_jsonschema::Json;

#[derive(Debug, Default)]
pub struct Tasks {
    tasks: Vec<Task>,
}

pub async fn add_task(State(app): State<App>, Json(task): Json<Task>) -> impl IntoApiResponse {
    app.users.lock().await.tasks.tasks.push(task);
    StatusCode::CREATED
}
