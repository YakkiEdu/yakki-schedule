import { he } from '../i18n/he';
import { useStore } from '../store/useStore';
import { DAY_NAMES_HE } from '../types';

export function SettingsPanel() {
  const { weekGrid, updateWeekGrid } = useStore();

  const handleMaxLessonsChange = (dayIndex: number, value: number) => {
    const newMaxLessons = [...weekGrid.maxLessons];
    newMaxLessons[dayIndex] = value;
    updateWeekGrid({ maxLessons: newMaxLessons as [number, number, number, number, number, number] });
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{he.settings.title}</h2>
        </div>

        <div className="form-group">
          <label className="form-label">{he.settings.weekGrid}</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem' }}>
            {DAY_NAMES_HE.map((day, index) => (
              <div key={index}>
                <label className="form-label" style={{ fontSize: '0.875rem', textAlign: 'center', display: 'block' }}>
                  {day}
                </label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  max="10"
                  value={weekGrid.maxLessons[index]}
                  onChange={(e) => handleMaxLessonsChange(index, parseInt(e.target.value) || 0)}
                  style={{ textAlign: 'center' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
