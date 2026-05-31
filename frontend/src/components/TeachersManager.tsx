import { useState } from 'react';
import { he } from '../i18n/he';
import { useStore } from '../store/useStore';
import { DAY_NAMES_HE } from '../types';

export function TeachersManager() {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useStore();
  const [newTeacherName, setNewTeacherName] = useState('');

  const handleAddTeacher = () => {
    if (newTeacherName.trim()) {
      addTeacher(newTeacherName.trim());
      setNewTeacherName('');
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{he.teachers.title}</h2>
        </div>

        <div className="form-row" style={{ marginBottom: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <input
              type="text"
              className="form-input"
              placeholder={he.teachers.name}
              value={newTeacherName}
              onChange={(e) => setNewTeacherName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTeacher()}
            />
          </div>
          <button className="btn btn-primary" onClick={handleAddTeacher}>
            {he.teachers.add}
          </button>
        </div>

        {teachers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👨‍🏫</div>
            <p>{he.teachers.noTeachers}</p>
          </div>
        ) : (
          <ul className="list">
            {teachers.map((teacher) => (
              <li key={teacher.id} className="list-item">
                <div className="list-item-content">
                  <strong>{teacher.name}</strong>
                </div>
                <div className="list-item-actions">
                  <select
                    className="form-select"
                    style={{ width: 'auto' }}
                    value={teacher.dayOff ?? ''}
                    onChange={(e) =>
                      updateTeacher(teacher.id, {
                        dayOff: e.target.value === '' ? undefined : parseInt(e.target.value),
                      })
                    }
                  >
                    <option value="">{he.teachers.noDayOff}</option>
                    {DAY_NAMES_HE.map((day, index) => (
                      <option key={index} value={index}>
                        {he.teachers.dayOff}: {day}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteTeacher(teacher.id)}
                  >
                    {he.common.delete}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
