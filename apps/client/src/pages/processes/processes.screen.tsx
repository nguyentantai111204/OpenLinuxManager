import { useState, useMemo } from 'react';
import { Box, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { Block as BlockIcon, Pause as PauseIcon } from '@mui/icons-material';
import { ButtonComponent, SearchComponent } from '../../components';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { ProcessTable, Process } from './process-table.part';
import { useSocket } from '../../hooks/use-socket';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/design';
import { StackRowComponent, StackRowJusBetweenComponent, StackColAlignCenterJusCenterComponent } from '../../components/stack';
import { ProcessStatus } from '../../components/status-badge/status-badge.component';

export function Processes() {
    const { isConnected, processes } = useSocket();
    const [searchQuery, setSearchQuery] = useState('');

    const mapStatus = (status: string): ProcessStatus => {
        const s = status.toLowerCase();
        if (['running', 'idle'].includes(s)) return 'running';
        if (['sleeping', 'waiting', 'blocked', 'paging', 'unknown'].includes(s)) return 'sleeping';
        if (['stopped', 'dead'].includes(s)) return 'stopped';
        if (s === 'zombie') return 'zombie';
        return 'sleeping';
    };

    const clientProcesses: Process[] = useMemo(() => {
        return processes.map((p) => ({
            pid: p.pid,
            name: p.name,
            user: p.user,
            status: mapStatus(p.status),
            cpu: p.cpu,
            mem: p.memory,
        }));
    }, [processes]);

    const filteredProcesses = useMemo(() => {
        if (!searchQuery.trim()) {
            return clientProcesses;
        }

        const query = searchQuery.toLowerCase();
        return clientProcesses.filter(
            (process) =>
                process.pid.toString().includes(query) ||
                process.name.toLowerCase().includes(query) ||
                process.user.toLowerCase().includes(query)
        );
    }, [clientProcesses, searchQuery]);

    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleKill = async (pid: number) => {
        try {
            await axios.delete(`/api/system/processes/${pid}`);
            setSnackbar({ open: true, message: `Killed process ${pid}`, severity: 'success' });
        } catch (error) {
            console.error('Failed to kill process', error);
            setSnackbar({ open: true, message: `Failed to kill process ${pid}`, severity: 'error' });
        }
    };

    if (!isConnected && processes.length === 0) {
        return (
            <Box sx={{ p: SPACING.lg / 8 }}>
                <StackColAlignCenterJusCenterComponent sx={{ minHeight: '50vh' }}>
                    <CircularProgress color="primary" />
                    <Typography
                        variant="body2"
                        sx={{
                            mt: SPACING.md / 8,
                            color: 'text.secondary',
                            fontWeight: TYPOGRAPHY.fontWeight.medium,
                        }}
                    >
                        Connecting to server...
                    </Typography>
                </StackColAlignCenterJusCenterComponent>
            </Box>
        );
    }

    return (
        <Box sx={{ p: SPACING.lg / 8 }}>
            <PageHeaderComponent
                title="Task Manager"
                subtitle="Monitor and manage system processes"
                isConnected={isConnected}
                actions={
                    <StackRowComponent spacing={SPACING.sm / 8}>
                        <ButtonComponent
                            variant="outlined"
                            startIcon={<BlockIcon />}
                            size="small"
                            color="error"
                        >
                            Kill
                        </ButtonComponent>
                        <ButtonComponent
                            variant="outlined"
                            startIcon={<PauseIcon />}
                            size="small"
                        >
                            Suspend
                        </ButtonComponent>
                    </StackRowComponent>
                }
            />

            <Box sx={{ mb: SPACING.lg / 8 }}>
                <SearchComponent
                    placeholder="Filter by name, user, or PID..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    sx={{ maxWidth: 400 }}
                />
            </Box>

            <ProcessTable
                processes={filteredProcesses}
                onKill={handleKill}
            />

            <StackRowJusBetweenComponent sx={{ mt: SPACING.md / 8 }}>
                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        fontWeight: TYPOGRAPHY.fontWeight.medium,
                    }}
                >
                    Total Processes: {processes.length}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        fontWeight: TYPOGRAPHY.fontWeight.medium,
                    }}
                >
                    Sorted by: CPU Usage (Desc)
                </Typography>
            </StackRowJusBetweenComponent>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{
                        width: '100%',
                        borderRadius: BORDER_RADIUS.md,
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box >
    );
}
