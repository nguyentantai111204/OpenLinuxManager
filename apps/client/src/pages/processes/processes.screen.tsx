import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Block as BlockIcon, Pause as PauseIcon, PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { ButtonComponent, SearchComponent, AppSnackbar, PageLoading } from '../../components';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { ProcessTable } from './process-table.part';
import { SPACING, TYPOGRAPHY } from '../../constants/design';
import { StackRowComponent, StackRowJusBetweenComponent } from '../../components/stack';
import { useProcesses } from '../../hooks/use-processes';

export function Processes() {
    const {
        isConnected,
        processes,
        filteredProcesses,
        searchQuery,
        setSearchQuery,
        selectedPids,
        setSelectedPids,
        selectedProcesses,
        handleKill,
        handleSuspend,
        handleResume,
        snackbarProps
    } = useProcesses();

    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        pid?: number;
        pids?: number[];
        type?: 'terminate' | 'force'
    }>({
        open: false,
    });

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

        const success = await handleKill(pidsToKill, confirmDialog.type === 'force');
        if (success) {
            setConfirmDialog({ open: false });
        }
    };

    const onSuspend = (pid?: number) => handleSuspend(pid ? [pid] : selectedPids);
    const onResume = (pid?: number) => handleResume(pid ? [pid] : selectedPids);

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
                            onClick={() => onSuspend()}
                        >
                            Tạm dừng {selectedPids.length > 0 ? `(${selectedPids.length})` : ''}
                        </ButtonComponent>
                        <ButtonComponent
                            variant="outlined"
                            startIcon={<PlayArrowIcon />}
                            size="small"
                            color="success"
                            disabled={!canResume}
                            onClick={() => onResume()}
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
                onSuspend={onSuspend}
                onResume={onResume}
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

