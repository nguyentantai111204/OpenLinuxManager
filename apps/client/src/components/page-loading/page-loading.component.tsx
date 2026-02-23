import React from 'react';
import { CircularProgress, Typography } from '@mui/material';
import { StackColAlignCenterJusCenterComponent } from '../stack';
import { SPACING, TYPOGRAPHY } from '../../constants/design';

interface PageLoadingProps {
    message?: string;
    size?: number;
    minHeight?: string;
}

/**
 * Full-page loading indicator with optional message.
 * Replaces the repeated CircularProgress + Typography pattern.
 */
export function PageLoading({
    message = 'Đang tải...',
    size = 40,
    minHeight = '50vh',
}: PageLoadingProps) {
    return (
        <StackColAlignCenterJusCenterComponent sx={{ minHeight }}>
            <CircularProgress size={size} color="primary" />
            {message && (
                <Typography
                    variant="body2"
                    sx={{
                        mt: SPACING.md / 8,
                        color: 'text.secondary',
                        fontWeight: TYPOGRAPHY.fontWeight.medium,
                    }}
                >
                    {message}
                </Typography>
            )}
        </StackColAlignCenterJusCenterComponent>
    );
}
