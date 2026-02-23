import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { SnackbarSeverity } from '../../hooks/use-snackbar';
import { BORDER_RADIUS } from '../../constants/design';

interface AppSnackbarProps {
    open: boolean;
    message: string;
    severity: SnackbarSeverity;
    onClose: () => void;
    autoHideDuration?: number;
}

/**
 * Standard application snackbar.
 * Use with the `useSnackbar()` hook:
 *   const { snackbarProps, showSnackbar } = useSnackbar();
 *   <AppSnackbar {...snackbarProps} />
 */
export function AppSnackbar({
    open,
    message,
    severity,
    onClose,
    autoHideDuration = 6000,
}: AppSnackbarProps) {
    return (
        <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose}>
            <Alert
                onClose={onClose}
                severity={severity}
                sx={{ width: '100%', borderRadius: BORDER_RADIUS.md }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
