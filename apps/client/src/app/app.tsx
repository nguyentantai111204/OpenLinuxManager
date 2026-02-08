import { Box, Container, Typography } from '@mui/material';
import { Route, Routes } from 'react-router-dom';

export function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          OpenLinuxManager
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to OpenLinuxManager - A modern Linux system management tool
        </Typography>

        <Routes>
          <Route
            path="/"
            element={
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5">Home Page</Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Start building your application here.
                </Typography>
              </Box>
            }
          />
        </Routes>
      </Box>
    </Container>
  );
}

export default App;
