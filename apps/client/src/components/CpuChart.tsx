import { useMemo } from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, COLORS } from '../constants/design';

interface CpuChartProps {
    data: Array<{ time: string; cpu: number }>;
}

export function CpuChart({ data }: CpuChartProps) {
    const theme = useTheme();
    const currentCpu = useMemo(() => {
        if (data.length === 0) return 0;
        return data[data.length - 1].cpu;
    }, [data]);

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
                    <TrendingUpIcon sx={{ mr: SPACING.sm / 8, color: 'primary.main' }} />
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: TYPOGRAPHY.fontWeight.semibold,
                        }}
                    >
                        CPU Usage
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: SPACING.lg / 8 }}>
                    <Typography
                        variant="h2"
                        component="span"
                        color="primary"
                        sx={{
                            fontWeight: TYPOGRAPHY.fontWeight.bold,
                        }}
                    >
                        {currentCpu.toFixed(1)}
                    </Typography>
                    <Typography
                        variant="h4"
                        component="span"
                        color="text.secondary"
                        sx={{ ml: SPACING.sm / 8 }}
                    >
                        %
                    </Typography>
                </Box>
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={data}>
                        <defs>
                            <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS.chart.cpu} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={COLORS.chart.cpu} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={theme.palette.divider}
                            opacity={0.5}
                        />
                        <XAxis
                            dataKey="time"
                            stroke={theme.palette.text.secondary}
                            tick={{ fill: theme.palette.text.secondary, fontSize: TYPOGRAPHY.fontSize.xs }}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[0, 100]}
                            stroke={theme.palette.text.secondary}
                            tick={{ fill: theme.palette.text.secondary, fontSize: TYPOGRAPHY.fontSize.xs }}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: BORDER_RADIUS.md,
                                boxShadow: SHADOWS.md,
                            }}
                            labelStyle={{ color: theme.palette.text.primary }}
                        />
                        <Line
                            type="monotone"
                            dataKey="cpu"
                            stroke={COLORS.chart.cpu}
                            strokeWidth={3}
                            dot={false}
                            fill="url(#cpuGradient)"
                            animationDuration={300}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
