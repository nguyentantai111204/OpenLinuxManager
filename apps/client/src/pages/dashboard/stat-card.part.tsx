import { ReactNode } from 'react';
import { Typography, Box, SxProps, Theme, alpha } from '@mui/material';
import { CardComponent } from '../../components';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, COLORS } from '../../constants/design';
import { StackRowJusBetweenComponent } from '../../components/stack';

interface StatCardProps {
    icon: ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    iconColor?: string;
    iconBgColor?: string;
    sx?: SxProps<Theme>;
}

export function StatCard({
    icon,
    title,
    value,
    subtitle,
    change,
    changeType = 'neutral',
    iconColor = COLORS.primary.main,
    iconBgColor,
    sx
}: StatCardProps) {
    const changeColors = {
        positive: {
            bg: alpha(COLORS.status.running, 0.1),
            text: COLORS.status.running
        },
        negative: {
            bg: alpha(COLORS.status.stopped, 0.1),
            text: COLORS.status.stopped
        },
        neutral: {
            bg: alpha(COLORS.text.secondary, 0.1),
            text: COLORS.text.secondary
        }
    };

    const changeStyle = changeColors[changeType];

    return (
        <CardComponent sx={{ height: '100%', ...sx }}>
            <Box sx={{ p: SPACING.lg / 8 }}>
                <StackRowJusBetweenComponent sx={{ mb: SPACING.md / 8 }}>
                    <Box
                        sx={{
                            p: SPACING.sm / 8,
                            borderRadius: BORDER_RADIUS.md,
                            backgroundColor: iconBgColor || alpha(iconColor, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: iconColor
                        }}
                    >
                        {icon}
                    </Box>
                    {change && (
                        <Box
                            sx={{
                                px: SPACING.sm / 8,
                                py: SPACING.xs / 8,
                                borderRadius: BORDER_RADIUS.sm,
                                backgroundColor: changeStyle.bg,
                                color: changeStyle.text,
                                fontSize: TYPOGRAPHY.fontSize.xs,
                                fontWeight: TYPOGRAPHY.fontWeight.bold,
                            }}
                        >
                            {change}
                        </Box>
                    )}
                </StackRowJusBetweenComponent>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        fontWeight: TYPOGRAPHY.fontWeight.medium,
                        mb: SPACING.xs / 8,
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                        color: 'text.primary',
                        mb: subtitle ? SPACING.xs / 8 : 0,
                    }}
                >
                    {value}
                </Typography>

                {subtitle && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            fontWeight: TYPOGRAPHY.fontWeight.regular,
                            fontSize: TYPOGRAPHY.fontSize.xs,
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>
        </CardComponent>
    );
}
