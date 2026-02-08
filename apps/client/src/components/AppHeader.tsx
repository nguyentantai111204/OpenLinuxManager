import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Brightness4 as DarkModeIcon,
    Brightness7 as LightModeIcon,
    Computer as ComputerIcon,
} from '@mui/icons-material';
import { useThemeMode } from '../contexts/ThemeContext';

export function AppHeader() {
    const { mode, toggleTheme } = useThemeMode();

    return (
        <AppBar position="sticky" elevation={0}>
            <Toolbar>
                <ComputerIcon sx={{ mr: 2 }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                    OpenLinuxManager
                </Typography>

                <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                    <IconButton
                        onClick={toggleTheme}
                        color="inherit"
                        sx={{
                            ml: 1,
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'rotate(180deg)',
                            },
                        }}
                    >
                        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
}
