use super::tasks::{add_task, remove_task};
use crate::common::state::App;
use aide::axum::{routing::post, ApiRouter};

pub fn routes() -> ApiRouter<App> {
    ApiRouter::new()
        .api_route("/add_task", post(add_task))
        .api_route("/remove_task", post(remove_task))
}
