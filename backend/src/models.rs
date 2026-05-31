use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// School class (e.g., "ז'1", "ח'2")
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SchoolClass {
    pub id: String,
    pub name: String,
    /// Default home room for this class
    pub home_room_id: Option<String>,
    pub subjects: Vec<ClassSubject>,
}

/// Subject assignment for a class
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClassSubject {
    pub subject_id: String,
    pub hours_per_week: u8,
    pub split_groups: bool,
    /// Teacher IDs (1 or 2 if split into groups)
    pub teacher_ids: Vec<String>,
    /// Override room (e.g., gym, lab) - if not set, uses class homeRoom
    pub room_id: Option<String>,
    pub preferences: SubjectPreferences,
}

/// Preferences for scheduling a subject
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SubjectPreferences {
    /// Should be scheduled as double lessons
    pub paired: bool,
    /// Prefer morning slots (lessons 1-3)
    pub prefer_morning: bool,
    /// Prefer afternoon slots (lessons 4+)
    pub prefer_afternoon: bool,
}

/// Teacher
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Teacher {
    pub id: String,
    pub name: String,
    /// Preferred day off (0=Sunday, 1=Monday, ..., 5=Friday), None if no preference
    pub day_off: Option<u8>,
}

/// Subject definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Subject {
    pub id: String,
    pub name: String,
    /// Short name for timetable display
    pub short_name: String,
}

/// Weekly schedule grid configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WeekGrid {
    /// Max lessons per day [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday]
    pub max_lessons: [u8; 6],
}

impl Default for WeekGrid {
    fn default() -> Self {
        // Israeli school week: Sun-Thu active, Fri minimal
        Self {
            max_lessons: [8, 8, 8, 8, 8, 0],
        }
    }
}

/// Room / Classroom
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Room {
    pub id: String,
    pub name: String,
    #[serde(rename = "type")]
    pub room_type: String, // "regular", "lab", "gym", "art", "library"
    pub capacity: Option<u32>,
}

/// Bell schedule event (prayer, lesson, break)
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BellEvent {
    pub id: String,
    #[serde(rename = "type")]
    pub event_type: String, // "prayer", "lesson", "break", "longBreak"
    pub name: String,
    pub start_time: String, // "HH:MM"
    pub end_time: String,   // "HH:MM"
    pub order: u32,
}

/// Complete school configuration for schedule generation
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SchoolConfig {
    pub classes: Vec<SchoolClass>,
    pub teachers: Vec<Teacher>,
    pub subjects: Vec<Subject>,
    pub rooms: Vec<Room>,
    pub bell_schedule: Vec<BellEvent>,
    pub week_grid: WeekGrid,
}

/// A single lesson in the generated schedule
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ScheduledLesson {
    pub class_id: String,
    pub subject_id: String,
    pub teacher_id: String,
    pub room_id: String,
    /// 0=Sunday, 1=Monday, etc.
    pub day: u8,
    /// 1-based lesson number
    pub lesson_number: u8,
    /// Group number (0 = whole class, 1 or 2 for split groups)
    pub group: u8,
}

/// Generated schedule result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GeneratedSchedule {
    pub lessons: Vec<ScheduledLesson>,
    pub conflicts: Vec<ScheduleConflict>,
    pub score: f64,
}

/// Schedule conflict or warning
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ScheduleConflict {
    pub severity: ConflictSeverity,
    pub message: String,
    pub affected_lessons: Vec<usize>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ConflictSeverity {
    Error,
    Warning,
    Info,
}

impl SchoolClass {
    pub fn new(name: &str) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            name: name.to_string(),
            home_room_id: None,
            subjects: Vec::new(),
        }
    }
}

impl Teacher {
    pub fn new(name: &str) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            name: name.to_string(),
            day_off: None,
        }
    }
}

impl Subject {
    pub fn new(name: &str, short_name: &str) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            name: name.to_string(),
            short_name: short_name.to_string(),
        }
    }
}
