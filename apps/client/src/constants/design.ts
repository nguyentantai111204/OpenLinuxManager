
// ============================================================================
// COLORS
// ============================================================================

export const COLORS = {
    // Primary colors
    primary: {
        main: '#e8734e',
        light: '#ff9f6e',
        dark: '#b54a2e',
        contrastText: '#ffffff',
    },

    // Sidebar colors
    sidebar: {
        background: '#1e1b2e',
        backgroundLight: '#2d2945',
        active: '#e8734e',
        activeSubtle: 'rgba(232, 115, 78, 0.12)',
        hover: 'rgba(255, 255, 255, 0.05)',
        text: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.6)',
    },

    // Status colors
    status: {
        running: '#4caf50',
        runningLight: '#81c784',
        sleeping: '#9e9e9e',
        sleepingLight: '#bdbdbd',
        stopped: '#f44336',
        stoppedLight: '#e57373',
        zombie: '#ff9800',
        zombieLight: '#ffb74d',
    },

    // User badge colors
    user: {
        root: {
            background: '#fff3e0',
            text: '#e65100',
        },
        user: {
            background: '#e3f2fd',
            text: '#1565c0',
        },
        default: {
            background: '#f5f5f5',
            text: '#616161',
        },
    },

    // Semantic colors
    success: {
        main: '#4caf50',
        light: '#81c784',
        dark: '#388e3c',
    },
    warning: {
        main: '#ff9800',
        light: '#ffb74d',
        dark: '#f57c00',
    },
    error: {
        main: '#f44336',
        light: '#e57373',
        dark: '#d32f2f',
    },
    info: {
        main: '#2196f3',
        light: '#64b5f6',
        dark: '#1976d2',
    },

    // Chart colors
    chart: {
        cpu: '#2196f3',
        cpuArea: 'rgba(33, 150, 243, 0.1)',
        ram: '#e8734e',
        ramArea: 'rgba(232, 115, 78, 0.1)',
        disk: '#9c27b0',
        diskArea: 'rgba(156, 39, 176, 0.1)',
        grid: 'rgba(0, 0, 0, 0.1)',
    },

    // Background colors
    background: {
        default: '#f5f5f5',
        paper: '#ffffff',
        elevated: '#fafafa',
    },

    // Text colors
    text: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.6)',
        disabled: 'rgba(0, 0, 0, 0.38)',
        hint: 'rgba(0, 0, 0, 0.38)',
    },

    // Border colors
    border: {
        main: 'rgba(0, 0, 0, 0.12)',
        light: 'rgba(0, 0, 0, 0.08)',
        dark: 'rgba(0, 0, 0, 0.23)',
    },

    // Terminal
    terminal: {
        background: '#0a1929',
    },
};

// Dark mode colors
export const COLORS_DARK = {
    sidebar: {
        background: '#1a0f24',
        backgroundLight: '#2d1b3d',
        active: '#e8734e',
        hover: 'rgba(255, 255, 255, 0.08)',
        text: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.7)',
    },

    background: {
        default: '#0a1929',
        paper: '#132f4c',
        elevated: '#1e3a5f',
    },

    text: {
        primary: '#ffffff',
        secondary: 'rgba(255, 255, 255, 0.7)',
        disabled: 'rgba(255, 255, 255, 0.5)',
        hint: 'rgba(255, 255, 255, 0.5)',
    },

    border: {
        main: 'rgba(255, 255, 255, 0.12)',
        light: 'rgba(255, 255, 255, 0.08)',
        dark: 'rgba(255, 255, 255, 0.23)',
    },

    chart: {
        grid: 'rgba(255, 255, 255, 0.1)',
    },
};

// ============================================================================
// SPACING
// ============================================================================

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
};

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const TYPOGRAPHY = {
    fontFamily: {
        primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        mono: '"Roboto Mono", "Courier New", monospace',
    },

    fontSize: {
        xs: '0.75rem',      // 12px
        sm: '0.875rem',     // 14px
        base: '1rem',       // 16px
        lg: '1.125rem',     // 18px
        xl: '1.25rem',      // 20px
        '2xl': '1.5rem',    // 24px
        '3xl': '1.875rem',  // 30px
        '4xl': '2.25rem',   // 36px
        '5xl': '3rem',      // 48px
    },

    fontWeight: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
    },

    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
        loose: 2,
    },
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const BORDER_RADIUS = {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,
};

// ============================================================================
// SHADOWS
// ============================================================================

export const SHADOWS = {
    none: 'none',
    sm: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    md: '0px 4px 8px rgba(0, 0, 0, 0.08)',
    lg: '0px 8px 16px rgba(0, 0, 0, 0.1)',
    xl: '0px 12px 24px rgba(0, 0, 0, 0.12)',
    '2xl': '0px 16px 32px rgba(0, 0, 0, 0.14)',
    '3xl': '0px 24px 48px rgba(0, 0, 0, 0.18)',
};

// ============================================================================
// TRANSITIONS
// ============================================================================

export const TRANSITIONS = {
    duration: {
        fastest: '100ms',
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
        slowest: '700ms',
    },

    easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
};

// ============================================================================
// LAYOUT
// ============================================================================

export const LAYOUT = {
    sidebar: {
        width: 260,
        widthCollapsed: 64,
    },

    header: {
        height: 64,
    },

    container: {
        maxWidth: {
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            '2xl': 1536,
        },
    },

    breakpoints: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
    },
};

// ============================================================================
// Z-INDEX
// ============================================================================

export const Z_INDEX = {
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
};

// ============================================================================
// ICON SIZES
// ============================================================================

export const ICON_SIZES = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
};
