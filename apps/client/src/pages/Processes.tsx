import { useState, useMemo } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Block as BlockIcon, Pause as PauseIcon } from '@mui/icons-material';
import { PageHeader } from '../components/common/PageHeader';
import { SearchBar } from '../components/common/SearchBar';
import { ProcessTable, Process } from '../components/processes/ProcessTable';
import { useSocket } from '../hooks/useSocket';
import { SPACING } from '../constants/design';
import { StackRow, StackRowJusBetween } from '../components/stack';

const mockProcesses: Process[] = [
    { pid: 1244, name: 'gnome-shell', user: 'root', status: 'running', cpu: 4.2, memory: 350 },
    { pid: 3421, name: 'chrome', user: 'user', status: 'running', cpu: 12.5, memory: 1024 },
    { pid: 4512, name: 'code', user: 'user', status: 'sleeping', cpu: 2.1, memory: 850 },
    { pid: 1102, name: 'systemd', user: 'root', status: 'running', cpu: 0.1, memory: 12 },
    { pid: 5611, name: 'node', user: 'user', status: 'running', cpu: 6.5, memory: 120 },
    { pid: 6621, name: 'docker', user: 'root', status: 'sleeping', cpu: 1.2, memory: 450 },
    { pid: 7712, name: 'spotify', user: 'user', status: 'running', cpu: 0.8, memory: 230 },
    { pid: 8891, name: 'discord', user: 'user', status: 'sleeping', cpu: 1.5, memory: 300 },
];

export function Processes() {
    const { isConnected } = useSocket();
    const [searchQuery, setSearchQuery] = useState('');
    const [processes] = useState<Process[]>(mockProcesses);

    const filteredProcesses = useMemo(() => {
        if (!searchQuery.trim()) {
            return processes;
        }

        const query = searchQuery.toLowerCase();
        return processes.filter(
            (process) =>
                process.pid.toString().includes(query) ||
                process.name.toLowerCase().includes(query) ||
                process.user.toLowerCase().includes(query)
        );
    }, [processes, searchQuery]);

    const handleKill = (pid: number) => {
        console.log('Kill process:', pid);
    };

    const handleSuspend = (pid: number) => {
        console.log('Suspend process:', pid);
    };

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
