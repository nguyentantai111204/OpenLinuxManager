import { useState, useCallback } from 'react';

export type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarState {
    open: boolean;
    message: string;
    severity: SnackbarSeverity;
}

export interface UseSnackbarReturn {
    /** Pass these props directly to <AppSnackbar> */
    snackbarProps: SnackbarState & { onClose: () => void };
    /** Call this to show a snackbar notification */
    showSnackbar: (message: string, severity?: SnackbarSeverity) => void;
}

/**
 * Manages snackbar open/close state.
 * Use together with <AppSnackbar> component.
 */
export function useSnackbar(): UseSnackbarReturn {
    const [state, setState] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'success',
    });

    const showSnackbar = useCallback(
        (message: string, severity: SnackbarSeverity = 'success') => {
            setState({ open: true, message, severity });
        },
        [],
    );

    const onClose = useCallback(() => {
        setState((prev) => ({ ...prev, open: false }));
    }, []);

    return {
        snackbarProps: { ...state, onClose },
        showSnackbar,
    };
}
