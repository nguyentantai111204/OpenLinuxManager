import { useMemo } from 'react';
import { Typography, Box, useTheme } from '@mui/material';
import { CardComponent } from '../../components';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, COLORS } from '../../constants/design';
import { StackColComponent, StackRowComponent } from '../../components/stack';

interface RamChartProps {
    ramTotal: number;
    ramUsed: number;
    ramFree: number;
}

export function RamChart({ ramTotal, ramUsed, ramFree }: RamChartProps) {
    const theme = useTheme();

    const CHART_COLORS = [COLORS.text.secondary, COLORS.chart.ram];

    const data = useMemo(() => {
        return [
            { name: 'Free', value: ramFree },
            { name: 'Used', value: ramUsed },
        ];
    }, [ramUsed, ramFree]);

    const usagePercent = useMemo(() => {
        if (ramTotal === 0) return 0;
        return ((ramUsed / ramTotal) * 100).toFixed(1);
    }, [ramTotal, ramUsed]);

    return (
        <CardComponent sx={{ height: '100%' }}>
            <Box sx={{ p: SPACING.lg / 8, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: TYPOGRAPHY.fontWeight.semibold,
                        fontSize: TYPOGRAPHY.fontSize.lg,
                        color: 'text.primary',
                        mb: SPACING.lg / 8,
                    }}
                >
                    RAM Allocation
                </Typography>

                <Box sx={{ position: 'relative', height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={85}
                                outerRadius={120}
                                paddingAngle={0}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                                        stroke="none"
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    <StackColComponent
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                        }}
                        spacing={0}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: TYPOGRAPHY.fontWeight.bold,
                                fontSize: TYPOGRAPHY.fontSize['4xl'],
                                color: 'text.primary',
                                lineHeight: 1,
                            }}
                        >
                            {(ramUsed / 1024 / 1024 / 1024).toFixed(1)}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'text.secondary',
                                fontSize: TYPOGRAPHY.fontSize.sm,
                                fontWeight: TYPOGRAPHY.fontWeight.medium,
                            }}
                        >
                            GB Used
                        </Typography>
                    </StackColComponent>
                </Box>

                <StackRowComponent sx={{ justifyContent: 'center', gap: SPACING.xl / 8, mt: SPACING.md / 8 }}>
                    <StackColComponent sx={{ textAlign: 'center' }} spacing={SPACING.xs / 8}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'text.secondary',
                                fontSize: TYPOGRAPHY.fontSize.xs,
                            }}
                        >
                            Free
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: TYPOGRAPHY.fontWeight.semibold,
                                fontSize: TYPOGRAPHY.fontSize.sm,
                                color: 'text.primary',
                            }}
                        >
                            {(ramFree / 1024 / 1024 / 1024).toFixed(1)} GB
                        </Typography>
                    </StackColComponent>
                    <StackColComponent sx={{ textAlign: 'center' }} spacing={SPACING.xs / 8}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'text.secondary',
                                fontSize: TYPOGRAPHY.fontSize.xs,
                            }}
                        >
                            Used
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: TYPOGRAPHY.fontWeight.semibold,
                                fontSize: TYPOGRAPHY.fontSize.sm,
                                color: COLORS.chart.ram,
                            }}
                        >
                            {(ramUsed / 1024 / 1024 / 1024).toFixed(1)} GB
                        </Typography>
                    </StackColComponent>
                </StackRowComponent>
            </Box>
        </CardComponent>
    );
}
