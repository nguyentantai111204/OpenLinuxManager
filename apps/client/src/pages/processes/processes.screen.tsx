import React, { useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { Block as BlockIcon, Pause as PauseIcon } from '@mui/icons-material';
import { ButtonComponent, SearchComponent, AppSnackbar, PageLoading } from '../../components';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { ProcessTable, Process } from './process-table.part';
import { useSocketContext } from '../../contexts/socket-context';
import { SPACING, TYPOGRAPHY } from '../../constants/design';
import { StackRowComponent, StackRowJusBetweenComponent } from '../../components/stack';
import { mapProcessStatus } from '../../utils/process.utils';
import { useSnackbar } from '../../hooks/use-snackbar';

export function Processes() {
    const { isConnected, processes } = useSocketContext();
    const { snackbarProps, showSnackbar } = useSnackbar();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPids, setSelectedPids] = useState<number[]>([]);
    const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; pid?: number; pids?: number[] }>({
        open: false,
    });

    const clientProcesses: Process[] = useMemo(() => {
        return processes.map((p) => ({
            pid: p.pid,
            name: p.name,
            user: p.user,
            status: mapProcessStatus(p.status),
            cpu: p.cpu,
            mem: parseFloat(p.memory.toFixed(1)),
        }));
    }, [processes]);

    const filteredProcesses = useMemo(() => {
        if (!searchQuery.trim()) return clientProcesses;
        const query = searchQuery.toLowerCase();
        return clientProcesses.filter(
            (p) =>
                p.pid.toString().includes(query) ||
                p.name.toLowerCase().includes(query) ||
                p.user.toLowerCase().includes(query),
        );
    }, [clientProcesses, searchQuery]);

    const handleKillClick = (pid?: number) => {
        setConfirmDialog({ open: true, pid, pids: pid ? undefined : selectedPids });
    };

    const handleKillConfirm = async () => {
        const pidsToKill = confirmDialog.pid
            ? [confirmDialog.pid]
            : (confirmDialog.pids || selectedPids);
        if (pidsToKill.length === 0) return;
        setConfirmDialog({ open: false });

        try {
            await Promise.all(pidsToKill.map((p) => axios.delete(`/api/system/processes/${p}`)));
            showSnackbar(`Đã kết thúc ${pidsToKill.length} tiến trình thành công`, 'success');
            setSelectedPids([]);
        } catch {
            showSnackbar('Không thể kết thúc một hoặc nhiều tiến trình', 'error');
        }
    };

    const handleSuspend = async () => {
        if (selectedPids.length === 0) return;
        try {
            await Promise.all(
                selectedPids.map((pid) => axios.patch(`/api/system/processes/${pid}/suspend`)),
            );
            showSnackbar(`Đã tạm dừng ${selectedPids.length} tiến trình thành công`, 'success');
            setSelectedPids([]);
        } catch {
            showSnackbar('Không thể tạm dừng một hoặc nhiều tiến trình', 'error');
        }
    };

    if (!isConnected && processes.length === 0) {
        return (
            <Box sx={{ p: SPACING.lg / 8 }}>
                <PageLoading message="Đang kết nối đến server..." />
            </Box>
        );
    }

    return (
        <Box sx={{ p: SPACING.lg / 8 }}>
            <PageHeaderComponent
                title="Task Manager"
                subtitle="Giám sát và quản lý tiến trình hệ thống"
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
                            Kết thúc {selectedPids.length > 0 ? `(${selectedPids.length})` : ''}
                        </ButtonComponent>
                        <ButtonComponent
                            variant="outlined"
                            startIcon={<PauseIcon />}
                            size="small"
                            disabled={selectedPids.length === 0}
                            onClick={handleSuspend}
                        >
                            Tạm dừng {selectedPids.length > 0 ? `(${selectedPids.length})` : ''}
                        </ButtonComponent>
                    </StackRowComponent>
                }
            />

            <Box sx={{ mb: SPACING.lg / 8 }}>
                <SearchComponent
                    placeholder="Lọc theo tên, người dùng hoặc PID..."
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
                    sx={{ color: 'text.secondary', fontWeight: TYPOGRAPHY.fontWeight.medium }}
                >
                    Tổng tiến trình: {processes.length}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', fontWeight: TYPOGRAPHY.fontWeight.medium }}
                >
                    Sắp xếp theo: CPU (Giảm dần)
                </Typography>
            </StackRowJusBetweenComponent>

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

            <AppSnackbar {...snackbarProps} />
        </Box>
    );
}
