import { useState } from 'react';
import { he } from '../i18n/he';
import { useStore } from '../store/useStore';
import { generateSchedule } from '../api';

export function GenerateSchedule() {
  const { classes, teachers, subjects, rooms, bellSchedule, weekGrid, setSchedule, setActiveTab } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const canGenerate = classes.length > 0 && teachers.length > 0 && subjects.length > 0;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setSuccess(false);

    try {
      const config = {
        classes,
        teachers,
        subjects,
        rooms,
        bellSchedule,
        weekGrid,
      };

      const schedule = await generateSchedule(config);
      setSchedule(schedule);
      setSuccess(true);

      // Navigate to schedule view after short delay
      setTimeout(() => {
        setActiveTab('schedule');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : he.generate.error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Validation checks
  const warnings: string[] = [];

  // Check for classes without subjects
  const classesWithoutSubjects = classes.filter((c) => c.subjects.length === 0);
  if (classesWithoutSubjects.length > 0) {
    warnings.push(`כיתות ללא מקצועות: ${classesWithoutSubjects.map((c) => c.name).join(', ')}`);
  }

  // Check for subjects without teachers
  classes.forEach((cls) => {
    cls.subjects.forEach((cs) => {
      if (cs.teacherIds.length === 0 || cs.teacherIds.every((id) => !id)) {
        const subjectName = subjects.find((s) => s.id === cs.subjectId)?.name || cs.subjectId;
        warnings.push(`${cls.name}: ${subjectName} - חסר מורה`);
      }
    });
  });

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{he.generate.title}</h2>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              {classes.length}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>{he.nav.classes}</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              {teachers.length}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>{he.nav.teachers}</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              {subjects.length}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>{he.nav.subjects}</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              {rooms.length}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>{he.nav.rooms}</div>
          </div>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="alert alert-warning" style={{ marginBottom: '1rem' }}>
            <strong>אזהרות:</strong>
            <ul style={{ margin: '0.5rem 0 0', paddingRight: '1.5rem' }}>
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
            {he.generate.success}
          </div>
        )}

        {/* Generate button */}
        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}
          onClick={handleGenerate}
          disabled={!canGenerate || isGenerating}
        >
          {isGenerating ? he.generate.generating : he.generate.button}
        </button>

        {!canGenerate && (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '1rem' }}>
            נדרשים לפחות: כיתה אחת, מורה אחד, ומקצוע אחד
          </p>
        )}
      </div>
    </div>
  );
}
