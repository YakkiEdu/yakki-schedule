mod api;
mod models;
mod solver;

use actix_cors::Cors;
use actix_web::{App, HttpServer};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    println!("Starting YAKKI Schedule API on http://localhost:3001");

    HttpServer::new(|| {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();

        App::new()
            .wrap(cors)
            .configure(api::configure)
    })
    .bind("127.0.0.1:3001")?
    .run()
    .await
}
