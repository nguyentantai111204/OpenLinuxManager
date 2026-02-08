import { ReactNode } from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, COLORS } from '../../constants/design';
import { StackRowJusBetween, StackRow } from '../stack';

interface StatCardProps {
    icon: ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    iconColor?: string;
    iconBgColor?: string;
}

export function StatCard({
    icon,
    title,
    value,
    subtitle,
    change,
    changeType = 'neutral',
    iconColor = '#3b82f6',
    iconBgColor = '#eff6ff'
}: StatCardProps) {
    const changeColors = {
        positive: COLORS.status.running,
        negative: COLORS.status.stopped,
        neutral: COLORS.text.secondary
    };

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: BORDER_RADIUS.lg / 8,
                background: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
                p: SPACING.lg / 8,
            }}
        >
            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <StackRowJusBetween sx={{ mb: SPACING.md / 8 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'text.secondary',
                            fontWeight: TYPOGRAPHY.fontWeight.medium,
                            fontSize: TYPOGRAPHY.fontSize.xs,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                        }}
                    >
                        {title}
                    </Typography>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: BORDER_RADIUS.md / 8,
                            backgroundColor: iconBgColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: iconColor,
                        }}
                    >
                        {icon}
                    </Box>
                </StackRowJusBetween>

                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                        fontSize: TYPOGRAPHY.fontSize['3xl'],
                        color: 'text.primary',
                        mb: SPACING.xs / 8,
                        lineHeight: 1.2,
                    }}
                >
                    {value}
                </Typography>

                <StackRow spacing={SPACING.sm / 8}>
                    {change && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: changeColors[changeType],
                                fontWeight: TYPOGRAPHY.fontWeight.semibold,
                                fontSize: TYPOGRAPHY.fontSize.xs,
                            }}
                        >
                            {change}
                        </Typography>
                    )}
                    {subtitle && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'text.secondary',
                                fontWeight: TYPOGRAPHY.fontWeight.regular,
                                fontSize: TYPOGRAPHY.fontSize.xs,
                            }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </StackRow>
            </CardContent>
        </Card>
    );
}
