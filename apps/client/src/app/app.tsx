import { Route, Routes } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { Processes } from '../pages/Processes';
import { Storage } from '../pages/Storage';
import { Settings } from '../pages/Settings';
import { MainLayout } from '../components/layout/MainLayout';

export function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/processes" element={<Processes />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </MainLayout>
  );
}

export default App;

