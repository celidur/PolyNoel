use crate::common::state::App;
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{delete, patch, post},
    Json, Router,
};

use super::task::{CreateTask, TaskStatus};

pub fn routes() -> Router<App> {
    Router::new()
        .route("/", post(add_task).get(get_tasks))
        .route("/:id", delete(remove_task))
        .route("/:id/:status", patch(change_task))
}

#[utoipa::path(
    post,
    path = "/child_labor/",
    request_body = CreateTask,
    responses(
        (status = 201, description = "Task created successfully", body = String),
    )
)]
pub async fn add_task(State(app): State<App>, Json(task): Json<CreateTask>) -> impl IntoResponse {
    let id = app.users.lock().await.tasks.push(task).id.clone();

    (StatusCode::CREATED, Json(id))
}

#[utoipa::path(
    delete,
    path = "/child_labor/{id}",
    responses(
        (status = 200, description = "Task deleted successfully"),
        (status = 404, description = "Task not found")
    ),
    params(
        ("id" = String, Path, description = "Task id")
    ),
)]
pub async fn remove_task(State(app): State<App>, Path(id): Path<String>) -> impl IntoResponse {
    match app.users.lock().await.tasks.remove(&id) {
        true => StatusCode::OK,
        false => StatusCode::NOT_FOUND,
    }
}

#[utoipa::path(
    get,
    path = "/child_labor/",
    responses(
        (status = 200, description = "List of tasks", body = Vec<Task>),
    ),
)]
pub async fn get_tasks(State(app): State<App>) -> impl IntoResponse {
    let tasks = app.users.lock().await.tasks.tasks.clone();
    (StatusCode::OK, Json(tasks))
}

#[utoipa::path(
    patch,
    path = "/child_labor/{id}/{status}",
    responses(
        (status = 200, description = "Task updated successfully"),
        (status = 404, description = "Task not found")
    ),
    params(
        ("id" = String, Path, description = "Task id"),
        ("status" = TaskStatus, description = "New status")
    ),
)]
pub async fn change_task(
    State(app): State<App>,
    Path((id, status)): Path<(String, TaskStatus)>,
) -> impl IntoResponse {
    match app.users.lock().await.tasks.mark(&id, status) {
        true => StatusCode::OK,
        false => StatusCode::NOT_FOUND,
    }
}
