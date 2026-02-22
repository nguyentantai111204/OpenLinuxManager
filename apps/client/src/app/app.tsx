import { Route, Routes } from 'react-router-dom';
import { Dashboard } from '../pages/dashboard/dashboard.screen';
import { Processes } from '../pages/processes/processes.screen';
import { Storage } from '../pages/storage/storage.screen';
import { Settings } from '../pages/settings/settings.screen';
import { UserManagement } from '../pages/user-management/user-management.screen';
import { AuditLogs } from '../pages/audit-logs/audit-logs.screen';
import { MainLayout } from '../layouts/main-layout';
import { Services } from '../pages/services/services.screen';
import { TerminalScreen } from '../pages/terminal/terminal.screen';

export function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/processes" element={<Processes />} />
        <Route path="/services" element={<Services />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
        <Route path="/terminal" element={<TerminalScreen />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </MainLayout>
  );
}

export default App;

