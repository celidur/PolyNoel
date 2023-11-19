use crate::common::state::App;
use aide::axum::ApiRouter;

pub fn routes(app: &App) -> ApiRouter {
    ApiRouter::new().with_state(app.clone())
}
