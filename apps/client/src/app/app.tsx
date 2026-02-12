import { Route, Routes } from 'react-router-dom';
import { Dashboard } from '../pages/dashboard/dashboard.screen';
import { Processes } from '../pages/processes/processes.screen';
import { Storage } from '../pages/storage/storage.screen';
import { Settings } from '../pages/settings/settings.screen';
import { UserManagement } from '../pages/user-management/user-management.screen';
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

