import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import { ButtonComponent } from '../button/button.component';
import { BORDER_RADIUS } from '../../constants/design';

interface ConfirmationDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    severity?: 'error' | 'warning' | 'info';
}

export function ConfirmationDialogComponent({
    open,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    severity = 'warning',
}: ConfirmationDialogProps) {
    const getConfirmColor = () => {
        switch (severity) {
            case 'error':
                return 'error';
            case 'warning':
                return 'warning';
            case 'info':
                return 'primary';
            default:
                return 'primary';
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            PaperProps={{
                sx: {
                    borderRadius: BORDER_RADIUS.lg,
                    minWidth: 400,
                },
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <ButtonComponent onClick={onCancel} variant="outlined" color="inherit">
                    {cancelText}
                </ButtonComponent>
                <ButtonComponent
                    onClick={onConfirm}
                    variant="contained"
                    color={getConfirmColor()}
                    autoFocus
                >
                    {confirmText}
                </ButtonComponent>
            </DialogActions>
        </Dialog>
    );
}
