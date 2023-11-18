use aide::{
    axum::{routing::get, ApiRouter, IntoApiResponse},
    openapi::{Info, OpenApi},
    redoc::Redoc,
};
use axum::{http::Request, Extension, Json};
use tower_http::trace::TraceLayer;
use tracing::Span;

mod child_labor;
mod santapass;
mod state;
mod toy_catalog;

// Note that this clones the document on each request.
// To be more efficient, we could wrap it into an Arc,
// or even store it as a serialized string.
async fn serve_api(Extension(api): Extension<OpenApi>) -> impl IntoApiResponse {
    Json(api)
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let app = ApiRouter::new()
        .merge(child_labor::routes::routes())
        .merge(santapass::routes::routes())
        .merge(toy_catalog::routes::routes())
        .route("/api.json", get(serve_api))
        .route("/doc", Redoc::new("/api.json").axum_route())
        .layer(
            TraceLayer::new_for_http().on_request(|request: &Request<_>, _span: &Span| {
                println!("{:?} {}", request.method(), request.uri());
            }),
        );

    let mut api = OpenApi {
        info: Info {
            title: "PolyNoel".to_string(),
            summary: Some("Une liste de Noel".to_string()),
            ..Info::default()
        },
        ..OpenApi::default()
    };

    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(
            app
                // Generate the documentation.
                .finish_api(&mut api)
                .layer(Extension(api))
                .into_make_service(),
        )
        .await
        .unwrap();
}
