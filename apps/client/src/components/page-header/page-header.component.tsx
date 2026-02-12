import { ReactNode } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Error as ErrorIcon } from '@mui/icons-material';
import { SPACING, TYPOGRAPHY } from '../../constants/design';
import { StackRowComponent, StackRowAlignStartJusBetweenComponent } from '../stack';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    isConnected?: boolean;
    actions?: ReactNode;
}

export function PageHeaderComponentComponent({ title, subtitle, isConnected, actions }: PageHeaderProps) {
    return (
        <Box sx={{ mb: SPACING.lg / 8 }}>
            <StackRowAlignStartJusBetweenComponent sx={{ mb: SPACING.sm / 8 }}>
                <Box>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: TYPOGRAPHY.fontWeight.bold,
                            fontSize: TYPOGRAPHY.fontSize['3xl'],
                            mb: SPACING.xs / 8,
                        }}
                    >
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{
                                fontSize: TYPOGRAPHY.fontSize.base,
                            }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                {actions && <Box>{actions}</Box>}
            </StackRowAlignStartJusBetweenComponent>

            {isConnected !== undefined && (
                <StackRowComponent spacing={SPACING.sm / 8}>
                    <Chip
                        icon={isConnected ? <CheckCircleIcon /> : <ErrorIcon />}
                        label={isConnected ? 'Connected' : 'Disconnected'}
                        color={isConnected ? 'success' : 'error'}
                        size="small"
                        sx={{ fontWeight: TYPOGRAPHY.fontWeight.semibold }}
                    />
                </StackRowComponent>
            )}
        </Box>
    );
}
