import { useState, useEffect } from 'react';
import { Box, Fade, Grow, CircularProgress, Alert } from '@mui/material';
import { DeveloperBoard, Memory, Storage, Timer } from '@mui/icons-material';
import { useSocket } from '../hooks/use-socket';
import { CpuChart } from '../components/cpu-chart';
import { RamChart } from '../components/ram-chart';
import { PageHeader } from '../components/common/page-header';
import { SPACING, COLORS } from '../constants/design';
import { StatCard } from '../components/dashboard/stat-card';
import { StackCol, StackRow, StackColAlignCenterJusCenter } from '../components/stack';

interface CpuDataPoint {
    time: string;
    cpu: number;
}

export function Dashboard() {
    const { systemStats, isConnected } = useSocket();
    const [cpuHistory, setCpuHistory] = useState<CpuDataPoint[]>([]);

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
                return newHistory.slice(-30);
            });
        }
    }, [systemStats]);

    const formatUptime = (seconds: number): string => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);

        if (days > 0) return `${days}d ${hours}h`;
        return `${hours}h`;
    };

    if (!isConnected) {
        return (
            <Box sx={{ p: SPACING.xl / 8 }}>
                <Fade in timeout={500}>
                    <Alert
                        severity="warning"
                        icon={<CircularProgress size={20} />}
                        sx={{ borderRadius: SPACING.md / 8 }}
                    >
                        Connecting to server...
                    </Alert>
                </Fade>
            </Box>
        );
    }

    if (!systemStats) {
        return (
            <Box sx={{ p: SPACING.xl / 8 }}>
                <StackColAlignCenterJusCenter sx={{ minHeight: '50vh' }}>
                    <CircularProgress size={60} thickness={4} />
                </StackColAlignCenterJusCenter>
            </Box>
        );
    }

    const currentCpu = cpuHistory.length > 0 ? cpuHistory[cpuHistory.length - 1].cpu : systemStats.cpu;
    const ramUsageGB = (systemStats.ram_used / 1024 / 1024 / 1024).toFixed(1);
    const ramTotalGB = (systemStats.ram_total / 1024 / 1024 / 1024).toFixed(1);

    return (
        <Box sx={{ p: SPACING.lg / 8, height: '100%', overflow: 'hidden' }}>
            <StackCol spacing={SPACING.xl / 8} sx={{ height: '100%' }}>
                <Fade in timeout={300}>
                    <Box>
                        <PageHeader
                            title="System Dashboard"
                            subtitle="Real-time monitoring and system statistics"
                            isConnected={isConnected}
                        />
                    </Box>
                </Fade>

                {/* Stats Overview Row */}
                <StackRow spacing={SPACING.md / 8}>
                    <Box sx={{ flex: 1 }}>
                        <Grow in timeout={300}>
                            <Box>
                                <StatCard
                                    icon={<DeveloperBoard />}
                                    title="CPU Usage"
                                    value={`${currentCpu.toFixed(1)}%`}
                                    change="+2.4%"
                                    changeType="positive"
                                    subtitle="12 Cores Active"
                                    iconColor={COLORS.chart.cpu}
                                    iconBgColor={COLORS.background.elevated}
                                />
                            </Box>
                        </Grow>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Grow in timeout={400}>
                            <Box>
                                <StatCard
                                    icon={<Memory />}
                                    title="Memory"
                                    value={`${ramUsageGB} GB`}
                                    change="-0.5%"
                                    changeType="negative"
                                    subtitle={`of ${ramTotalGB} GB Total`}
                                    iconColor={COLORS.chart.ram}
                                    iconBgColor={COLORS.background.elevated}
                                />
                            </Box>
                        </Grow>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Grow in timeout={500}>
                            <Box>
                                <StatCard
                                    icon={<Storage />}
                                    title="Disk Space"
                                    value="64%"
                                    change="+0.1%"
                                    changeType="positive"
                                    subtitle="120GB Free"
                                    iconColor={COLORS.chart.disk}
                                    iconBgColor={COLORS.background.elevated}
                                />
                            </Box>
                        </Grow>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Grow in timeout={600}>
                            <Box>
                                <StatCard
                                    icon={<Timer />}
                                    title="Uptime"
                                    value={formatUptime(systemStats.uptime)}
                                    change="0%"
                                    changeType="neutral"
                                    subtitle="Since last boot"
                                    iconColor={COLORS.status.running}
                                    iconBgColor={COLORS.background.elevated}
                                />
                            </Box>
                        </Grow>
                    </Box>
                </StackRow>

                <StackRow spacing={SPACING.lg / 8} sx={{ flex: 1 }}>
                    <Box sx={{ flex: 2 }}>
                        <Grow in timeout={700}>
                            <Box sx={{ height: '100%' }}>
                                <CpuChart data={cpuHistory} />
                            </Box>
                        </Grow>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Grow in timeout={800}>
                            <Box sx={{ height: '100%' }}>
                                <RamChart
                                    ramTotal={systemStats.ram_total}
                                    ramUsed={systemStats.ram_used}
                                    ramFree={systemStats.ram_free}
                                />
                            </Box>
                        </Grow>
                    </Box>
                </StackRow>

                {systemStats.error && (
                    <Fade in timeout={500}>
                        <Box>
                            <Alert severity="error" sx={{ borderRadius: SPACING.md / 8 }}>
                                {systemStats.error}
                            </Alert>
                        </Box>
                    </Fade>
                )}
            </StackCol>
        </Box>
    );
}
