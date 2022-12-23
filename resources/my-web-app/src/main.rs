use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use std::env;

const ENV_HOST: &str = "HOST";
const ENV_PORT: &str = "PORT";
const DEFAULT_HOST: &str = "0.0.0.0";
const DEFAULT_PORT: u16 = 8080;

#[get("/")]
async fn index() -> impl Responder {
    HttpResponse::Ok().body("Hello!\n")
}

#[get("/{path:.*}")]
async fn from_path(path: web::Path<String>) -> impl Responder {
    HttpResponse::Ok().body(format!("Hello from {}\n", path))
}

#[post("/echo")]
async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let host = env::var(ENV_HOST).unwrap_or(DEFAULT_HOST.to_string());
    let port = env::var(ENV_PORT).unwrap_or(DEFAULT_PORT.to_string()).parse::<u16>().unwrap_or(DEFAULT_PORT);
    println!("Listening on http://{}:{}/", host, port);
    HttpServer::new(|| {
        App::new()
            .service(index)
            .service(from_path)
            .service(echo)
    })
    .bind((host, port))?
    .run()
    .await
}