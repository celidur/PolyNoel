use crate::common::state::App;
use axum::{
    extract::{State, Path},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

pub fn routes() -> Router<App> {
    Router::new()
        .route("/swip", get(get_new_item).patch(update_item))
        .route("/toy/:id", get(get_item))
        .route("/toys", get(get_all_items))
        .route("/category/:id", post(add_category).delete(delete_category))
}

#[utoipa::path(
    get,
    path = "/toy_catalog/swip",
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
    path = "/toy_catalog/swip",
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
    path = "/toy_catalog/toy/:id",
    responses(
        (status = 200, description = "Get item", body = Toy),
        (status = 404, description = "Item not found")
    ),
    params(
        ("id" = String, Path, description = "id of toy")
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
    path = "/toy_catalog/toys",
    responses(
        (status = 200, description = "Get all items", body = Vec<Toy>),
    ),
)]
pub async fn get_all_items(State(app): State<App>) -> impl IntoResponse {
    let user = app.users.lock().await;
    let toys = user.selected_item.clone();
    (StatusCode::OK, Json(toys))
}

#[utoipa::path(
    post,
    path = "/toy_catalog/category",
    responses(
        (status = 201, description = "Category created successfully", body = String),
    ),
    params(
        ("id" = String, Path, description = "id of toy")
    ), 
)]
pub async fn add_category(
    State(app): State<App>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    let mut user = app.users.lock().await;
    let category = app.categories.categories.iter().filter(|c| c.id == id).next().unwrap().clone();
    user.add_category(category);
    StatusCode::CREATED
}

#[utoipa::path(
    delete,
    path = "/toy_catalog/category",
    responses(
        (status = 200, description = "Category deleted successfully"),
    ),
    params(
        ("id" = i32, Path, description = "id of toy")
    ), 
)]
pub async fn delete_category(
    State(app): State<App>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    let mut user = app.users.lock().await;
    user.remove_category(&id);
    StatusCode::OK
}