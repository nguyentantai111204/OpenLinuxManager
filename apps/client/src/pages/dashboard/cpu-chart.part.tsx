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
    Area,
    AreaChart,
} from 'recharts';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, COLORS } from '../../constants/design';
import { StackRow } from '../../components/stack';

interface CpuChartProps {
    data: Array<{ time: string; cpu: number }>;
}

export function CpuChart({ data }: CpuChartProps) {
    const theme = useTheme();
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: BORDER_RADIUS.lg / 8,
                background: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
            }}
        >
            <CardContent sx={{ p: SPACING.lg / 8 }}>
                <Box sx={{ mb: SPACING.lg / 8 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: TYPOGRAPHY.fontWeight.semibold,
                            fontSize: TYPOGRAPHY.fontSize.lg,
                            color: 'text.primary',
                            mb: SPACING.xs / 8,
                        }}
                    >
                        Hiệu năng thời gian thực
                    </Typography>
                    <StackRow spacing={SPACING.md / 8}>
                        <StackRow spacing={SPACING.xs / 8}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS.chart.cpu }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: TYPOGRAPHY.fontSize.xs }}>
                                CPU
                            </Typography>
                        </StackRow>
                        <StackRow spacing={SPACING.xs / 8}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS.chart.ram }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: TYPOGRAPHY.fontSize.xs }}>
                                RAM
                            </Typography>
                        </StackRow>
                    </StackRow>
                </Box>

                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS.chart.cpu} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={COLORS.chart.cpu} stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id="ramGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS.chart.ram} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={COLORS.chart.ram} stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={theme.palette.divider}
                            opacity={0.2}
                            vertical={false}
                        />
                        <XAxis
                            dataKey="time"
                            stroke={theme.palette.text.secondary}
                            tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            hide
                        />
                        <YAxis
                            domain={[0, 100]}
                            stroke={theme.palette.text.secondary}
                            tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            hide
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 8,
                                fontSize: 12,
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="cpu"
                            stroke={COLORS.chart.cpu}
                            strokeWidth={2}
                            fill="url(#cpuGradient)"
                            animationDuration={300}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
