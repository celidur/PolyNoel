use crate::common::state::App;
use axum::{extract::{State, Path}, http::StatusCode, response::IntoResponse, routing::{get, delete, patch}, Json, Router};

use super::battlepass::SantaPass;

pub fn routes() -> Router<App> {
    Router::new()
    .route(
        "/",
        get(get_santapass)
            .post(add_santapass))
    .route("/:id", delete(delete_santapass))
    .route("/:id/:score", patch(modify_santapass))
    .route("/deadline/", get(get_deadline))
    .route("/deadline/:dayLeft", patch(set_deadline))
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
    Json(santapass): Json<SantaPass>,
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

#[utoipa::path(
    patch,
    path = "/santapass/{id}/{score}",
    responses(
        (status = 200, description = "Modified santapass"),
        (status = 404, description = "not found")
    ),
    params(
        ("id" = String, Path, description = "santapass id"),
        ("score" = String, description = "new Score")
    ),
)]
pub async fn modify_santapass(
    State(app): State<App>,
    Path((id, score)): Path<(String, String)>,
) -> impl IntoResponse {
    let mut user = app.users.lock().await;
    if let Some(index) = user.battlepass.iter().position(|s| s.toy == id) {
        match score.parse::<u32>() {
            Ok(n) =>{
                user.battlepass[index].points = n;
                return StatusCode::OK;

            },
            Err(_) => {
                return StatusCode::NOT_FOUND;
            },
          }
    }
    StatusCode::NOT_FOUND

}
#[utoipa::path(
    get,
    path = "/santapass/deadline/",
    responses(
        (status = 200, description = "Day of the year", body = u16),
    ),
)]
pub async fn get_deadline(State(app): State<App>) -> impl IntoResponse {
    let date = app.users.lock().await.deadline;
    (StatusCode::OK, Json(date))
}

#[utoipa::path(
    patch,
    path = "/santapass/deadline/{dayLeft}",
    responses(
        (status = 200, description = "Edit day of the year"),
    ),
    params(
        ("dayLeft" = String, Path, description = "day ")
    ), 
)]
pub async fn set_deadline(State(app): State<App>, Path(day_left): Path<u16>) -> impl IntoResponse {
    app.users.lock().await.deadline = day_left;
    StatusCode::OK
}