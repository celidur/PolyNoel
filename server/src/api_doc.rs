use utoipa::OpenApi;

use crate::child_labor;

#[derive(OpenApi)]
#[openapi(
        paths(
            child_labor::tasks::remove_task,
            child_labor::tasks::get_tasks,
            child_labor::tasks::add_task,
            child_labor::tasks::mark_task_done
        ),
        components(
            schemas(child_labor::task::Task, child_labor::task::CreateTask)
        ),
        tags(
            (name = "PolyNoel", description = "A battlepass for christmas")
        )
    )]
pub struct ApiDoc;
