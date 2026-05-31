import { useState } from 'react';
import { he } from '../i18n/he';
import { useStore } from '../store/useStore';
import type { BellEventType } from '../types';
import { BELL_EVENT_LABELS, BELL_EVENT_ICONS } from '../types';

const eventTypes: BellEventType[] = ['prayer', 'lesson', 'break', 'longBreak'];

function calculateDuration(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

export function BellScheduleEditor() {
  const { bellSchedule, addBellEvent, updateBellEvent, deleteBellEvent, loadDefaultBellSchedule } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    type: 'lesson' as BellEventType,
    name: '',
    startTime: '08:00',
    endTime: '08:45',
  });

  const handleAddEvent = () => {
    if (newEvent.name.trim()) {
      const maxOrder = bellSchedule.reduce((max, e) => Math.max(max, e.order), 0);
      addBellEvent({
        type: newEvent.type,
        name: newEvent.name.trim(),
        startTime: newEvent.startTime,
        endTime: newEvent.endTime,
        order: maxOrder + 1,
      });
      setNewEvent({
        type: 'lesson',
        name: '',
        startTime: '08:00',
        endTime: '08:45',
      });
      setShowAddForm(false);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{he.bellSchedule.title}</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={loadDefaultBellSchedule}
            >
              {he.bellSchedule.loadDefaults}
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? he.common.close : he.bellSchedule.add}
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="section-box" style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{he.bellSchedule.eventType}</label>
                <select
                  className="form-select"
                  value={newEvent.type}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, type: e.target.value as BellEventType })
                  }
                >
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {BELL_EVENT_ICONS[type]} {BELL_EVENT_LABELS[type]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{he.bellSchedule.eventName}</label>
                <input
                  type="text"
                  className="form-input"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{he.bellSchedule.startTime}</label>
                <input
                  type="time"
                  className="form-input"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{he.bellSchedule.endTime}</label>
                <input
                  type="time"
                  className="form-input"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button className="btn btn-primary" onClick={handleAddEvent}>
                  {he.common.add}
                </button>
              </div>
            </div>
          </div>
        )}

        {bellSchedule.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">⏰</div>
            <p>{he.bellSchedule.noEvents}</p>
          </div>
        ) : (
          <table className="schedule-table" style={{ fontSize: '0.9rem' }}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th style={{ width: '100px' }}>{he.bellSchedule.eventType}</th>
                <th>{he.bellSchedule.eventName}</th>
                <th style={{ width: '80px' }}>{he.bellSchedule.startTime}</th>
                <th style={{ width: '80px' }}>{he.bellSchedule.endTime}</th>
                <th style={{ width: '70px' }}>{he.bellSchedule.duration}</th>
                <th style={{ width: '80px' }}></th>
              </tr>
            </thead>
            <tbody>
              {bellSchedule.map((event, index) => (
                <tr
                  key={event.id}
                  style={{
                    background:
                      event.type === 'prayer'
                        ? '#fef3c7'
                        : event.type === 'longBreak'
                        ? '#bbf7d0'
                        : event.type === 'break'
                        ? '#d1fae5'
                        : 'inherit',
                  }}
                >
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td>
                    {BELL_EVENT_ICONS[event.type]} {BELL_EVENT_LABELS[event.type]}
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '0.25rem 0.5rem' }}
                      value={event.name}
                      onChange={(e) =>
                        updateBellEvent(event.id, { name: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      className="form-input"
                      style={{ padding: '0.25rem' }}
                      value={event.startTime}
                      onChange={(e) =>
                        updateBellEvent(event.id, { startTime: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      className="form-input"
                      style={{ padding: '0.25rem' }}
                      value={event.endTime}
                      onChange={(e) =>
                        updateBellEvent(event.id, { endTime: e.target.value })
                      }
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {calculateDuration(event.startTime, event.endTime)} {he.bellSchedule.minutes}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteBellEvent(event.id)}
                    >
                      {he.common.delete}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
