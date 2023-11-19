use utoipa::OpenApi;

use crate::child_labor;
use crate::toy_catalog;

#[derive(OpenApi)]
#[openapi(
        paths(
            child_labor::routes::remove_task,
            child_labor::routes::get_tasks,
            child_labor::routes::add_task,
            child_labor::routes::mark_task_done,
            toy_catalog::routes::get_new_item,
            toy_catalog::routes::update_item,
            toy_catalog::routes::get_item,
            toy_catalog::routes::get_all_items,
            toy_catalog::routes::add_category,
            toy_catalog::routes::delete_category,
        ),
        components(
            schemas(child_labor::task::Task, child_labor::task::CreateTask, toy_catalog::toy::Toy, toy_catalog::routes::LikeToy)
        ),
        tags(
            (name = "PolyNoel", description = "A battlepass for christmas")
        )
    )]
pub struct ApiDoc;
