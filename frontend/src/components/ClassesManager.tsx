import { useState } from 'react';
import { he } from '../i18n/he';
import { useStore } from '../store/useStore';
import type { ClassSubject } from '../types';

export function ClassesManager() {
  const { classes, subjects, teachers, rooms, addClass, updateClass, deleteClass, addClassSubject, updateClassSubject, removeClassSubject } = useStore();
  const [newClassName, setNewClassName] = useState('');
  const [newClassHomeRoom, setNewClassHomeRoom] = useState('');
  const [editingClassId, setEditingClassId] = useState<string | null>(null);

  const handleAddClass = () => {
    if (newClassName.trim()) {
      addClass(newClassName.trim(), newClassHomeRoom || undefined);
      setNewClassName('');
      setNewClassHomeRoom('');
    }
  };

  const handleAddSubject = (classId: string, subjectId: string) => {
    const newSubject: ClassSubject = {
      subjectId,
      hoursPerWeek: 2,
      splitGroups: false,
      teacherIds: [],
      preferences: {
        paired: false,
        preferMorning: false,
        preferAfternoon: false,
      },
    };
    addClassSubject(classId, newSubject);
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{he.classes.title}</h2>
        </div>

        <div className="form-row" style={{ marginBottom: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <input
              type="text"
              className="form-input"
              placeholder={he.classes.name}
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <select
              className="form-select"
              value={newClassHomeRoom}
              onChange={(e) => setNewClassHomeRoom(e.target.value)}
            >
              <option value="">{he.classes.homeRoom}...</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleAddClass}>
            {he.classes.add}
          </button>
        </div>

        {classes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏫</div>
            <p>{he.classes.noClasses}</p>
          </div>
        ) : (
          <ul className="list">
            {classes.map((cls) => {
              const homeRoom = rooms.find((r) => r.id === cls.homeRoomId);
              return (
                <li key={cls.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="list-item-content">
                      <strong>{cls.name}</strong>
                      {homeRoom && (
                        <span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }}>
                          ({he.classes.homeRoom}: {homeRoom.name})
                        </span>
                      )}
                      <span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }}>
                        | {cls.subjects.length} {he.classes.subjects}
                      </span>
                    </div>
                    <div className="list-item-actions">
                      <select
                        className="form-select"
                        style={{ width: 'auto' }}
                        value={cls.homeRoomId || ''}
                        onChange={(e) =>
                          updateClass(cls.id, { homeRoomId: e.target.value || undefined })
                        }
                      >
                        <option value="">{he.classes.homeRoom}...</option>
                        {rooms.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingClassId(editingClassId === cls.id ? null : cls.id)}
                      >
                        {editingClassId === cls.id ? he.common.close : he.common.edit}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteClass(cls.id)}>
                        {he.common.delete}
                      </button>
                    </div>
                  </div>

                  {editingClassId === cls.id && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                      <h4 style={{ marginBottom: '0.5rem' }}>{he.classes.subjects}</h4>

                      {/* Add subject dropdown */}
                      <div className="form-group">
                        <select
                          className="form-select"
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddSubject(cls.id, e.target.value);
                            }
                          }}
                        >
                          <option value="">{he.common.add} {he.classes.subjects}...</option>
                          {subjects
                            .filter((s) => !cls.subjects.some((cs) => cs.subjectId === s.id))
                            .map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Subject list */}
                      {cls.subjects.map((classSubject) => {
                        const subject = subjects.find((s) => s.id === classSubject.subjectId);
                        return (
                          <div key={classSubject.subjectId} className="card" style={{ marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <strong>{subject?.name || classSubject.subjectId}</strong>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => removeClassSubject(cls.id, classSubject.subjectId)}
                              >
                                {he.common.delete}
                              </button>
                            </div>

                            <div className="form-row">
                              <div className="form-group">
                                <label className="form-label">{he.classSubject.hours}</label>
                                <input
                                  type="number"
                                  className="form-input"
                                  min="1"
                                  max="10"
                                  value={classSubject.hoursPerWeek}
                                  onChange={(e) =>
                                    updateClassSubject(cls.id, classSubject.subjectId, {
                                      hoursPerWeek: parseInt(e.target.value) || 1,
                                    })
                                  }
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">{he.classSubject.splitGroups}</label>
                                <input
                                  type="checkbox"
                                  className="checkbox"
                                  checked={classSubject.splitGroups}
                                  onChange={(e) =>
                                    updateClassSubject(cls.id, classSubject.subjectId, {
                                      splitGroups: e.target.checked,
                                      teacherIds: e.target.checked ? ['', ''] : [''],
                                    })
                                  }
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">{he.classSubject.room}</label>
                                <select
                                  className="form-select"
                                  value={classSubject.roomId || ''}
                                  onChange={(e) =>
                                    updateClassSubject(cls.id, classSubject.subjectId, {
                                      roomId: e.target.value || undefined,
                                    })
                                  }
                                >
                                  <option value="">{he.classSubject.roomDefault}</option>
                                  {rooms.map((r) => (
                                    <option key={r.id} value={r.id}>
                                      {r.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Teacher selection */}
                            <div className="form-row">
                              {classSubject.splitGroups ? (
                                <>
                                  <div className="form-group">
                                    <label className="form-label">{he.classSubject.teacherGroup1}</label>
                                    <select
                                      className="form-select"
                                      value={classSubject.teacherIds[0] || ''}
                                      onChange={(e) =>
                                        updateClassSubject(cls.id, classSubject.subjectId, {
                                          teacherIds: [e.target.value, classSubject.teacherIds[1] || ''],
                                        })
                                      }
                                    >
                                      <option value="">{he.common.select}...</option>
                                      {teachers.map((t) => (
                                        <option key={t.id} value={t.id}>
                                          {t.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="form-group">
                                    <label className="form-label">{he.classSubject.teacherGroup2}</label>
                                    <select
                                      className="form-select"
                                      value={classSubject.teacherIds[1] || ''}
                                      onChange={(e) =>
                                        updateClassSubject(cls.id, classSubject.subjectId, {
                                          teacherIds: [classSubject.teacherIds[0] || '', e.target.value],
                                        })
                                      }
                                    >
                                      <option value="">{he.common.select}...</option>
                                      {teachers.map((t) => (
                                        <option key={t.id} value={t.id}>
                                          {t.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </>
                              ) : (
                                <div className="form-group">
                                  <label className="form-label">{he.classSubject.teacher}</label>
                                  <select
                                    className="form-select"
                                    value={classSubject.teacherIds[0] || ''}
                                    onChange={(e) =>
                                      updateClassSubject(cls.id, classSubject.subjectId, {
                                        teacherIds: [e.target.value],
                                      })
                                    }
                                  >
                                    <option value="">{he.common.select}...</option>
                                    {teachers.map((t) => (
                                      <option key={t.id} value={t.id}>
                                        {t.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                            </div>

                            {/* Preferences */}
                            <div className="form-group">
                              <label className="form-label">{he.classSubject.preferences}</label>
                              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <label className="checkbox-group">
                                  <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={classSubject.preferences.paired}
                                    onChange={(e) =>
                                      updateClassSubject(cls.id, classSubject.subjectId, {
                                        preferences: { ...classSubject.preferences, paired: e.target.checked },
                                      })
                                    }
                                  />
                                  {he.classSubject.paired}
                                </label>
                                <label className="checkbox-group">
                                  <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={classSubject.preferences.preferMorning}
                                    onChange={(e) =>
                                      updateClassSubject(cls.id, classSubject.subjectId, {
                                        preferences: { ...classSubject.preferences, preferMorning: e.target.checked, preferAfternoon: false },
                                      })
                                    }
                                  />
                                  {he.classSubject.preferMorning}
                                </label>
                                <label className="checkbox-group">
                                  <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={classSubject.preferences.preferAfternoon}
                                    onChange={(e) =>
                                      updateClassSubject(cls.id, classSubject.subjectId, {
                                        preferences: { ...classSubject.preferences, preferAfternoon: e.target.checked, preferMorning: false },
                                      })
                                    }
                                  />
                                  {he.classSubject.preferAfternoon}
                                </label>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
