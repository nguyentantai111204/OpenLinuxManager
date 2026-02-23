import { createTheme, ThemeOptions } from '@mui/material/styles';
import { COLORS, COLORS_DARK } from '../constants/design';

const palette = {
    light: {
        primary: COLORS.primary,
        secondary: {
            main: COLORS.chart.disk,
            light: '#ba68c8',
            dark: '#7b1fa2',
            contrastText: '#ffffff',
        },
        success: COLORS.success,
        warning: COLORS.warning,
        error: COLORS.error,
        info: COLORS.info,
        background: COLORS.background,
        text: COLORS.text,
        divider: COLORS.border.main,
    },
    dark: {
        primary: {
            main: '#90caf9',
            light: '#e3f2fd',
            dark: '#42a5f5',
            contrastText: '#000000',
        },
        secondary: {
            main: '#ce93d8',
            light: '#f3e5f5',
            dark: '#ab47bc',
            contrastText: '#000000',
        },
        success: COLORS.success,
        warning: COLORS.warning,
        error: COLORS.error,
        info: COLORS.info,
        background: COLORS_DARK.background,
        text: COLORS_DARK.text,
        divider: COLORS_DARK.border.main,
    },
};

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
                    borderRadius: 12,
                    padding: '8px 16px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                contained: {
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: mode === 'light'
                        ? '0px 4px 12px rgba(0,0,0,0.08)'
                        : '0px 4px 12px rgba(0,0,0,0.4)',
                    transition: 'none',
                    '&:hover': {
                        boxShadow: mode === 'light'
                            ? '0px 4px 12px rgba(0,0,0,0.08)'
                            : '0px 4px 12px rgba(0,0,0,0.4)',
                        transform: 'none',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderRadius: 12,
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
                    borderRadius: 12,
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
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: 'none',
                    border: mode === 'light'
                        ? '1px solid rgba(0,0,0,0.08)'
                        : '1px solid rgba(255,255,255,0.08)',
                },
            },
        },
        MuiTable: {
            styleOverrides: {
                root: {
                    '& .MuiTableCell-root': {
                        borderBottom: mode === 'light'
                            ? '1px solid rgba(0,0,0,0.06)'
                            : '1px solid rgba(255,255,255,0.06)',
                    },
                    '& .MuiTableRow-root:last-child .MuiTableCell-root': {
                        borderBottom: 'none',
                    },
                },
            },
        },
    },
});

export const lightTheme = createTheme(getThemeOptions('light'));
export const darkTheme = createTheme(getThemeOptions('dark'));
