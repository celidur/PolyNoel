use crate::common::state::App;
use axum::{
    extract::{State, Path},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post, patch},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use super::algorithm::categories;

pub fn routes() -> Router<App> {
    Router::new()
        .route("/swip", get(get_new_item).patch(update_item))
        .route("/:id", get(get_item))
        .route("/toys", get(get_all_items))
}

#[utoipa::path(
    get,
    path = "/swip/",
    responses(
        (status = 200, description = "Get new swip item", body = Toy),
    )
)]
pub async fn get_new_item(State(app): State<App>) -> impl IntoResponse {
    let user = app.users.lock().await;
    let item_id = user.analytics.select();
    let item = app.toys.toys.get(&item_id).unwrap().clone();
    (StatusCode::OK, Json(item))
}

#[derive(Serialize, Deserialize, ToSchema, Debug, Default)]
pub struct LikeToy {
    like: bool,
    item_id: String,
}

#[utoipa::path(
    patch,
    path = "/swip/",
    responses(
        (status = 200, description = "Item modify"),
        (status = 404, description = "Item not found")
    )
)]
pub async fn update_item(
    State(app): State<App>,
    Json(like_toy): Json<LikeToy>,
) -> impl IntoResponse {
    let mut user = app.users.lock().await;
    let item = app.toys.toys.get(&like_toy.item_id).unwrap();
    let categories = &item.categories;
    let res = user
        .analytics
        .add_review(&like_toy.item_id, categories, like_toy.like);
    if !res {
        return StatusCode::NOT_FOUND;
    }
    if like_toy.like {
        user.selected_item.insert(like_toy.item_id);
    } else {
        user.disliked_item.insert(like_toy.item_id);
    }
    StatusCode::OK
}

#[utoipa::path(
    get,
    path = "/:id",
    responses(
        (status = 200, description = "Get item", body = Toy),
        (status = 404, description = "Item not found")
    ),
    params(
        ("id" = i32, Path, description = "id of toy")
    ), 
)]
pub async fn get_item(State(app): State<App>, Path(id): Path<String>) -> Result<impl IntoResponse, impl IntoResponse> {
    let item = app.toys.toys.get(&id).cloned();
    if let Some(item) = item {
        Ok((StatusCode::OK, Json(item)))
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}

#[utoipa::path(
    get,
    path = "/toys/",
    responses(
        (status = 200, description = "Get all items", body = Vec<Toy>),
    ),
)]
pub async fn get_all_items(State(app): State<App>) -> impl IntoResponse {
    let user = app.users.lock().await;
    let toys = user.selected_item.clone();
    (StatusCode::OK, Json(toys))
}
