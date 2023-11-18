use super::task::Task;

use aide::axum::IntoApiResponse;
use axum::http::StatusCode;
use axum_jsonschema::Json;

pub struct Tasks {
    tasks: Vec<Task>,
}

pub async fn add_task(Json(payload): Json<Task>) -> impl IntoApiResponse {
    // self.tasks.push(payload);
    StatusCode::CREATED
}
