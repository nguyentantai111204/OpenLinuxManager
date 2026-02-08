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
        <Card elevation={2}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight={600}>
                        CPU Usage
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                    <Typography variant="h2" component="span" color="primary" fontWeight={700}>
                        {currentCpu.toFixed(1)}
                    </Typography>
                    <Typography variant="h4" component="span" color="text.secondary" sx={{ ml: 1 }}>
                        %
                    </Typography>
                </Box>
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={data}>
                        <defs>
                            <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
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
                            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[0, 100]}
                            stroke={theme.palette.text.secondary}
                            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: theme.shape.borderRadius,
                                boxShadow: theme.shadows[4],
                            }}
                            labelStyle={{ color: theme.palette.text.primary }}
                        />
                        <Line
                            type="monotone"
                            dataKey="cpu"
                            stroke={theme.palette.primary.main}
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
