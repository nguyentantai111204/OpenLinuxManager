import { Route, Routes } from 'react-router-dom';
import { Dashboard } from '../modules/system-monitor/pages/dashboard';
import { ThemeProvider as ThemeProviderWrapper } from '../contexts/theme-context';
import { Processes } from '../modules/system-monitor/pages/processes';
import { Storage } from '../modules/system-monitor/pages/storage';
import { Settings } from '../pages/settings';
import { UserManagement } from '../modules/user-management/pages/user-management';
import { MainLayout } from '../modules/shared/components/layout/main-layout';

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

