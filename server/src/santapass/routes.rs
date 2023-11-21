use crate::common::state::App;
use axum::{extract::State, http::StatusCode, response::IntoResponse, routing::get, Json, Router};

use super::santapass::SantPass;

pub fn routes() -> Router<App> {
    Router::new().route(
        "/santapass",
        get(get_santapass)
            .put(add_santapass)
            .delete(delete_santapass),
    )
}

#[utoipa::path(
    get,
    path = "/santapass",
    responses(
        (status = 200, description = "Get santapass", body = Vec<SantPass>),
    )
)]
pub async fn get_santapass(State(app): State<App>) -> impl IntoResponse {
    let user = app.users.lock().await;
    (StatusCode::OK, Json(user.battlepass.clone()))
}

#[utoipa::path(
    put,
    path = "/santapass",
    responses(
        (status = 200, description = "Add santapass"),
        (status = 400, description = "Already in the battlepass"),
    ),
    params(
        ("santapass" = SantPass, description = "new santapass")
    ),
)]
pub async fn add_santapass(
    State(app): State<App>,
    Json(santapass): Json<SantPass>,
) -> impl IntoResponse {
    let mut user = app.users.lock().await;
    if user
        .battlepass
        .iter()
        .any(|santapass| santapass.toy.id == santapass.toy.id)
    {
        return StatusCode::BAD_REQUEST;
    }
    user.battlepass.push(santapass);
    StatusCode::OK
}

#[utoipa::path(
    delete,
    path = "/santapass",
    responses(
        (status = 200, description = "Delete santapass"),
        (status = 404, description = "not found"),
    ),
    request_body = SantPass,
)]
pub async fn delete_santapass(
    State(app): State<App>,
    Json(santapass): Json<SantPass>,
) -> impl IntoResponse {
    let mut user = app.users.lock().await;
    if let Some(index) = user
        .battlepass
        .iter()
        .position(|s| s.toy.id == santapass.toy.id)
    {
        user.battlepass.remove(index);
        return StatusCode::OK;
    }
    StatusCode::NOT_FOUND
}
