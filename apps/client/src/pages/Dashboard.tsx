import { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    CircularProgress,
    Alert,
    Fade,
    Grow,
} from '@mui/material';
import {
    Computer as ComputerIcon,
    AccessTime as AccessTimeIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
} from '@mui/icons-material';
import { useSocket } from '../hooks/useSocket';
import { CpuChart } from '../components/CpuChart';
import { RamChart } from '../components/RamChart';

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
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Fade in timeout={500}>
                    <Alert
                        severity="warning"
                        icon={<CircularProgress size={20} />}
                        sx={{ borderRadius: 2 }}
                    >
                        Connecting to server...
                    </Alert>
                </Fade>
            </Container>
        );
    }

    if (!systemStats) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <CircularProgress size={60} thickness={4} />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Fade in timeout={300}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
                        System Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        Real-time monitoring and system statistics
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip
                            icon={isConnected ? <CheckCircleIcon /> : <ErrorIcon />}
                            label={isConnected ? 'Connected' : 'Disconnected'}
                            color={isConnected ? 'success' : 'error'}
                            size="small"
                            sx={{ fontWeight: 600 }}
                        />
                        {systemStats.error && (
                            <Chip
                                icon={<ErrorIcon />}
                                label="Error"
                                color="error"
                                size="small"
                                sx={{ fontWeight: 600 }}
                            />
                        )}
                    </Box>
                </Box>
            </Fade>

            {/* Main Grid */}
            <Grid container spacing={3}>
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
                        <Card elevation={2}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                                    <Typography variant="h6" fontWeight={600}>
                                        System Uptime
                                    </Typography>
                                </Box>
                                <Typography variant="h2" color="primary" fontWeight={700} gutterBottom>
                                    {formatUptime(systemStats.uptime)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                    Running continuously without interruption
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grow>
                </Grid>

                {/* OS Information */}
                <Grid sx={{ xs: 12, md: 6 }}>
                    <Grow in timeout={700}>
                        <Card elevation={2}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <ComputerIcon sx={{ mr: 1, color: 'primary.main' }} />
                                    <Typography variant="h6" fontWeight={600}>
                                        Operating System
                                    </Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={700} gutterBottom>
                                    {systemStats.os_name}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" fontWeight={500} gutterBottom>
                                    Version {systemStats.os_version}
                                </Typography>
                                <Box
                                    sx={{
                                        mt: 2,
                                        p: 1.5,
                                        bgcolor: 'action.hover',
                                        borderRadius: 1,
                                        border: 1,
                                        borderColor: 'divider',
                                    }}
                                >
                                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                        {systemStats.os_pretty_name}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grow>
                </Grid>
            </Grid>

            {/* Error Display */}
            {systemStats.error && (
                <Fade in timeout={500}>
                    <Box sx={{ mt: 3 }}>
                        <Alert severity="error" sx={{ borderRadius: 2 }}>
                            {systemStats.error}
                        </Alert>
                    </Box>
                </Fade>
            )}
        </Container>
    );
}
