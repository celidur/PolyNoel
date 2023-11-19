use crate::common::state::App;
use axum::Router;

pub fn routes() -> Router<App> {
    Router::new()
}
