import { useState, useMemo } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { Block as BlockIcon, Pause as PauseIcon } from '@mui/icons-material';
import { PageHeader } from '../components/common/PageHeader';
import { SearchBar } from '../components/common/SearchBar';
import { ProcessTable, Process } from '../components/processes/ProcessTable';
import { useSocket, SystemProcess } from '../hooks/useSocket';
import { SPACING } from '../constants/design';
import { StackRow, StackRowJusBetween, StackColAlignCenterJusCenter } from '../components/stack';
import { ProcessStatus } from '../components/common/StatusBadge';

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

    const handleKill = (pid: number) => {
        console.log('Kill process:', pid);
        // Implement kill logic via socket/API later
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
        </Box>
    );
}
