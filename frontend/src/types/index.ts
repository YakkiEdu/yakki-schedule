// School class (e.g., "ז'1", "ח'2")
export interface SchoolClass {
  id: string;
  name: string;
  subjects: ClassSubject[];
}

// Subject assignment for a class
export interface ClassSubject {
  subjectId: string;
  hoursPerWeek: number;
  splitGroups: boolean;
  teacherIds: string[];
  preferences: SubjectPreferences;
}

// Preferences for scheduling a subject
export interface SubjectPreferences {
  paired: boolean;
  preferMorning: boolean;
  preferAfternoon: boolean;
}

// Teacher
export interface Teacher {
  id: string;
  name: string;
  dayOff?: number; // 0=Sunday, 1=Monday, ..., 5=Friday
}

// Subject definition
export interface Subject {
  id: string;
  name: string;
  shortName: string;
}

// Weekly schedule grid configuration
export interface WeekGrid {
  maxLessons: number[]; // [Sun, Mon, Tue, Wed, Thu, Fri]
}

// Complete school configuration
export interface SchoolConfig {
  classes: SchoolClass[];
  teachers: Teacher[];
  subjects: Subject[];
  weekGrid: WeekGrid;
}

// A single lesson in the generated schedule
export interface ScheduledLesson {
  classId: string;
  subjectId: string;
  teacherId: string;
  day: number;
  lessonNumber: number;
  group: number;
}

// Schedule conflict or warning
export interface ScheduleConflict {
  severity: 'error' | 'warning' | 'info';
  message: string;
  affectedLessons: number[];
}

// Generated schedule result
export interface GeneratedSchedule {
  lessons: ScheduledLesson[];
  conflicts: ScheduleConflict[];
  score: number;
}

// Day names in Hebrew
export const DAY_NAMES_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];

// Default week grid (Israeli school)
export const DEFAULT_WEEK_GRID: WeekGrid = {
  maxLessons: [8, 8, 8, 8, 8, 0],
};
