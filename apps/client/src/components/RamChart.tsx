import { useMemo } from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Memory as MemoryIcon } from '@mui/icons-material';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, COLORS } from '../constants/design';

interface RamChartProps {
    ramTotal: number;
    ramUsed: number;
    ramFree: number;
}

export function RamChart({ ramTotal, ramUsed, ramFree }: RamChartProps) {
    const theme = useTheme();

    const CHART_COLORS = [COLORS.chart.ram, COLORS.status.running];

    const data = useMemo(() => {
        return [
            { name: 'Used', value: ramUsed },
            { name: 'Free', value: ramFree },
        ];
    }, [ramUsed, ramFree]);

    const usagePercent = useMemo(() => {
        if (ramTotal === 0) return 0;
        return ((ramUsed / ramTotal) * 100).toFixed(1);
    }, [ramTotal, ramUsed]);

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
                    <MemoryIcon sx={{ mr: SPACING.sm / 8, color: 'primary.main' }} />
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: TYPOGRAPHY.fontWeight.semibold,
                        }}
                    >
                        RAM Usage
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: SPACING.sm / 8 }}>
                    <Typography
                        variant="h2"
                        component="span"
                        color="primary"
                        sx={{
                            fontWeight: TYPOGRAPHY.fontWeight.bold,
                        }}
                    >
                        {usagePercent}
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
                <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                    sx={{
                        fontWeight: TYPOGRAPHY.fontWeight.medium,
                    }}
                >
                    {ramUsed.toFixed(0)} MB / {ramTotal.toFixed(0)} MB
                </Typography>
                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                                    stroke={theme.palette.background.paper}
                                    strokeWidth={2}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: BORDER_RADIUS.md,
                                boxShadow: SHADOWS.md,
                            }}
                            formatter={(value: number | string | Array<number | string> | undefined) => {
                                const numValue = typeof value === 'number' ? value : 0;
                                return `${numValue.toFixed(0)} MB`;
                            }}
                        />
                        <Legend
                            wrapperStyle={{
                                fontSize: TYPOGRAPHY.fontSize.sm,
                                fontWeight: TYPOGRAPHY.fontWeight.semibold,
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
