import { createTheme, ThemeOptions } from '@mui/material/styles';

// Ecommerce-inspired color palette
const palette = {
    light: {
        primary: {
            main: '#1976d2', // Professional blue
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#9c27b0', // Purple accent
            light: '#ba68c8',
            dark: '#7b1fa2',
            contrastText: '#ffffff',
        },
        success: {
            main: '#2e7d32', // Green
            light: '#4caf50',
            dark: '#1b5e20',
        },
        warning: {
            main: '#ed6c02', // Orange
            light: '#ff9800',
            dark: '#e65100',
        },
        error: {
            main: '#d32f2f', // Red
            light: '#ef5350',
            dark: '#c62828',
        },
        info: {
            main: '#0288d1', // Cyan
            light: '#03a9f4',
            dark: '#01579b',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
        text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)',
            disabled: 'rgba(0, 0, 0, 0.38)',
        },
        divider: 'rgba(0, 0, 0, 0.12)',
    },
    dark: {
        primary: {
            main: '#90caf9', // Lighter blue for dark mode
            light: '#e3f2fd',
            dark: '#42a5f5',
            contrastText: '#000000',
        },
        secondary: {
            main: '#ce93d8', // Lighter purple
            light: '#f3e5f5',
            dark: '#ab47bc',
            contrastText: '#000000',
        },
        success: {
            main: '#66bb6a',
            light: '#81c784',
            dark: '#388e3c',
        },
        warning: {
            main: '#ffa726',
            light: '#ffb74d',
            dark: '#f57c00',
        },
        error: {
            main: '#f44336',
            light: '#e57373',
            dark: '#d32f2f',
        },
        info: {
            main: '#29b6f6',
            light: '#4fc3f7',
            dark: '#0288d1',
        },
        background: {
            default: '#0a1929',
            paper: '#132f4c',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
            disabled: 'rgba(255, 255, 255, 0.5)',
        },
        divider: 'rgba(255, 255, 255, 0.12)',
    },
};

// Shared theme options
const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
    palette: {
        mode,
        ...(mode === 'light' ? palette.light : palette.dark),
    },
    typography: {
        fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 700,
            lineHeight: 1.3,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.5,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.6,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.43,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    shadows: [
        'none',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 4px 8px rgba(0,0,0,0.08)',
        '0px 8px 16px rgba(0,0,0,0.1)',
        '0px 12px 24px rgba(0,0,0,0.12)',
        '0px 16px 32px rgba(0,0,0,0.14)',
        '0px 20px 40px rgba(0,0,0,0.16)',
        '0px 24px 48px rgba(0,0,0,0.18)',
        '0px 28px 56px rgba(0,0,0,0.2)',
        '0px 32px 64px rgba(0,0,0,0.22)',
        '0px 36px 72px rgba(0,0,0,0.24)',
        '0px 40px 80px rgba(0,0,0,0.26)',
        '0px 44px 88px rgba(0,0,0,0.28)',
        '0px 48px 96px rgba(0,0,0,0.3)',
        '0px 52px 104px rgba(0,0,0,0.32)',
        '0px 56px 112px rgba(0,0,0,0.34)',
        '0px 60px 120px rgba(0,0,0,0.36)',
        '0px 64px 128px rgba(0,0,0,0.38)',
        '0px 68px 136px rgba(0,0,0,0.4)',
        '0px 72px 144px rgba(0,0,0,0.42)',
        '0px 76px 152px rgba(0,0,0,0.44)',
        '0px 80px 160px rgba(0,0,0,0.46)',
        '0px 84px 168px rgba(0,0,0,0.48)',
        '0px 88px 176px rgba(0,0,0,0.5)',
        '0px 92px 184px rgba(0,0,0,0.52)',
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 16px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0px 4px 8px rgba(0,0,0,0.15)',
                    },
                },
                contained: {
                    '&:hover': {
                        boxShadow: '0px 6px 12px rgba(0,0,0,0.2)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: mode === 'light'
                        ? '0px 4px 12px rgba(0,0,0,0.08)'
                        : '0px 4px 12px rgba(0,0,0,0.4)',
                    transition: 'box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out',
                    '&:hover': {
                        boxShadow: mode === 'light'
                            ? '0px 8px 24px rgba(0,0,0,0.12)'
                            : '0px 8px 24px rgba(0,0,0,0.6)',
                        transform: 'translateY(-2px)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
                elevation1: {
                    boxShadow: mode === 'light'
                        ? '0px 2px 4px rgba(0,0,0,0.05)'
                        : '0px 2px 4px rgba(0,0,0,0.3)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 600,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: mode === 'light'
                        ? '0px 2px 8px rgba(0,0,0,0.08)'
                        : '0px 2px 8px rgba(0,0,0,0.4)',
                },
            },
        },
    },
});

export const lightTheme = createTheme(getThemeOptions('light'));
export const darkTheme = createTheme(getThemeOptions('dark'));
