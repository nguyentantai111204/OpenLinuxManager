import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Box,
    Typography,
} from '@mui/material';
import {
    WarningAmberRounded as WarningIcon,
    ErrorOutlineRounded as ErrorIcon,
    InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { ButtonComponent } from '../button/button.component';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY, SHADOWS } from '../../constants/design';

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
    const getIcon = () => {
        const iconSx = { fontSize: 40, mb: 2 };
        switch (severity) {
            case 'error':
                return <ErrorIcon color="error" sx={iconSx} />;
            case 'warning':
                return <WarningIcon color="warning" sx={iconSx} />;
            case 'info':
                return <InfoIcon color="info" sx={iconSx} />;
            default:
                return <WarningIcon color="warning" sx={iconSx} />;
        }
    };

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
                    borderRadius: `${BORDER_RADIUS.lg}px`,
                    width: '100%',
                    maxWidth: 440,
                    p: SPACING.md / 8,
                    overflow: 'hidden',
                    boxShadow: SHADOWS.xl,
                },
            }}
        >
            <DialogContent sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {getIcon()}
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: TYPOGRAPHY.fontWeight.bold,
                            mb: 1,
                            color: 'text.primary',
                        }}
                    >
                        {title}
                    </Typography>
                    <DialogContentText
                        sx={{
                            color: 'text.secondary',
                            px: 2,
                            lineHeight: 1.6,
                        }}
                    >
                        {message}
                    </DialogContentText>
                </Box>
            </DialogContent>
            <DialogActions
                sx={{
                    px: 3,
                    pb: 3,
                    pt: 1,
                    justifyContent: 'center',
                    gap: 2,
                }}
            >
                <ButtonComponent
                    onClick={onCancel}
                    variant="outlined"
                    color="inherit"
                    sx={{ minWidth: 100, borderRadius: `${BORDER_RADIUS.md}px` }}
                >
                    {cancelText}
                </ButtonComponent>
                <ButtonComponent
                    onClick={onConfirm}
                    variant="contained"
                    color={getConfirmColor()}
                    autoFocus
                    sx={{ minWidth: 100, borderRadius: `${BORDER_RADIUS.md}px` }}
                >
                    {confirmText}
                </ButtonComponent>
            </DialogActions>
        </Dialog>
    );
}
