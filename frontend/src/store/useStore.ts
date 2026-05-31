import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  SchoolClass,
  Teacher,
  Subject,
  WeekGrid,
  GeneratedSchedule,
  ClassSubject,
} from '../types';
import { DEFAULT_WEEK_GRID } from '../types';

interface AppState {
  // Data
  classes: SchoolClass[];
  teachers: Teacher[];
  subjects: Subject[];
  weekGrid: WeekGrid;
  schedule: GeneratedSchedule | null;

  // UI
  activeTab: string;
  isLoading: boolean;
  error: string | null;

  // Actions - Classes
  addClass: (name: string) => void;
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
      weekGrid: DEFAULT_WEEK_GRID,
      schedule: null,
      activeTab: 'classes',
      isLoading: false,
      error: null,

      // Classes
      addClass: (name) =>
        set((state) => ({
          classes: [
            ...state.classes,
            { id: generateId(), name, subjects: [] },
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
        weekGrid: state.weekGrid,
      }),
    }
  )
);
