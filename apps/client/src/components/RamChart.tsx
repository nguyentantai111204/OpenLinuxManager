import { useMemo } from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Memory as MemoryIcon } from '@mui/icons-material';

interface RamChartProps {
    ramTotal: number;
    ramUsed: number;
    ramFree: number;
}

export function RamChart({ ramTotal, ramUsed, ramFree }: RamChartProps) {
    const theme = useTheme();

    const COLORS = [theme.palette.error.main, theme.palette.success.main];

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
        <Card elevation={2}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MemoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight={600}>
                        RAM Usage
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                    <Typography variant="h2" component="span" color="primary" fontWeight={700}>
                        {usagePercent}
                    </Typography>
                    <Typography variant="h4" component="span" color="text.secondary" sx={{ ml: 1 }}>
                        %
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
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
                                    fill={COLORS[index % COLORS.length]}
                                    stroke={theme.palette.background.paper}
                                    strokeWidth={2}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: theme.shape.borderRadius,
                                boxShadow: theme.shadows[4],
                            }}
                            formatter={(value: number | string | Array<number | string> | undefined) => {
                                const numValue = typeof value === 'number' ? value : 0;
                                return `${numValue.toFixed(0)} MB`;
                            }}
                        />
                        <Legend
                            wrapperStyle={{
                                fontSize: '14px',
                                fontWeight: 600,
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
