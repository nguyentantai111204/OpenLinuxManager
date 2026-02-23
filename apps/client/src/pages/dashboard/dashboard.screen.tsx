import { useState, useEffect } from 'react';
import { Box, Fade, Grow, CircularProgress, Alert } from '@mui/material';
import { DeveloperBoard, Memory, Storage, Timer } from '@mui/icons-material';
import { useSocketContext } from '../../contexts/socket-context';
import { CpuChart } from './cpu-chart.part';
import { RamChart } from './ram-chart.part';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { SPACING, COLORS, BORDER_RADIUS } from '../../constants/design';
import { StatCard } from './stat-card.part';
import { StackColComponent, StackRowComponent, StackColAlignCenterJusCenterComponent } from '../../components/stack';

interface SystemHistoryPoint {
    time: string;
    cpu: number;
    ram: number;
}

export function Dashboard() {
    const { systemStats, isConnected, storage } = useSocketContext();
    const [history, setHistory] = useState<SystemHistoryPoint[]>([]);

    useEffect(() => {
        if (systemStats) {
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
                .getMinutes()
                .toString()
                .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

            setHistory((prev) => {
                const newPoint = {
                    time: timeStr,
                    cpu: systemStats.cpu,
                    ram: (systemStats.ram_used / systemStats.ram_total) * 100
                };
                const newHistory = [...prev, newPoint];
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
                <Fade in timeout={300}>
                    <Alert
                        severity="warning"
                        icon={<CircularProgress size={20} />}
                        sx={{ borderRadius: BORDER_RADIUS.lg }}
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
                <StackColAlignCenterJusCenterComponent sx={{ minHeight: '50vh' }}>
                    <CircularProgress size={60} thickness={4} color="primary" />
                </StackColAlignCenterJusCenterComponent>
            </Box>
        );
    }

    const currentCpu = history.length > 0 ? history[history.length - 1].cpu : systemStats.cpu;
    const ramUsageGB = (systemStats.ram_used / 1024 / 1024 / 1024).toFixed(1);
    const ramTotalGB = (systemStats.ram_total / 1024 / 1024 / 1024).toFixed(1);

    const prevCpu = history.length > 1 ? history[history.length - 2].cpu : currentCpu;
    const cpuDiff = currentCpu - prevCpu;

    const ramPercent = (systemStats.ram_used / systemStats.ram_total) * 100;
    const prevRamPercent = history.length > 1 ? history[history.length - 2].ram : ramPercent;
    const ramDiff = ramPercent - prevRamPercent;

    return (
        <Box sx={{ p: SPACING.lg / 8, height: '100%', overflow: 'hidden' }}>
            <StackColComponent spacing={SPACING.xl / 8} sx={{ height: '100%' }}>
                <Fade in timeout={300}>
                    <Box>
                        <PageHeaderComponent
                            title="System Dashboard"
                            subtitle="Giám sát thời gian thực và thống kê hệ thống"
                            isConnected={isConnected}
                        />
                    </Box>
                </Fade>

                {/* Stats Overview Row */}
                <StackRowComponent spacing={SPACING.md / 8}>
                    <Box sx={{ flex: 1 }}>
                        <Grow in timeout={300}>
                            <Box>
                                <StatCard
                                    icon={<DeveloperBoard />}
                                    title="CPU"
                                    value={`${currentCpu.toFixed(1)}%`}
                                    change={`${cpuDiff >= 0 ? '+' : ''}${cpuDiff.toFixed(1)}%`}
                                    changeType={cpuDiff > 0 ? 'positive' : cpuDiff < 0 ? 'negative' : 'neutral'}
                                    subtitle="Tải hiện tại"
                                    iconColor={COLORS.chart.cpu}
                                />
                            </Box>
                        </Grow>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Grow in timeout={400}>
                            <Box>
                                <StatCard
                                    icon={<Memory />}
                                    title="Bộ nhớ"
                                    value={`${ramUsageGB} GB`}
                                    change={`${ramDiff >= 0 ? '+' : ''}${ramDiff.toFixed(1)}%`}
                                    changeType={ramDiff > 0 ? 'positive' : ramDiff < 0 ? 'negative' : 'neutral'}
                                    subtitle={`trên ${ramTotalGB} GB`}
                                    iconColor={COLORS.chart.ram}
                                />
                            </Box>
                        </Grow>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Grow in timeout={500}>
                            <Box>
                                <StatCard
                                    icon={<Storage />}
                                    title="Đĩa cứng"
                                    value={storage ? `${Math.round((storage.used / storage.total) * 100)}%` : '...'}
                                    change={storage ? `${storage.free} GB` : '...'}
                                    changeType="neutral"
                                    subtitle="Không gian trống"
                                    iconColor={COLORS.chart.disk}
                                />
                            </Box>
                        </Grow>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Grow in timeout={600}>
                            <Box>
                                <StatCard
                                    icon={<Timer />}
                                    title="Thời gian hoạt động"
                                    value={formatUptime(systemStats.uptime)}
                                    subtitle="Kể từ lần khởi động"
                                    iconColor={COLORS.status.running}
                                />
                            </Box>
                        </Grow>
                    </Box>
                </StackRowComponent>

                <StackRowComponent spacing={SPACING.lg / 8} sx={{ flex: 1, minHeight: 0 }}>
                    <Box sx={{ flex: 2, height: '100%' }}>
                        <Grow in timeout={700}>
                            <Box sx={{ height: '100%' }}>
                                <CpuChart data={history} />
                            </Box>
                        </Grow>
                    </Box>

                    <Box sx={{ flex: 1, height: '100%' }}>
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
                </StackRowComponent>

                {systemStats.error && (
                    <Fade in timeout={500}>
                        <Box>
                            <Alert severity="error" sx={{ borderRadius: BORDER_RADIUS.lg }}>
                                {systemStats.error}
                            </Alert>
                        </Box>
                    </Fade>
                )}
            </StackColComponent>
        </Box>
    );
}
