import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  SchoolClass,
  Teacher,
  Subject,
  Room,
  RoomType,
  BellEvent,
  WeekGrid,
  GeneratedSchedule,
  ClassSubject,
} from '../types';
import { DEFAULT_WEEK_GRID, DEFAULT_BELL_SCHEDULE } from '../types';

interface AppState {
  // Data
  classes: SchoolClass[];
  teachers: Teacher[];
  subjects: Subject[];
  rooms: Room[];
  bellSchedule: BellEvent[];
  weekGrid: WeekGrid;
  schedule: GeneratedSchedule | null;

  // UI
  activeTab: string;
  isLoading: boolean;
  error: string | null;

  // Actions - Classes
  addClass: (name: string, homeRoomId?: string) => void;
  updateClass: (id: string, updates: Partial<SchoolClass>) => void;
  deleteClass: (id: string) => void;
  addClassSubject: (classId: string, subject: ClassSubject) => void;
  updateClassSubject: (classId: string, subjectId: string, updates: Partial<ClassSubject>) => void;
  removeClassSubject: (classId: string, subjectId: string) => void;

  // Actions - Teachers
  addTeacher: (name: string) => void;
  updateTeacher: (id: string, updates: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  // Actions - Subjects
  addSubject: (name: string, shortName: string) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  loadDefaultSubjects: (subjects: Subject[]) => void;

  // Actions - Rooms
  addRoom: (name: string, type: RoomType, capacity?: number) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  deleteRoom: (id: string) => void;

  // Actions - Bell Schedule
  setBellSchedule: (bellSchedule: BellEvent[]) => void;
  addBellEvent: (event: Omit<BellEvent, 'id'>) => void;
  updateBellEvent: (id: string, updates: Partial<BellEvent>) => void;
  deleteBellEvent: (id: string) => void;
  loadDefaultBellSchedule: () => void;

  // Actions - Settings
  updateWeekGrid: (weekGrid: WeekGrid) => void;

  // Actions - Schedule
  setSchedule: (schedule: GeneratedSchedule | null) => void;

  // Actions - UI
  setActiveTab: (tab: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      classes: [],
      teachers: [],
      subjects: [],
      rooms: [],
      bellSchedule: DEFAULT_BELL_SCHEDULE,
      weekGrid: DEFAULT_WEEK_GRID,
      schedule: null,
      activeTab: 'classes',
      isLoading: false,
      error: null,

      // Classes
      addClass: (name, homeRoomId) =>
        set((state) => ({
          classes: [
            ...state.classes,
            { id: generateId(), name, homeRoomId, subjects: [] },
          ],
        })),

      updateClass: (id, updates) =>
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      deleteClass: (id) =>
        set((state) => ({
          classes: state.classes.filter((c) => c.id !== id),
        })),

      addClassSubject: (classId, subject) =>
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === classId
              ? { ...c, subjects: [...c.subjects, subject] }
              : c
          ),
        })),

      updateClassSubject: (classId, subjectId, updates) =>
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === classId
              ? {
                  ...c,
                  subjects: c.subjects.map((s) =>
                    s.subjectId === subjectId ? { ...s, ...updates } : s
                  ),
                }
              : c
          ),
        })),

      removeClassSubject: (classId, subjectId) =>
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === classId
              ? {
                  ...c,
                  subjects: c.subjects.filter((s) => s.subjectId !== subjectId),
                }
              : c
          ),
        })),

      // Teachers
      addTeacher: (name) =>
        set((state) => ({
          teachers: [
            ...state.teachers,
            { id: generateId(), name, dayOff: undefined },
          ],
        })),

      updateTeacher: (id, updates) =>
        set((state) => ({
          teachers: state.teachers.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteTeacher: (id) =>
        set((state) => ({
          teachers: state.teachers.filter((t) => t.id !== id),
        })),

      // Subjects
      addSubject: (name, shortName) =>
        set((state) => ({
          subjects: [
            ...state.subjects,
            { id: generateId(), name, shortName },
          ],
        })),

      updateSubject: (id, updates) =>
        set((state) => ({
          subjects: state.subjects.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      deleteSubject: (id) =>
        set((state) => ({
          subjects: state.subjects.filter((s) => s.id !== id),
        })),

      loadDefaultSubjects: (subjects) =>
        set((state) => ({
          subjects: [
            ...state.subjects,
            ...subjects.filter(
              (s) => !state.subjects.some((existing) => existing.name === s.name)
            ),
          ],
        })),

      // Rooms
      addRoom: (name, type, capacity) =>
        set((state) => ({
          rooms: [
            ...state.rooms,
            { id: generateId(), name, type, capacity },
          ],
        })),

      updateRoom: (id, updates) =>
        set((state) => ({
          rooms: state.rooms.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      deleteRoom: (id) =>
        set((state) => ({
          rooms: state.rooms.filter((r) => r.id !== id),
        })),

      // Bell Schedule
      setBellSchedule: (bellSchedule) => set({ bellSchedule }),

      addBellEvent: (event) =>
        set((state) => ({
          bellSchedule: [
            ...state.bellSchedule,
            { ...event, id: generateId() },
          ].sort((a, b) => a.order - b.order),
        })),

      updateBellEvent: (id, updates) =>
        set((state) => ({
          bellSchedule: state.bellSchedule
            .map((e) => (e.id === id ? { ...e, ...updates } : e))
            .sort((a, b) => a.order - b.order),
        })),

      deleteBellEvent: (id) =>
        set((state) => ({
          bellSchedule: state.bellSchedule.filter((e) => e.id !== id),
        })),

      loadDefaultBellSchedule: () =>
        set({ bellSchedule: DEFAULT_BELL_SCHEDULE }),

      // Settings
      updateWeekGrid: (weekGrid) => set({ weekGrid }),

      // Schedule
      setSchedule: (schedule) => set({ schedule }),

      // UI
      setActiveTab: (activeTab) => set({ activeTab }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'yakki-schedule-storage',
      partialize: (state) => ({
        classes: state.classes,
        teachers: state.teachers,
        subjects: state.subjects,
        rooms: state.rooms,
        bellSchedule: state.bellSchedule,
        weekGrid: state.weekGrid,
      }),
    }
  )
);
