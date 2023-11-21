use crate::common::state::App;
use axum::{extract::{State, Path}, http::StatusCode, response::IntoResponse, routing::{get, delete}, Json, Router};

use super::santapass::SantPass;

pub fn routes() -> Router<App> {
    Router::new().route(
        "/",
        get(get_santapass)
            .post(add_santapass)

    ).route("/:id", delete(delete_santapass))
}

#[utoipa::path(
    get,
    path = "/santapass/",
    responses(
        (status = 200, description = "Get santapass", body = Vec<SantPass>),
    )
)]
pub async fn get_santapass(State(app): State<App>) -> impl IntoResponse {
    let user = app.users.lock().await;
    (StatusCode::OK, Json(user.battlepass.clone()))
}

#[utoipa::path(
    post,
    path = "/santapass/",
    responses(
        (status = 200, description = "Add santapass"),
        (status = 400, description = "Already in the battlepass"),
    ),
    request_body = SantPass,
)]
pub async fn add_santapass(
    State(app): State<App>,
    Json(santapass): Json<SantPass>,
) -> impl IntoResponse {
    let mut user = app.users.lock().await;
    if user.battlepass.iter().any(|s| s.toy == santapass.toy) {
        return StatusCode::BAD_REQUEST;
    }
    user.battlepass.push(santapass);
    StatusCode::OK
}

#[utoipa::path(
    delete,
    path = "/santapass/:id",
    responses(
        (status = 200, description = "Delete santapass"),
        (status = 404, description = "not found"),
    ),
    params(
        ("id" = String, Path, description = "id of toy")
    ), 
)]
pub async fn delete_santapass(
    State(app): State<App>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    let mut user = app.users.lock().await;
    if let Some(index) = user.battlepass.iter().position(|s| s.toy == id) {
        user.battlepass.remove(index);
        return StatusCode::OK;
    }
    StatusCode::NOT_FOUND
}
