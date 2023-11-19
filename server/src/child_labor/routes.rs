use super::tasks::{add_task, get_tasks, mark_task_done, remove_task};
use crate::common::state::App;
use aide::axum::{
    routing::{get, post},
    ApiRouter,
};

pub fn routes(app: &App) -> ApiRouter {
    ApiRouter::new()
        .api_route("/remove_task", post(remove_task))
        .api_route("/get_tasks", get(get_tasks))
        .api_route("/mark_task_done", post(mark_task_done))
        .api_route("/add_task", post(add_task))
        .with_state(app.clone())
}
