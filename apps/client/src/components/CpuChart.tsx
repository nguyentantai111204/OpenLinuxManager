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
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/design';

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
                {/* Header */}
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
                    <Box sx={{ display: 'flex', gap: SPACING.md / 8, alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: SPACING.xs / 8 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#3b82f6' }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: TYPOGRAPHY.fontSize.xs }}>
                                CPU
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: SPACING.xs / 8 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f97316' }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: TYPOGRAPHY.fontSize.xs }}>
                                RAM
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Chart */}
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id="ramGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
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
                            stroke="#3b82f6"
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
