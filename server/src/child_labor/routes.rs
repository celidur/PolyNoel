use super::tasks::{add_task, get_tasks, mark_task_done, remove_task};
use crate::common::state::App;
use axum::{
    routing::{patch, post},
    Router,
};

pub fn routes() -> Router<App> {
    Router::new()
        .route("/", post(add_task).get(get_tasks))
        .route("/:id", patch(mark_task_done).delete(remove_task))
}
