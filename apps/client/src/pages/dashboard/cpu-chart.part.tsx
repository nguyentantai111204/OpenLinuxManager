import { Typography, Box, useTheme, alpha } from '@mui/material';
import { CardComponent } from '../../components';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts';
import { SPACING, TYPOGRAPHY, COLORS } from '../../constants/design';
import { StackRowComponent } from '../../components/stack';

interface CpuChartProps {
    data: Array<{ time: string; cpu: number; ram: number }>;
}

export function CpuChart({ data }: CpuChartProps) {
    const theme = useTheme();

    return (
        <CardComponent sx={{ p: 0, height: '100%' }}>
            <Box sx={{ p: SPACING.lg / 8, height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                        Real-time Performance
                    </Typography>
                    <StackRowComponent spacing={SPACING.md / 8}>
                        <StackRowComponent spacing={SPACING.xs / 8}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS.chart.cpu }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: TYPOGRAPHY.fontSize.xs }}>
                                CPU
                            </Typography>
                        </StackRowComponent>
                        <StackRowComponent spacing={SPACING.xs / 8}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS.chart.ram }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: TYPOGRAPHY.fontSize.xs }}>
                                RAM
                            </Typography>
                        </StackRowComponent>
                    </StackRowComponent>
                </Box>

                <Box sx={{ height: 350, position: 'relative', width: '100%' }}>
                    {data.length === 0 ? (
                        <Box sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: 2
                        }}>
                            <Typography color="text.secondary">Waiting for data...</Typography>
                        </Box>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS.chart.cpu} stopOpacity={0.2} />
                                        <stop offset="95%" stopColor={COLORS.chart.cpu} stopOpacity={0.01} />
                                    </linearGradient>
                                    <linearGradient id="ramGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS.chart.ram} stopOpacity={0.2} />
                                        <stop offset="95%" stopColor={COLORS.chart.ram} stopOpacity={0.01} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={theme.palette.divider}
                                    opacity={0.3}
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="time"
                                    hide
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: theme.palette.text.secondary, fontSize: 10 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: theme.palette.background.paper,
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 8,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    }}
                                    formatter={(value: number | undefined, name: string | undefined) => [
                                        typeof value === 'number' ? `${value.toFixed(1)}%` : '',
                                        name === 'cpu' ? 'CPU' : (name === 'ram' ? 'RAM' : (name || ''))
                                    ]}
                                    labelStyle={{ color: theme.palette.text.primary }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="cpu"
                                    stroke={COLORS.chart.cpu}
                                    strokeWidth={3}
                                    fill="url(#cpuGradient)"
                                    animationDuration={1000}
                                    isAnimationActive={true}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="ram"
                                    stroke={COLORS.chart.ram}
                                    strokeWidth={3}
                                    fill="url(#ramGradient)"
                                    animationDuration={1000}
                                    isAnimationActive={true}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </Box>
            </Box>
        </CardComponent>
    );
}
