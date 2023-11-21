use utoipa::OpenApi;

use crate::child_labor;
use crate::santapass;
use crate::toy_catalog;

#[derive(OpenApi)]
#[openapi(
        paths(
            child_labor::routes::remove_task,
            child_labor::routes::get_tasks,
            child_labor::routes::add_task,
            child_labor::routes::change_task,
            toy_catalog::routes::get_new_item,
            toy_catalog::routes::update_item,
            toy_catalog::routes::get_item,
            toy_catalog::routes::delete_toy,
            toy_catalog::routes::get_all_items,
            toy_catalog::routes::add_category,
            toy_catalog::routes::delete_category,
            toy_catalog::routes::get_categories,
            toy_catalog::routes::get_category,
            toy_catalog::routes::modify_price_born,
            toy_catalog::routes::get_price_born,
            toy_catalog::routes::get_rank,
            toy_catalog::routes::update_rank,
            santapass::routes::get_santapass,
            santapass::routes::add_santapass,
            santapass::routes::delete_santapass,
        ),
        components(
            schemas(
                child_labor::task::Task,
                child_labor::task::CreateTask,
                child_labor::task::TaskStatus,
                toy_catalog::toy::Toy,
                toy_catalog::routes::LikeToy,
                toy_catalog::algorithm::category::SimpleCategory,
                toy_catalog::algorithm::category::Category,
                toy_catalog::routes::NewPrice,
                toy_catalog::routes::UpdateRank,
                santapass::santapass::SantPass,
            )
        ),
        tags(
            (name = "PolyNoel", description = "A battlepass for christmas")
        )
    )]
pub struct ApiDoc;
