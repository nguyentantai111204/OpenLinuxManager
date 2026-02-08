import { ReactNode } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/design';

interface StatCardProps {
    icon: ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    footer?: string;
}

export function StatCard({ icon, title, value, subtitle, footer }: StatCardProps) {
    return (
        <Card
            elevation={2}
            sx={{
                borderRadius: BORDER_RADIUS.lg / 8,
                boxShadow: SHADOWS.md,
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: SPACING.md / 8 }}>
                    <Box sx={{ mr: SPACING.sm / 8, color: 'primary.main' }}>
                        {icon}
                    </Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: TYPOGRAPHY.fontWeight.semibold,
                        }}
                    >
                        {title}
                    </Typography>
                </Box>
                <Typography
                    variant="h2"
                    color="primary"
                    sx={{
                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                        mb: subtitle ? SPACING.sm / 8 : 0,
                    }}
                >
                    {value}
                </Typography>
                {subtitle && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontWeight: TYPOGRAPHY.fontWeight.medium,
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}
                {footer && (
                    <Box
                        sx={{
                            mt: SPACING.md / 8,
                            p: SPACING.md / 8,
                            bgcolor: 'action.hover',
                            borderRadius: SPACING.sm / 8,
                            border: 1,
                            borderColor: 'divider',
                        }}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                fontWeight: TYPOGRAPHY.fontWeight.medium,
                            }}
                        >
                            {footer}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
