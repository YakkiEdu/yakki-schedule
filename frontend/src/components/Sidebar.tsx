import { he } from '../i18n/he';
import { useStore } from '../store/useStore';

const navItems = [
  { id: 'classes', label: he.nav.classes, icon: '🏫' },
  { id: 'teachers', label: he.nav.teachers, icon: '👨‍🏫' },
  { id: 'subjects', label: he.nav.subjects, icon: '📚' },
  { id: 'rooms', label: he.nav.rooms, icon: '🚪' },
  { id: 'bellSchedule', label: he.nav.bellSchedule, icon: '⏰' },
  { id: 'settings', label: he.nav.settings, icon: '⚙️' },
  { id: 'generate', label: he.nav.generate, icon: '🎯' },
  { id: 'schedule', label: he.nav.schedule, icon: '📅' },
];

export function Sidebar() {
  const { activeTab, setActiveTab } = useStore();

  return (
    <nav className="sidebar">
      <div className="sidebar-title">{he.app.title}</div>
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => setActiveTab(item.id)}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
