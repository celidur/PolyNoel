use crate::common::state::App;
use axum::{
    extract::{State, Path},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post, put, patch},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

pub fn routes() -> Router<App> {
    Router::new()
        .route("/swip", get(get_new_item).patch(update_item))
        .route("/toy/:id", get(get_item).delete(delete_toy))
        .route("/toys", get(get_all_items))
        .route("/category/:id", post(add_category).delete(delete_category).get(get_category))
        .route("/category", get(get_categories))
        .route("/price_born", put(modify_price_born).get(get_price_born))
        .route("/rank/:id", get(get_rank))
        .route("/rank", patch(update_rank))
}

#[utoipa::path(
    get,
    path = "/toy_catalog/swip",
    responses(
        (status = 200, description = "Get new swip item", body = Toy),
        (status = 204, description = "No more item")
    )
)]
pub async fn get_new_item(State(app): State<App>) ->  Result<impl IntoResponse, impl IntoResponse> {
    let user = app.users.lock().await;
    if let Ok(item_id) = user.analytics.select(){
        let item = app.toys.toys.get(&item_id).unwrap().clone();
        Ok((StatusCode::OK, Json(item)))
    }else{
        Err(StatusCode::NO_CONTENT)
    }
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
        user.selected_item.insert(like_toy.item_id, 0);
    } else {
        user.disliked_item.insert(like_toy.item_id);
    }
    StatusCode::OK
}

#[utoipa::path(
    get,
    path = "/toy_catalog/toy/{id}",
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
        (status = 200, description = "Get all items id of select toy", body = Vec<String>),
    ),
)]
pub async fn get_all_items(State(app): State<App>) -> impl IntoResponse {
    let user = app.users.lock().await;
    let toys = user.selected_item.clone();
    (StatusCode::OK, Json(toys))
}

#[utoipa::path(
    post,
    path = "/toy_catalog/category/{id}",
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
    user.add_category(category, &app.toys);
    StatusCode::CREATED
}

#[utoipa::path(
    delete,
    path = "/toy_catalog/category/{id}",
    responses(
        (status = 200, description = "Category deleted successfully"),
    ),
    params(
        ("id" = String, Path, description = "id of toy")
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

#[utoipa::path(
    get,
    path = "/toy_catalog/category",
    responses(
        (status = 200, description = "Get all categories", body = Vec<SimpleCategory>),
    ),
)]
pub async fn get_categories(State(app): State<App>) -> impl IntoResponse {
    let user = app.users.lock().await;
    let simple_categories = app.categories.get_all_simple(&user.analytics.categories);
    (StatusCode::OK, Json(simple_categories))
}

#[utoipa::path(
    get,
    path = "/toy_catalog/category/{id}",
    responses(
        (status = 200, description = "Get a category", body = Option<Category>),
        (status = 404, description = "Category not found", body = Option<Category>),
    ),
    params(
        ("id" = String, Path, description = "id of toy")
    ),
)]
pub async fn get_category(State(app): State<App>, Path(id): Path<String>) -> impl IntoResponse {
    let category = app.users.lock().await.analytics.categories.get(&id).cloned();
    (StatusCode::OK, Json(category))
}

#[derive(Serialize, Deserialize, ToSchema, Debug, Default)]
pub struct NewPrice{
    inferior: u32,
    superior: u32,
}

#[utoipa::path(
    put,
    path = "/toy_catalog/price_born",
    responses(
        (status = 200, description = "Price born modified successfully"),
    ),
    params(
        ("price_born" = NewPrice, description = "price born of toy")
    ), 
)]
pub async fn modify_price_born(
    State(app): State<App>,
    Json(price_born): Json<NewPrice>,
) -> impl IntoResponse {
    let mut user = app.users.lock().await;
    let price_born = price_born.inferior..price_born.superior;
    user.modify_price_born(&app.categories, price_born, &app.toys);
    StatusCode::OK
}

#[utoipa::path(
    get,
    path = "/toy_catalog/price_born",
    responses(
        (status = 200, description = "Get price born", body = NewPrice),
    ),
)]
pub async fn get_price_born(State(app): State<App>) -> impl IntoResponse {
    let user = app.users.lock().await;
    let price_born = NewPrice{
        inferior: user.price_born.start,
        superior: user.price_born.end,
    };
    (StatusCode::OK, Json(price_born))
}

#[utoipa::path(
    delete,
    path = "/toy_catalog/toy/{id}",
    responses(
        (status = 200, description = "Toy deleted successfully of select toy"),
        (status = 404, description = "Toy not found")
    ),
    params(
        ("id" = String, Path, description = "id of toy")
    ), 
)]
pub async fn delete_toy(
    State(app): State<App>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    let mut user = app.users.lock().await;
    let res = user.remove_toy(&id);
    if !res {
        return StatusCode::NOT_FOUND;
    }
    StatusCode::OK
}


#[derive(Serialize, Deserialize, ToSchema, Debug, Default)]
pub struct UpdateRank{
    rank: u32,
    item_id: String,
}

#[utoipa::path(
    get,
    path = "/toy_catalog/rank/{id}",
    responses(
        (status = 200, description = "Get rank of category", body = u32),
        (status = 404, description = "Category not found")
    ),
    params(
        ("id" = String, Path, description = "id of toy")
    ), 
)]
pub async fn get_rank(
    State(app): State<App>,
    Path(id): Path<String>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let user = app.users.lock().await;
    let rank = user.selected_item.get(&id);
    if let Some(rank) = rank {
        Ok((StatusCode::OK, Json(*rank)))
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}

#[utoipa::path(
    patch,
    path = "/toy_catalog/rank",
    responses(
        (status = 200, description = "Rank modified successfully"),
        (status = 404, description = "Category not found")
    ),
    params(
        ("rank" = UpdateRank, description = "rank of toy")
    ),
)]
pub async fn update_rank(
    State(app): State<App>,
    Json(update_rank): Json<UpdateRank>,
) -> impl IntoResponse {
    let mut user = app.users.lock().await;
    let rank = user.selected_item.get_mut(&update_rank.item_id);
    if let Some(rank) = rank {
        *rank = update_rank.rank;
        StatusCode::OK
    } else {
        StatusCode::NOT_FOUND
    }
}


