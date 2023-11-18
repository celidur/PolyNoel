use crate::common::state::App;
use aide::axum::ApiRouter;

pub fn routes() -> ApiRouter<App> {
    ApiRouter::new()
}
