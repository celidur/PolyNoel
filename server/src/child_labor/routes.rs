use super::tasks::add_task;
use aide::axum::{routing::post, ApiRouter};

pub fn routes() -> ApiRouter {
    ApiRouter::new().api_route("/child_labor/add_task", post(add_task))
}
