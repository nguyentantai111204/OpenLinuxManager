import { useState, useMemo } from 'react';
import { Box, Button, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { Block as BlockIcon, Pause as PauseIcon } from '@mui/icons-material';
import { PageHeader } from '../../../components/common/page-header';
import { SearchBar } from '../../../components/common/search-bar';
import { ProcessTable, Process } from '../components/processes/process-table';
import { useSocket, SystemProcess } from '../../../hooks/use-socket';
import { SPACING } from '../../../constants/design';
import { StackRow, StackRowJusBetween, StackColAlignCenterJusCenter } from '../../../components/common/stack';
import { ProcessStatus } from '../../../components/common/status-badge';

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
            memory: p.memory,
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
            // Optimistic update or wait for socket? Socket might be slow to update list?
            // Let's just fire API call
            await axios.delete(`/api/system/processes/${pid}`);
            setSnackbar({ open: true, message: `Killed process ${pid}`, severity: 'success' });
            // Socket should update the list automatically
        } catch (error) {
            console.error('Failed to kill process', error);
            setSnackbar({ open: true, message: `Failed to kill process ${pid}`, severity: 'error' });
        }
    };

    const handleSuspend = (pid: number) => {
        console.log('Suspend process:', pid);
        // Implement suspend logic via socket/API later
    };

    if (!isConnected && processes.length === 0) {
        return (
            <Box sx={{ p: SPACING.lg / 8 }}>
                <StackColAlignCenterJusCenter sx={{ minHeight: '50vh' }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                        Connecting to server...
                    </Typography>
                </StackColAlignCenterJusCenter>
            </Box>
        );
    }

    return (
        <Box sx={{ p: SPACING.lg / 8 }}>
            <PageHeader
                title="Task Manager"
                isConnected={isConnected}
                actions={
                    <StackRow spacing={SPACING.sm / 8}>
                        <Button
                            variant="outlined"
                            startIcon={<BlockIcon />}
                            size="small"
                            sx={{ textTransform: 'none' }}
                        >
                            Kill
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<PauseIcon />}
                            size="small"
                            sx={{ textTransform: 'none' }}
                        >
                            Suspend
                        </Button>
                    </StackRow>
                }
            />

            <Box sx={{ mb: SPACING.lg / 8 }}>
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </Box>

            <ProcessTable
                processes={filteredProcesses}
                onKill={handleKill}
                onSuspend={handleSuspend}
            />

            <StackRowJusBetween sx={{ mt: SPACING.md / 8 }}>
                <Typography variant="body2" color="text.secondary">
                    Total Processes: {processes.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Sorted by: CPU Usage (Desc)
                </Typography>
            </StackRowJusBetween>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box >
    );
}
