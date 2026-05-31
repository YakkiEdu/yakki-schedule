use actix_web::{get, post, web, HttpResponse, Responder};
use crate::models::*;
use crate::solver::ScheduleSolver;

/// Health check endpoint
#[get("/health")]
pub async fn health() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "ok",
        "service": "yakki-schedule-api"
    }))
}

/// Generate schedule from configuration
#[post("/api/schedule/generate")]
pub async fn generate_schedule(config: web::Json<SchoolConfig>) -> impl Responder {
    let solver = ScheduleSolver::new(config.into_inner());
    let result = solver.solve();
    HttpResponse::Ok().json(result)
}

/// Get default week grid (Israeli school week)
#[get("/api/defaults/week-grid")]
pub async fn get_default_week_grid() -> impl Responder {
    HttpResponse::Ok().json(WeekGrid::default())
}

/// Get sample subjects (Hebrew)
#[get("/api/defaults/subjects")]
pub async fn get_default_subjects() -> impl Responder {
    let subjects = vec![
        Subject::new("מתמטיקה", "מתמ"),
        Subject::new("אנגלית", "אנג"),
        Subject::new("עברית", "עבר"),
        Subject::new("תנ\"ך", "תנך"),
        Subject::new("היסטוריה", "היס"),
        Subject::new("גיאוגרפיה", "גאו"),
        Subject::new("מדעים", "מדע"),
        Subject::new("פיזיקה", "פיז"),
        Subject::new("כימיה", "כימ"),
        Subject::new("ביולוגיה", "ביו"),
        Subject::new("חינוך גופני", "חנג"),
        Subject::new("אומנות", "אמנ"),
        Subject::new("מוזיקה", "מוז"),
        Subject::new("מחשבים", "מחש"),
        Subject::new("אזרחות", "אזר"),
        Subject::new("ספרות", "ספר"),
    ];
    HttpResponse::Ok().json(subjects)
}

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(health)
        .service(generate_schedule)
        .service(get_default_week_grid)
        .service(get_default_subjects);
}
