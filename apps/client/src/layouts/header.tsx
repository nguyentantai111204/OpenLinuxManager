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
import { useThemeMode } from '../contexts/theme-context';
import { COLORS, SPACING, TYPOGRAPHY, TRANSITIONS } from '../constants/design';

export function AppHeader() {
    const { mode, toggleTheme } = useThemeMode();

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                backgroundColor: 'background.paper',
                borderBottom: `1px solid ${COLORS.border.light}`,
                color: 'text.primary',
            }}
        >
            <Toolbar sx={{ height: LAYOUT.header.height }}>
                <ComputerIcon sx={{ mr: SPACING.md / 8, color: COLORS.primary.main }} />
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        flexGrow: 1,
                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                        fontSize: TYPOGRAPHY.fontSize.lg,
                    }}
                >
                    OpenLinuxManager
                </Typography>

                <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                    <IconButton
                        onClick={toggleTheme}
                        color="inherit"
                        sx={{
                            ml: SPACING.sm / 8,
                            transition: `transform ${TRANSITIONS.duration.normal} ${TRANSITIONS.easing.easeInOut}`,
                            '&:hover': {
                                transform: 'rotate(180deg)',
                                color: COLORS.primary.main,
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

import { LAYOUT } from '../constants/design';
