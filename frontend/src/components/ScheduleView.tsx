import { useState } from 'react';
import { he } from '../i18n/he';
import { useStore } from '../store/useStore';
import { DAY_NAMES_HE } from '../types';

export function ScheduleView() {
  const { schedule, classes, subjects, teachers, weekGrid } = useStore();
  const [viewMode, setViewMode] = useState<'class' | 'teacher'>('class');
  const [selectedId, setSelectedId] = useState<string>('');

  if (!schedule) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <p>{he.schedule.noSchedule}</p>
        </div>
      </div>
    );
  }

  const maxLessons = Math.max(...weekGrid.maxLessons);
  const activeDays = weekGrid.maxLessons.map((m, i) => m > 0 ? i : -1).filter(i => i >= 0);

  // Get lessons for selected class or teacher
  const getFilteredLessons = () => {
    if (!selectedId) return [];

    if (viewMode === 'class') {
      return schedule.lessons.filter((l) => l.classId === selectedId);
    } else {
      return schedule.lessons.filter((l) => l.teacherId === selectedId);
    }
  };

  const filteredLessons = getFilteredLessons();

  // Build timetable grid
  const getCell = (day: number, lesson: number) => {
    const cellLessons = filteredLessons.filter(
      (l) => l.day === day && l.lessonNumber === lesson
    );

    if (cellLessons.length === 0) return null;

    // Check if split groups
    const group1 = cellLessons.find((l) => l.group === 1);
    const group2 = cellLessons.find((l) => l.group === 2);
    const wholeClass = cellLessons.find((l) => l.group === 0);

    if (group1 && group2) {
      const subject1 = subjects.find((s) => s.id === group1.subjectId);
      const subject2 = subjects.find((s) => s.id === group2.subjectId);
      const teacher1 = teachers.find((t) => t.id === group1.teacherId);
      const teacher2 = teachers.find((t) => t.id === group2.teacherId);

      return (
        <div className="schedule-cell split">
          <div className="group group-1">
            <div style={{ fontWeight: 'bold' }}>{subject1?.shortName}</div>
            {viewMode === 'class' && <div style={{ fontSize: '0.75rem' }}>{teacher1?.name}</div>}
          </div>
          <div className="group group-2">
            <div style={{ fontWeight: 'bold' }}>{subject2?.shortName}</div>
            {viewMode === 'class' && <div style={{ fontSize: '0.75rem' }}>{teacher2?.name}</div>}
          </div>
        </div>
      );
    }

    const lesson_data = wholeClass || cellLessons[0];
    const subject = subjects.find((s) => s.id === lesson_data.subjectId);
    const teacher = teachers.find((t) => t.id === lesson_data.teacherId);
    const cls = classes.find((c) => c.id === lesson_data.classId);

    return (
      <div className="schedule-cell">
        <div style={{ fontWeight: 'bold' }}>{subject?.shortName}</div>
        {viewMode === 'class' && <div style={{ fontSize: '0.75rem' }}>{teacher?.name}</div>}
        {viewMode === 'teacher' && <div style={{ fontSize: '0.75rem' }}>{cls?.name}</div>}
      </div>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="card no-print">
        <div className="card-header">
          <h2 className="card-title">{he.schedule.title}</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`btn ${viewMode === 'class' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => { setViewMode('class'); setSelectedId(''); }}
            >
              {he.schedule.viewByClass}
            </button>
            <button
              className={`btn ${viewMode === 'teacher' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => { setViewMode('teacher'); setSelectedId(''); }}
            >
              {he.schedule.viewByTeacher}
            </button>
            <button className="btn btn-success btn-sm" onClick={handlePrint}>
              {he.schedule.print}
            </button>
          </div>
        </div>

        <div className="form-group">
          <select
            className="form-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">{he.common.select}...</option>
            {viewMode === 'class'
              ? classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              : teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
          </select>
        </div>

        {/* Conflicts */}
        {schedule.conflicts.length > 0 && (
          <div className="alert alert-warning" style={{ marginBottom: '1rem' }}>
            <strong>{he.generate.conflicts}:</strong>
            <ul style={{ margin: '0.5rem 0 0', paddingRight: '1.5rem' }}>
              {schedule.conflicts.map((conflict, index) => (
                <li key={index}>{conflict.message}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Score */}
        <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          {he.generate.score}: {schedule.score.toFixed(1)}
        </div>
      </div>

      {/* Schedule Table */}
      {selectedId && (
        <div className="card" style={{ overflow: 'auto' }}>
          <h3 style={{ marginBottom: '1rem' }}>
            {viewMode === 'class'
              ? classes.find(c => c.id === selectedId)?.name
              : teachers.find(t => t.id === selectedId)?.name}
          </h3>
          <table className="schedule-table">
            <thead>
              <tr>
                <th>{he.schedule.lesson}</th>
                {activeDays.map((day) => (
                  <th key={day}>{DAY_NAMES_HE[day]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: maxLessons }, (_, i) => i + 1).map((lessonNum) => (
                <tr key={lessonNum}>
                  <td style={{ fontWeight: 'bold', background: 'var(--bg-secondary)' }}>
                    {lessonNum}
                  </td>
                  {activeDays.map((day) => (
                    <td key={day}>
                      {lessonNum <= weekGrid.maxLessons[day] ? getCell(day, lessonNum) : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
