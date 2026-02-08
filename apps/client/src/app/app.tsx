import { Box } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { AppHeader } from '../components/AppHeader';

export function App() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
