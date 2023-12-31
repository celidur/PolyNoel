use api_doc::ApiDoc;
use axum::{
    http::{
        header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE, ORIGIN},
        Method, Request,
    },
    Router,
};
use common::state::App;
use tower_http::{
    cors::{Any, CorsLayer},
    trace::TraceLayer,
};
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

    let cors = CorsLayer::new()
        // allow `GET` and `POST` when accessing the resource
        .allow_methods([
            Method::GET,
            Method::PATCH,
            Method::POST,
            Method::DELETE,
            Method::PUT,
        ])
        // allow requests from any origin
        .allow_origin(Any)
        .allow_headers([CONTENT_TYPE, ORIGIN, ACCEPT, AUTHORIZATION]);

    let state = App::new();

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
        .layer(cors)
        .with_state(state.clone());

    let _ = tokio::join!(
        axum::Server::bind(&"0.0.0.0:6969".parse().unwrap()).serve(app.into_make_service()),
        state.dump_o_matic()
    );
}
