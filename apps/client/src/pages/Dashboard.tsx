import { useState, useEffect } from 'react';
import { Container, Box, Fade, Grow, CircularProgress, Alert, Grid, Stack } from '@mui/material';
import { useSocket } from '../hooks/useSocket';
import { CpuChart } from '../components/CpuChart';
import { RamChart } from '../components/RamChart';
import { PageHeader } from '../components/common/PageHeader';
import { SPACING } from '../constants/design';
import { StatCard } from '../components/dashboard/StatCard';
import { DeveloperBoard, Memory, Storage, Timer } from '@mui/icons-material';

interface CpuDataPoint {
    time: string;
    cpu: number;
}

export function Dashboard() {
    const { systemStats, isConnected } = useSocket();
    const [cpuHistory, setCpuHistory] = useState<CpuDataPoint[]>([]);

    // Update CPU history when new stats arrive
    useEffect(() => {
        if (systemStats) {
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
                .getMinutes()
                .toString()
                .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

            setCpuHistory((prev) => {
                const newHistory = [
                    ...prev,
                    {
                        time: timeStr,
                        cpu: systemStats.cpu,
                    },
                ];
                // Keep only last 30 data points
                return newHistory.slice(-30);
            });
        }
    }, [systemStats]);

    // Format uptime to human-readable
    const formatUptime = (seconds: number): string => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);

        if (days > 0) return `${days}d ${hours}h`;
        return `${hours}h`;
    };

    if (!isConnected) {
        return (
            <Container maxWidth="xl" sx={{ mt: SPACING.xl / 8 }}>
                <Fade in timeout={500}>
                    <Alert
                        severity="warning"
                        icon={<CircularProgress size={20} />}
                        sx={{ borderRadius: SPACING.md / 8 }}
                    >
                        Connecting to server...
                    </Alert>
                </Fade>
            </Container>
        );
    }

    if (!systemStats) {
        return (
            <Container maxWidth="xl" sx={{ mt: SPACING.xl / 8 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <CircularProgress size={60} thickness={4} />
                </Box>
            </Container>
        );
    }

    const currentCpu = cpuHistory.length > 0 ? cpuHistory[cpuHistory.length - 1].cpu : systemStats.cpu;
    const ramUsagePercent = ((systemStats.ram_used / systemStats.ram_total) * 100).toFixed(1);
    const ramUsageGB = (systemStats.ram_used / 1024).toFixed(1);
    const ramTotalGB = (systemStats.ram_total / 1024).toFixed(1);

    return (
        <Container maxWidth="xl" sx={{ py: SPACING.xl / 8 }}>
            <Fade in timeout={300}>
                <Stack>
                    <PageHeader
                        title="System Dashboard"
                        subtitle="Real-time monitoring and system statistics"
                        isConnected={isConnected}
                    />
                </Stack>
            </Fade>

            {/* Stats Overview Row */}
            <Grid container spacing={SPACING.lg / 8} sx={{ mb: SPACING.lg / 8 }}>
                <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                    <Grow in timeout={300}>
                        <Stack>
                            <StatCard
                                icon={<DeveloperBoard />}
                                title="CPU Usage"
                                value={`${currentCpu.toFixed(1)}%`}
                                change="+2.4%"
                                changeType="positive"
                                subtitle="12 Cores Active"
                                iconColor="#3b82f6"
                                iconBgColor="#eff6ff"
                            />
                        </Stack>
                    </Grow>
                </Grid>
                <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                    <Grow in timeout={400}>
                        <Stack>
                            <StatCard
                                icon={<Memory />}
                                title="Memory"
                                value={`${ramUsageGB} GB`}
                                change="-0.5%"
                                changeType="negative"
                                subtitle={`of ${ramTotalGB} GB Total`}
                                iconColor="#f97316"
                                iconBgColor="#fff7ed"
                            />
                        </Stack>
                    </Grow>
                </Grid>
                <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                    <Grow in timeout={500}>
                        <Stack>
                            <StatCard
                                icon={<Storage />}
                                title="Disk Space"
                                value="64%"
                                change="+0.1%"
                                changeType="positive"
                                subtitle="120GB Free"
                                iconColor="#8b5cf6"
                                iconBgColor="#f5f3ff"
                            />
                        </Stack>
                    </Grow>
                </Grid>
                <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                    <Grow in timeout={600}>
                        <Stack>
                            <StatCard
                                icon={<Timer />}
                                title="Uptime"
                                value={formatUptime(systemStats.uptime)}
                                change="0%"
                                changeType="neutral"
                                subtitle="Since last boot"
                                iconColor="#10b981"
                                iconBgColor="#f0fdf4"
                            />
                        </Stack>
                    </Grow>
                </Grid>
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={SPACING.lg / 8}>
                <Grid sx={{ xs: 12, lg: 7 }}>
                    <Grow in timeout={700}>
                        <Stack>
                            <CpuChart data={cpuHistory} />
                        </Stack>
                    </Grow>
                </Grid>

                <Grid sx={{ xs: 12, lg: 5 }}>
                    <Grow in timeout={800}>
                        <Stack>
                            <RamChart
                                ramTotal={systemStats.ram_total}
                                ramUsed={systemStats.ram_used}
                                ramFree={systemStats.ram_free}
                            />
                        </Stack>
                    </Grow>
                </Grid>
            </Grid>

            {/* Error Display */}
            {systemStats.error && (
                <Fade in timeout={500}>
                    <Box sx={{ mt: SPACING.lg / 8 }}>
                        <Alert severity="error" sx={{ borderRadius: SPACING.md / 8 }}>
                            {systemStats.error}
                        </Alert>
                    </Box>
                </Fade>
            )}
        </Container>
    );
}
