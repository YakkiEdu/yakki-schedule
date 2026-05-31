// School class (e.g., "ז'1", "ח'2")
export interface SchoolClass {
  id: string;
  name: string;
  homeRoomId?: string; // Default room for this class
  subjects: ClassSubject[];
}

// Subject assignment for a class
export interface ClassSubject {
  subjectId: string;
  hoursPerWeek: number;
  splitGroups: boolean;
  teacherIds: string[];
  roomId?: string; // Override room (e.g., gym, lab) - if not set, uses class homeRoom
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

// Room / Classroom
export interface Room {
  id: string;
  name: string; // "201", "מעבדת מחשבים"
  type: RoomType;
  capacity?: number;
}

export type RoomType = 'regular' | 'lab' | 'gym' | 'art' | 'library';

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  regular: 'כיתה רגילה',
  lab: 'מעבדה',
  gym: 'אולם ספורט',
  art: 'חדר אומנות',
  library: 'ספרייה',
};

// Bell schedule event (prayer, lesson, break)
export interface BellEvent {
  id: string;
  type: BellEventType;
  name: string;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  order: number;     // Position in day (1, 2, 3...)
}

export type BellEventType = 'prayer' | 'lesson' | 'break' | 'longBreak';

export const BELL_EVENT_LABELS: Record<BellEventType, string> = {
  prayer: 'תפילה',
  lesson: 'שיעור',
  break: 'הפסקה',
  longBreak: 'הפסקה גדולה',
};

export const BELL_EVENT_ICONS: Record<BellEventType, string> = {
  prayer: '🙏',
  lesson: '📖',
  break: '☕',
  longBreak: '🍽️',
};

// Weekly schedule grid configuration
export interface WeekGrid {
  maxLessons: number[]; // [Sun, Mon, Tue, Wed, Thu, Fri]
}

// Complete school configuration
export interface SchoolConfig {
  classes: SchoolClass[];
  teachers: Teacher[];
  subjects: Subject[];
  rooms: Room[];
  bellSchedule: BellEvent[];
  weekGrid: WeekGrid;
}

// A single lesson in the generated schedule
export interface ScheduledLesson {
  classId: string;
  subjectId: string;
  teacherId: string;
  roomId: string;
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

// Default bell schedule (Israeli religious school)
export const DEFAULT_BELL_SCHEDULE: BellEvent[] = [
  { id: 'b1', type: 'prayer', name: 'תפילת שחרית', startTime: '07:30', endTime: '08:00', order: 1 },
  { id: 'b2', type: 'break', name: 'הפסקה', startTime: '08:00', endTime: '08:10', order: 2 },
  { id: 'b3', type: 'lesson', name: 'שיעור 1', startTime: '08:10', endTime: '08:55', order: 3 },
  { id: 'b4', type: 'break', name: 'הפסקה', startTime: '08:55', endTime: '09:05', order: 4 },
  { id: 'b5', type: 'lesson', name: 'שיעור 2', startTime: '09:05', endTime: '09:50', order: 5 },
  { id: 'b6', type: 'break', name: 'הפסקה', startTime: '09:50', endTime: '10:00', order: 6 },
  { id: 'b7', type: 'lesson', name: 'שיעור 3', startTime: '10:00', endTime: '10:45', order: 7 },
  { id: 'b8', type: 'longBreak', name: 'הפסקה גדולה', startTime: '10:45', endTime: '11:15', order: 8 },
  { id: 'b9', type: 'lesson', name: 'שיעור 4', startTime: '11:15', endTime: '12:00', order: 9 },
  { id: 'b10', type: 'break', name: 'הפסקה', startTime: '12:00', endTime: '12:10', order: 10 },
  { id: 'b11', type: 'lesson', name: 'שיעור 5', startTime: '12:10', endTime: '12:55', order: 11 },
  { id: 'b12', type: 'prayer', name: 'תפילת מנחה', startTime: '12:55', endTime: '13:10', order: 12 },
  { id: 'b13', type: 'lesson', name: 'שיעור 6', startTime: '13:10', endTime: '13:55', order: 13 },
  { id: 'b14', type: 'break', name: 'הפסקה', startTime: '13:55', endTime: '14:05', order: 14 },
  { id: 'b15', type: 'lesson', name: 'שיעור 7', startTime: '14:05', endTime: '14:50', order: 15 },
  { id: 'b16', type: 'break', name: 'הפסקה', startTime: '14:50', endTime: '15:00', order: 16 },
  { id: 'b17', type: 'lesson', name: 'שיעור 8', startTime: '15:00', endTime: '15:45', order: 17 },
];

// Helper: get lesson events only from bell schedule
export function getLessonEvents(bellSchedule: BellEvent[]): BellEvent[] {
  return bellSchedule.filter(e => e.type === 'lesson');
}

// Helper: get bell event by lesson number (1-based)
export function getBellEventForLesson(bellSchedule: BellEvent[], lessonNumber: number): BellEvent | undefined {
  const lessons = getLessonEvents(bellSchedule);
  return lessons[lessonNumber - 1];
}
