import React, { useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import {
    Block as BlockIcon,
    Pause as PauseIcon,
    PlayArrow as PlayArrowIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import {
    ButtonComponent,
    SearchComponent,
    AppSnackbar,
    PageLoading,
    StatusBadgeComponent,
    UserBadgeComponent,
    DataTableComponent,
    StackRowComponent,
    StackRowJusBetweenComponent
} from '../../components';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { SPACING, TYPOGRAPHY } from '../../constants/design';
import { useProcesses, Process } from '../../hooks/use-processes';
import { ColumnConfig, ActionConfig } from '../../components/table/table.component';

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

    const columns = useMemo<ColumnConfig<Process>[]>(() => [
        { id: 'pid', label: 'PID', width: 80, sortable: true },
        {
            id: 'name', label: 'Tên tiến trình', sortable: true, render: (row) => (
                <Typography variant="body2" sx={{ fontWeight: TYPOGRAPHY.fontWeight.semibold }}>
                    {row.name}
                </Typography>
            )
        },
        { id: 'user', label: 'Người dùng', render: (row) => <UserBadgeComponent username={row.user} /> },
        { id: 'status', label: 'Trạng thái', render: (row) => <StatusBadgeComponent status={row.status} /> },
        {
            id: 'cpu', label: 'CPU %', align: 'right', sortable: true, render: (row) => (
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{row.cpu}%</Typography>
            )
        },
        {
            id: 'mem', label: 'Bộ nhớ', align: 'right', sortable: true, render: (row) => (
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{row.mem} MB</Typography>
            )
        },
    ], []);

    const actions = useMemo<ActionConfig<Process>[]>(() => [
        {
            id: 'suspend',
            icon: <PauseIcon fontSize="small" />,
            tooltip: 'Tạm dừng',
            color: 'warning',
            visible: (row) => row.status === 'running' || row.status === 'sleeping',
            onClick: (row) => onSuspend(row.pid),
        },
        {
            id: 'resume',
            icon: <PlayArrowIcon fontSize="small" />,
            tooltip: 'Tiếp tục',
            color: 'success',
            visible: (row) => row.status === 'stopped',
            onClick: (row) => onResume(row.pid),
        },
        {
            id: 'terminate',
            icon: <DeleteIcon fontSize="small" />,
            tooltip: 'Kết thúc (SIGTERM)',
            color: 'error',
            onClick: (row) => handleTerminateClick(row.pid),
        },
        {
            id: 'force-kill',
            icon: <BlockIcon fontSize="small" />,
            tooltip: 'Buộc dừng (SIGKILL)',
            color: 'error',
            onClick: (row) => handleForceKillClick(row.pid),
        },
    ], [selectedPids]);

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

            <DataTableComponent
                idField="pid"
                columns={columns}
                data={filteredProcesses}
                actions={actions}
                selectable
                selectedIds={selectedPids}
                onSelectionChange={(ids) => setSelectedPids(ids as number[])}
                initialOrderBy="cpu"
                initialOrder="desc"
                emptyMessage="Không tìm thấy tiến trình nào"
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
                    Tự động cập nhật sau mỗi 5 giây
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

