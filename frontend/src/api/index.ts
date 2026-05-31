import type { SchoolConfig, GeneratedSchedule } from '../types';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function generateSchedule(config: SchoolConfig): Promise<GeneratedSchedule> {
  const response = await fetch(`${API_URL}/api/schedule/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate schedule: ${response.statusText}`);
  }

  return response.json();
}

export async function getDefaultSubjects() {
  const response = await fetch(`${API_URL}/api/defaults/subjects`);
  if (!response.ok) {
    throw new Error(`Failed to fetch subjects: ${response.statusText}`);
  }
  return response.json();
}

export async function getDefaultWeekGrid() {
  const response = await fetch(`${API_URL}/api/defaults/week-grid`);
  if (!response.ok) {
    throw new Error(`Failed to fetch week grid: ${response.statusText}`);
  }
  return response.json();
}
