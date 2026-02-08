import { useState, useEffect } from 'react';
import { Container, Box, Fade, Grow, CircularProgress, Alert, Grid } from '@mui/material';
import { useSocket } from '../hooks/useSocket';
import { CpuChart } from '../components/CpuChart';
import { RamChart } from '../components/RamChart';
import { PageHeader } from '../components/common/PageHeader';
import { SPACING } from '../constants/design';
import { StatCard } from '../components/dashboard/StatCard';
import { AccessTime, Computer } from '@mui/icons-material';

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
                // Keep only last 20 data points
                return newHistory.slice(-20);
            });
        }
    }, [systemStats]);

    // Format uptime to human-readable
    const formatUptime = (seconds: number): string => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        const parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);

        return parts.join(' ') || '0m';
    };

    if (!isConnected) {
        return (
            <Container maxWidth="lg" sx={{ mt: SPACING.xl / 8 }}>
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
            <Container maxWidth="lg" sx={{ mt: SPACING.xl / 8 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <CircularProgress size={60} thickness={4} />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: SPACING.lg / 8 }}>
            {/* Header */}
            <Fade in timeout={300}>
                <div>
                    <PageHeader
                        title="System Dashboard"
                        subtitle="Real-time monitoring and system statistics"
                        isConnected={isConnected}
                    />
                </div>
            </Fade>

            {/* Main Grid */}
            <Grid container spacing={SPACING.lg / 8}>
                {/* CPU Chart */}
                <Grid sx={{ xs: 12, md: 6 }}>
                    <Grow in timeout={400}>
                        <div>
                            <CpuChart data={cpuHistory} />
                        </div>
                    </Grow>
                </Grid>

                {/* RAM Chart */}
                <Grid sx={{ xs: 12, md: 6 }}>
                    <Grow in timeout={500}>
                        <div>
                            <RamChart
                                ramTotal={systemStats.ram_total}
                                ramUsed={systemStats.ram_used}
                                ramFree={systemStats.ram_free}
                            />
                        </div>
                    </Grow>
                </Grid>

                {/* System Uptime */}
                <Grid sx={{ xs: 12, md: 6 }}>
                    <Grow in timeout={600}>
                        <div>
                            <StatCard
                                icon={<AccessTime />}
                                title="System Uptime"
                                value={formatUptime(systemStats.uptime)}
                                subtitle="Running continuously without interruption"
                            />
                        </div>
                    </Grow>
                </Grid>

                {/* OS Information */}
                <Grid sx={{ xs: 12, md: 6 }}>
                    <Grow in timeout={700}>
                        <div>
                            <StatCard
                                icon={<Computer />}
                                title="Operating System"
                                value={systemStats.os_name}
                                subtitle={`Version ${systemStats.os_version}`}
                                footer={systemStats.os_pretty_name}
                            />
                        </div>
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
