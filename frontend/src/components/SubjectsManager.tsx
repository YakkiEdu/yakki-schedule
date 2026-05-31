import { useState } from 'react';
import { he } from '../i18n/he';
import { useStore } from '../store/useStore';
import { API_URL } from '../api';

export function SubjectsManager() {
  const { subjects, addSubject, updateSubject, deleteSubject, loadDefaultSubjects } = useStore();
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectShort, setNewSubjectShort] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddSubject = () => {
    if (newSubjectName.trim() && newSubjectShort.trim()) {
      addSubject(newSubjectName.trim(), newSubjectShort.trim());
      setNewSubjectName('');
      setNewSubjectShort('');
    }
  };

  const handleLoadDefaults = async () => {
    try {
      const response = await fetch(`${API_URL}/api/defaults/subjects`);
      if (response.ok) {
        const defaultSubjects = await response.json();
        loadDefaultSubjects(defaultSubjects);
      }
    } catch (error) {
      console.error('Failed to load default subjects:', error);
      // Load hardcoded defaults if API fails
      const hardcodedDefaults = [
        { id: '1', name: 'מתמטיקה', shortName: 'מתמ' },
        { id: '2', name: 'אנגלית', shortName: 'אנג' },
        { id: '3', name: 'עברית', shortName: 'עבר' },
        { id: '4', name: 'תנ"ך', shortName: 'תנך' },
        { id: '5', name: 'היסטוריה', shortName: 'היס' },
        { id: '6', name: 'גיאוגרפיה', shortName: 'גאו' },
        { id: '7', name: 'מדעים', shortName: 'מדע' },
        { id: '8', name: 'פיזיקה', shortName: 'פיז' },
        { id: '9', name: 'כימיה', shortName: 'כימ' },
        { id: '10', name: 'ביולוגיה', shortName: 'ביו' },
        { id: '11', name: 'חינוך גופני', shortName: 'חנג' },
        { id: '12', name: 'אומנות', shortName: 'אמנ' },
        { id: '13', name: 'מוזיקה', shortName: 'מוז' },
        { id: '14', name: 'מחשבים', shortName: 'מחש' },
        { id: '15', name: 'אזרחות', shortName: 'אזר' },
        { id: '16', name: 'ספרות', shortName: 'ספר' },
      ];
      loadDefaultSubjects(hardcodedDefaults);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{he.subjects.title}</h2>
          <button className="btn btn-secondary" onClick={handleLoadDefaults}>
            {he.subjects.loadDefaults}
          </button>
        </div>

        <div className="form-row" style={{ marginBottom: '1rem' }}>
          <div className="form-group" style={{ flex: 2 }}>
            <input
              type="text"
              className="form-input"
              placeholder={he.subjects.name}
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <input
              type="text"
              className="form-input"
              placeholder={he.subjects.shortName}
              value={newSubjectShort}
              onChange={(e) => setNewSubjectShort(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
            />
          </div>
          <button className="btn btn-primary" onClick={handleAddSubject}>
            {he.subjects.add}
          </button>
        </div>

        {subjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <p>{he.subjects.noSubjects}</p>
          </div>
        ) : (
          <ul className="list">
            {subjects.map((subject) => (
              <li key={subject.id} className="list-item">
                {editingId === subject.id ? (
                  <div className="form-row" style={{ flex: 1, marginLeft: '1rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={subject.name}
                      onChange={(e) => updateSubject(subject.id, { name: e.target.value })}
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{ maxWidth: '100px' }}
                      value={subject.shortName}
                      onChange={(e) => updateSubject(subject.id, { shortName: e.target.value })}
                    />
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditingId(null)}
                    >
                      {he.common.close}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="list-item-content">
                      <strong>{subject.name}</strong>
                      <span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }}>
                        ({subject.shortName})
                      </span>
                    </div>
                    <div className="list-item-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingId(subject.id)}
                      >
                        {he.common.edit}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteSubject(subject.id)}
                      >
                        {he.common.delete}
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
