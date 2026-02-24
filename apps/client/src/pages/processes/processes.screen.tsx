import React, { useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { Block as BlockIcon, Pause as PauseIcon, PlayArrow as PlayArrowIcon } from '@mui/icons-material';
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
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        pid?: number;
        pids?: number[];
        type?: 'terminate' | 'force'
    }>({
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

    const selectedProcesses = useMemo(() => {
        return clientProcesses.filter(p => selectedPids.includes(p.pid));
    }, [clientProcesses, selectedPids]);

    const canSuspend = selectedPids.length > 0 && selectedProcesses.some(p => p.status === 'running' || p.status === 'sleeping');
    const canResume = selectedPids.length > 0 && selectedProcesses.some(p => p.status === 'stopped');
    const canKill = selectedPids.length > 0;

    const handleTerminateClick = (pid?: number) => {
        setConfirmDialog({ open: true, pid, pids: pid ? undefined : selectedPids, type: 'terminate' });
    };

    const handleForceKillClick = (pid?: number) => {
        setConfirmDialog({ open: true, pid, pids: pid ? undefined : selectedPids, type: 'force' });
    };

    const handleKillConfirm = async () => {
        const pidsToKill = confirmDialog.pid
            ? [confirmDialog.pid]
            : (confirmDialog.pids || selectedPids);
        if (pidsToKill.length === 0) return;

        const isForce = confirmDialog.type === 'force';
        const urlSuffix = isForce ? '/force' : '';
        const actionLabel = isForce ? 'Buộc dừng' : 'Kết thúc';

        setConfirmDialog({ open: false });

        try {
            await Promise.all(pidsToKill.map((p) => axios.delete(`/api/system/processes/${p}${urlSuffix}`)));
            showSnackbar(`Đã ${actionLabel.toLowerCase()} ${pidsToKill.length} tiến trình thành công`, 'success');
            setSelectedPids([]);
        } catch {
            showSnackbar(`Không thể ${actionLabel.toLowerCase()} một hoặc nhiều tiến trình`, 'error');
        }
    };

    const handleSuspend = async (singlePid?: number) => {
        const pidsToSuspend = singlePid
            ? [singlePid]
            : selectedProcesses
                .filter(p => p.status === 'running' || p.status === 'sleeping')
                .map(p => p.pid);

        if (pidsToSuspend.length === 0) return;

        try {
            await Promise.all(
                pidsToSuspend.map((pid) => axios.patch(`/api/system/processes/${pid}/suspend`)),
            );
            showSnackbar(`Đã tạm dừng ${pidsToSuspend.length} tiến trình thành công`, 'success');
            if (!singlePid) setSelectedPids([]);
        } catch {
            showSnackbar('Không thể tạm dừng một hoặc nhiều tiến trình', 'error');
        }
    };

    const handleResume = async (singlePid?: number) => {
        const pidsToResume = singlePid
            ? [singlePid]
            : selectedProcesses
                .filter(p => p.status === 'stopped')
                .map(p => p.pid);

        if (pidsToResume.length === 0) return;

        try {
            await Promise.all(
                pidsToResume.map((pid) => axios.patch(`/api/system/processes/${pid}/resume`)),
            );
            showSnackbar(`Đã tiếp tục ${pidsToResume.length} tiến trình thành công`, 'success');
            if (!singlePid) setSelectedPids([]);
        } catch {
            showSnackbar('Không thể tiếp tục một hoặc nhiều tiến trình', 'error');
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
                title="Quản lý tiến trình"
                subtitle="Giám sát và kiểm soát các tiến trình đang chạy trên hệ thống"
                isConnected={isConnected}
                actions={
                    <StackRowComponent spacing={SPACING.sm / 8}>
                        <ButtonComponent
                            variant="outlined"
                            startIcon={<BlockIcon />}
                            size="small"
                            color="error"
                            disabled={!canKill}
                            onClick={() => handleForceKillClick()}
                        >
                            Buộc dừng {selectedPids.length > 0 ? `(${selectedPids.length})` : ''}
                        </ButtonComponent>
                        <ButtonComponent
                            variant="outlined"
                            startIcon={<BlockIcon />}
                            size="small"
                            color="error"
                            disabled={!canKill}
                            onClick={() => handleTerminateClick()}
                        >
                            Kết thúc {selectedPids.length > 0 ? `(${selectedPids.length})` : ''}
                        </ButtonComponent>
                        <ButtonComponent
                            variant="outlined"
                            startIcon={<PauseIcon />}
                            size="small"
                            disabled={!canSuspend}
                            onClick={() => handleSuspend()}
                        >
                            Tạm dừng {selectedPids.length > 0 ? `(${selectedPids.length})` : ''}
                        </ButtonComponent>
                        <ButtonComponent
                            variant="outlined"
                            startIcon={<PlayArrowIcon />}
                            size="small"
                            color="success"
                            disabled={!canResume}
                            onClick={() => handleResume()}
                        >
                            Tiếp tục {selectedPids.length > 0 ? `(${selectedPids.length})` : ''}
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
                onTerminate={handleTerminateClick}
                onForceKill={handleForceKillClick}
                onSuspend={handleSuspend}
                onResume={handleResume}
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
                title={confirmDialog.type === 'force' ? "Xác nhận buộc dừng" : "Xác nhận kết thúc tiến trình"}
                message={
                    confirmDialog.pid
                        ? `Bạn có chắc chắn muốn ${confirmDialog.type === 'force' ? 'buộc dừng' : 'kết thúc'} tiến trình PID ${confirmDialog.pid}?`
                        : `Bạn có chắc chắn muốn ${confirmDialog.type === 'force' ? 'buộc dừng' : 'kết thúc'} ${confirmDialog.pids?.length || 0} tiến trình đã chọn?`
                }
                confirmText={confirmDialog.type === 'force' ? "Buộc dừng" : "Kết thúc"}
                cancelText="Hủy"
                onConfirm={handleKillConfirm}
                onCancel={() => setConfirmDialog({ open: false })}
                severity="error"
            />

            <AppSnackbar {...snackbarProps} />
        </Box>
    );
}
