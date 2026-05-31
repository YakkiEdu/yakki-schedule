use crate::models::*;
use rand::prelude::*;
use std::collections::HashMap;

/// Constraint-based schedule solver
pub struct ScheduleSolver {
    config: SchoolConfig,
}

#[derive(Debug, Clone)]
struct Slot {
    day: u8,
    lesson: u8,
}

impl ScheduleSolver {
    pub fn new(config: SchoolConfig) -> Self {
        Self { config }
    }

    /// Generate schedule using constraint satisfaction + local search
    pub fn solve(&self) -> GeneratedSchedule {
        let mut lessons = Vec::new();
        let mut conflicts = Vec::new();

        // Track teacher assignments: (teacher_id, day, lesson) -> is_occupied
        let mut teacher_schedule: HashMap<(String, u8, u8), bool> = HashMap::new();
        // Track class assignments: (class_id, day, lesson, group) -> is_occupied
        let mut class_schedule: HashMap<(String, u8, u8, u8), bool> = HashMap::new();

        // Process each class
        for class in &self.config.classes {
            for class_subject in &class.subjects {
                let hours = class_subject.hours_per_week;
                let paired = class_subject.preferences.paired;
                let prefer_morning = class_subject.preferences.prefer_morning;
                let prefer_afternoon = class_subject.preferences.prefer_afternoon;

                // Get teacher(s) for this subject
                let teacher_ids = &class_subject.teacher_ids;

                // Find day_off preferences for teachers
                let teacher_days_off: Vec<Option<u8>> = teacher_ids
                    .iter()
                    .filter_map(|tid| {
                        self.config.teachers.iter().find(|t| &t.id == tid)
                    })
                    .map(|t| t.day_off)
                    .collect();

                let groups = if class_subject.split_groups { vec![1, 2] } else { vec![0] };
                let hours_per_group = if class_subject.split_groups {
                    hours
                } else {
                    hours
                };

                for (group_idx, &group) in groups.iter().enumerate() {
                    let teacher_id = teacher_ids.get(group_idx).or(teacher_ids.first());
                    let teacher_id = match teacher_id {
                        Some(id) => id.clone(),
                        None => continue,
                    };

                    let teacher_day_off = teacher_days_off.get(group_idx).copied().flatten();

                    let mut remaining_hours = hours_per_group;
                    let mut attempts = 0;

                    while remaining_hours > 0 && attempts < 1000 {
                        attempts += 1;

                        // Find available slot
                        if let Some((day, lesson)) = self.find_slot(
                            &class.id,
                            &teacher_id,
                            group,
                            teacher_day_off,
                            prefer_morning,
                            prefer_afternoon,
                            paired && remaining_hours >= 2,
                            &teacher_schedule,
                            &class_schedule,
                        ) {
                            // Schedule the lesson
                            lessons.push(ScheduledLesson {
                                class_id: class.id.clone(),
                                subject_id: class_subject.subject_id.clone(),
                                teacher_id: teacher_id.clone(),
                                day,
                                lesson_number: lesson,
                                group,
                            });

                            teacher_schedule.insert((teacher_id.clone(), day, lesson), true);
                            class_schedule.insert((class.id.clone(), day, lesson, group), true);
                            if group == 0 {
                                // Whole class also blocks both groups
                                class_schedule.insert((class.id.clone(), day, lesson, 1), true);
                                class_schedule.insert((class.id.clone(), day, lesson, 2), true);
                            }

                            remaining_hours -= 1;

                            // If paired, try to schedule second lesson immediately after
                            if paired && remaining_hours > 0 {
                                let next_lesson = lesson + 1;
                                if self.is_slot_available(
                                    &class.id,
                                    &teacher_id,
                                    group,
                                    day,
                                    next_lesson,
                                    &teacher_schedule,
                                    &class_schedule,
                                ) && next_lesson <= self.config.week_grid.max_lessons[day as usize]
                                {
                                    lessons.push(ScheduledLesson {
                                        class_id: class.id.clone(),
                                        subject_id: class_subject.subject_id.clone(),
                                        teacher_id: teacher_id.clone(),
                                        day,
                                        lesson_number: next_lesson,
                                        group,
                                    });

                                    teacher_schedule.insert((teacher_id.clone(), day, next_lesson), true);
                                    class_schedule.insert((class.id.clone(), day, next_lesson, group), true);
                                    if group == 0 {
                                        class_schedule.insert((class.id.clone(), day, next_lesson, 1), true);
                                        class_schedule.insert((class.id.clone(), day, next_lesson, 2), true);
                                    }

                                    remaining_hours -= 1;
                                }
                            }
                        }
                    }

                    if remaining_hours > 0 {
                        conflicts.push(ScheduleConflict {
                            severity: ConflictSeverity::Error,
                            message: format!(
                                "Could not schedule {} hours for subject {} in class {} (group {})",
                                remaining_hours,
                                class_subject.subject_id,
                                class.name,
                                group
                            ),
                            affected_lessons: vec![],
                        });
                    }
                }
            }
        }

        // Calculate score (higher is better)
        let score = self.calculate_score(&lessons, &conflicts);

        // Local search optimization
        let optimized = self.local_search(lessons, &mut teacher_schedule, &mut class_schedule);

        GeneratedSchedule {
            lessons: optimized,
            conflicts,
            score,
        }
    }

    fn find_slot(
        &self,
        class_id: &str,
        teacher_id: &str,
        group: u8,
        teacher_day_off: Option<u8>,
        prefer_morning: bool,
        prefer_afternoon: bool,
        need_consecutive: bool,
        teacher_schedule: &HashMap<(String, u8, u8), bool>,
        class_schedule: &HashMap<(String, u8, u8, u8), bool>,
    ) -> Option<(u8, u8)> {
        let mut rng = rand::thread_rng();
        let mut candidates: Vec<(u8, u8)> = Vec::new();

        for day in 0..6u8 {
            // Skip teacher's day off
            if teacher_day_off == Some(day) {
                continue;
            }

            let max_lessons = self.config.week_grid.max_lessons[day as usize];
            if max_lessons == 0 {
                continue;
            }

            for lesson in 1..=max_lessons {
                if self.is_slot_available(
                    class_id,
                    teacher_id,
                    group,
                    day,
                    lesson,
                    teacher_schedule,
                    class_schedule,
                ) {
                    // Check consecutive availability if needed
                    if need_consecutive {
                        if lesson < max_lessons
                            && self.is_slot_available(
                                class_id,
                                teacher_id,
                                group,
                                day,
                                lesson + 1,
                                teacher_schedule,
                                class_schedule,
                            )
                        {
                            candidates.push((day, lesson));
                        }
                    } else {
                        candidates.push((day, lesson));
                    }
                }
            }
        }

        if candidates.is_empty() {
            return None;
        }

        // Prioritize based on preferences
        if prefer_morning {
            candidates.sort_by_key(|(_, l)| *l);
        } else if prefer_afternoon {
            candidates.sort_by_key(|(_, l)| std::cmp::Reverse(*l));
        } else {
            candidates.shuffle(&mut rng);
        }

        candidates.first().copied()
    }

    fn is_slot_available(
        &self,
        class_id: &str,
        teacher_id: &str,
        group: u8,
        day: u8,
        lesson: u8,
        teacher_schedule: &HashMap<(String, u8, u8), bool>,
        class_schedule: &HashMap<(String, u8, u8, u8), bool>,
    ) -> bool {
        // Check teacher availability
        if teacher_schedule.contains_key(&(teacher_id.to_string(), day, lesson)) {
            return false;
        }

        // Check class/group availability
        if group == 0 {
            // Whole class: check if any group is occupied
            if class_schedule.contains_key(&(class_id.to_string(), day, lesson, 0))
                || class_schedule.contains_key(&(class_id.to_string(), day, lesson, 1))
                || class_schedule.contains_key(&(class_id.to_string(), day, lesson, 2))
            {
                return false;
            }
        } else {
            // Specific group: check whole class and this group
            if class_schedule.contains_key(&(class_id.to_string(), day, lesson, 0))
                || class_schedule.contains_key(&(class_id.to_string(), day, lesson, group))
            {
                return false;
            }
        }

        true
    }

    fn calculate_score(&self, lessons: &[ScheduledLesson], conflicts: &[ScheduleConflict]) -> f64 {
        let mut score: f64 = 100.0;

        // Penalty for each conflict
        for conflict in conflicts {
            match conflict.severity {
                ConflictSeverity::Error => score -= 20.0,
                ConflictSeverity::Warning => score -= 5.0,
                ConflictSeverity::Info => score -= 1.0,
            }
        }

        // Reward for balanced distribution across days
        let mut lessons_per_day: HashMap<(String, u8), u32> = HashMap::new();
        for lesson in lessons {
            *lessons_per_day
                .entry((lesson.class_id.clone(), lesson.day))
                .or_insert(0) += 1;
        }

        score.max(0.0)
    }

    fn local_search(
        &self,
        lessons: Vec<ScheduledLesson>,
        _teacher_schedule: &mut HashMap<(String, u8, u8), bool>,
        _class_schedule: &mut HashMap<(String, u8, u8, u8), bool>,
    ) -> Vec<ScheduledLesson> {
        // TODO: Implement hill climbing / simulated annealing for optimization
        // For now, return as-is
        lessons
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic_schedule() {
        let config = SchoolConfig {
            classes: vec![SchoolClass {
                id: "c1".to_string(),
                name: "ז'1".to_string(),
                subjects: vec![ClassSubject {
                    subject_id: "math".to_string(),
                    hours_per_week: 5,
                    split_groups: false,
                    teacher_ids: vec!["t1".to_string()],
                    preferences: SubjectPreferences::default(),
                }],
            }],
            teachers: vec![Teacher {
                id: "t1".to_string(),
                name: "מורה א'".to_string(),
                day_off: None,
            }],
            subjects: vec![Subject {
                id: "math".to_string(),
                name: "מתמטיקה".to_string(),
                short_name: "מתמ".to_string(),
            }],
            week_grid: WeekGrid::default(),
        };

        let solver = ScheduleSolver::new(config);
        let result = solver.solve();

        assert_eq!(result.lessons.len(), 5);
        assert!(result.conflicts.is_empty());
    }
}
