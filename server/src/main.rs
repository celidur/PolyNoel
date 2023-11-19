use api_doc::ApiDoc;
use axum::{http::Request, Router};
use common::state::App;
use tower_http::trace::TraceLayer;
use tracing::Span;
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

mod api_doc;
mod child_labor;
mod common;
mod santapass;
mod toy_catalog;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let state = App::new();

    println!("{:?}", state.toys);

    let app = Router::new()
        .nest("/child_labor/", child_labor::routes::routes())
        .nest("/santapass/", santapass::routes::routes())
        .nest("/toy_catalog/", toy_catalog::routes::routes())
        .merge(SwaggerUi::new("/doc").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .layer(
            TraceLayer::new_for_http().on_request(|request: &Request<_>, _span: &Span| {
                println!("{:?} {}", request.method(), request.uri());
            }),
        )
        .with_state(state);

    axum::Server::bind(&"0.0.0.0:6969".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
