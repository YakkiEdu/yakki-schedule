import { useStore } from './store/useStore';
import { Sidebar } from './components/Sidebar';
import { ClassesManager } from './components/ClassesManager';
import { TeachersManager } from './components/TeachersManager';
import { SubjectsManager } from './components/SubjectsManager';
import { RoomsManager } from './components/RoomsManager';
import { BellScheduleEditor } from './components/BellScheduleEditor';
import { SettingsPanel } from './components/SettingsPanel';
import { GenerateSchedule } from './components/GenerateSchedule';
import { ScheduleView } from './components/ScheduleView';
import './index.css';

function App() {
  const { activeTab } = useStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'classes':
        return <ClassesManager />;
      case 'teachers':
        return <TeachersManager />;
      case 'subjects':
        return <SubjectsManager />;
      case 'rooms':
        return <RoomsManager />;
      case 'bellSchedule':
        return <BellScheduleEditor />;
      case 'settings':
        return <SettingsPanel />;
      case 'generate':
        return <GenerateSchedule />;
      case 'schedule':
        return <ScheduleView />;
      default:
        return <ClassesManager />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">{renderContent()}</main>
    </div>
  );
}

export default App;
