import { Route, Routes } from 'react-router-dom';
import { Dashboard } from '../features/system-monitor/pages/dashboard';
import { ThemeProvider as ThemeProviderWrapper } from '../contexts/theme-context';
import { Processes } from '../features/system-monitor/pages/processes';
import { Storage } from '../features/system-monitor/pages/storage';
import { Settings } from '../pages/settings';
import { UserManagement } from '../features/user-management/pages/user-management';
import { MainLayout } from '../layouts/main-layout';

export function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/processes" element={<Processes />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </MainLayout>
  );
}

export default App;

