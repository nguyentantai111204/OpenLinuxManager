import React, { useState, useMemo } from 'react';
import { Box, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { Block as BlockIcon, Pause as PauseIcon } from '@mui/icons-material';
import { ButtonComponent, SearchComponent } from '../../components';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { ProcessTable, Process } from './process-table.part';
import { useSocketContext } from '../../contexts/socket-context';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/design';
import { StackRowComponent, StackRowJusBetweenComponent, StackColAlignCenterJusCenterComponent } from '../../components/stack';
import { ProcessStatus } from '../../components/status-badge/status-badge.component';

export function Processes() {
    const { isConnected, processes } = useSocketContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPids, setSelectedPids] = useState<number[]>([]);
    const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; pid?: number; pids?: number[] }>({
        open: false,
    });

    const mapStatus = (status: string): ProcessStatus => {
        const s = status.toUpperCase().charAt(0);
        switch (s) {
            case 'R': return 'running';
            case 'S':
            case 'D':
            case 'I': return 'sleeping';
            case 'T': return 'stopped';
            case 'Z': return 'zombie';
            default: return 'sleeping';
        }
    };

    const clientProcesses: Process[] = useMemo(() => {
        return processes.map((p) => ({
            pid: p.pid,
            name: p.name,
            user: p.user,
            status: mapStatus(p.status),
            cpu: p.cpu,
            mem: parseFloat(p.memory.toFixed(1)),
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

    const handleKillClick = (pid?: number) => {
        setConfirmDialog({ open: true, pid, pids: pid ? undefined : selectedPids });
    };

    const handleKillConfirm = async () => {
        const pidsToKill = confirmDialog.pid ? [confirmDialog.pid] : (confirmDialog.pids || selectedPids);
        if (pidsToKill.length === 0) return;

        setConfirmDialog({ open: false });

        try {
            await Promise.all(pidsToKill.map(p => axios.delete(`/api/system/processes/${p}`)));
            setSnackbar({
                open: true,
                message: `Đã kết thúc ${pidsToKill.length} tiến trình thành công`,
                severity: 'success'
            });
            setSelectedPids([]);
        } catch (error) {
            console.error('Failed to kill processes', error);
            setSnackbar({ open: true, message: 'Không thể kết thúc một hoặc nhiều tiến trình', severity: 'error' });
        }
    };

    const handleSuspend = async () => {
        if (selectedPids.length === 0) return;

        try {
            await Promise.all(selectedPids.map(pid => axios.patch(`/api/system/processes/${pid}/suspend`)));
            setSnackbar({
                open: true,
                message: `Successfully suspended ${selectedPids.length} process(es)`,
                severity: 'success'
            });
            setSelectedPids([]);
        } catch (error) {
            console.error('Failed to suspend processes', error);
            setSnackbar({ open: true, message: 'Failed to suspend one or more processes', severity: 'error' });
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
                            disabled={selectedPids.length === 0}
                            onClick={() => handleKillClick()}
                        >
                            Kill {selectedPids.length > 0 ? `(${selectedPids.length})` : ''}
                        </ButtonComponent>
                        <ButtonComponent
                            variant="outlined"
                            startIcon={<PauseIcon />}
                            size="small"
                            disabled={selectedPids.length === 0}
                            onClick={handleSuspend}
                        >
                            Suspend {selectedPids.length > 0 ? `(${selectedPids.length})` : ''}
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
                onKill={handleKillClick}
                selectedPids={selectedPids}
                onSelectionChange={setSelectedPids}
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

            <ConfirmationDialogComponent
                open={confirmDialog.open}
                title="Xác nhận kết thúc tiến trình"
                message={
                    confirmDialog.pid
                        ? `Bạn có chắc chắn muốn kết thúc tiến trình PID ${confirmDialog.pid}?`
                        : `Bạn có chắc chắn muốn kết thúc ${confirmDialog.pids?.length || 0} tiến trình đã chọn?`
                }
                confirmText="Kết thúc"
                cancelText="Hủy"
                onConfirm={handleKillConfirm}
                onCancel={() => setConfirmDialog({ open: false })}
                severity="error"
            />
        </Box >
    );
}
