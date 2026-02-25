import { useState, useMemo } from 'react';
import { Box, Chip, Alert, alpha, Typography } from '@mui/material';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import {
    CardComponent,
    StackColComponent,
    DataTableComponent
} from '../../components';
import { SPACING, COLORS, TYPOGRAPHY } from '../../constants/design';
import { useAuditLogs } from '../../hooks/use-audit-logs';
import { useSettings } from '../../contexts/settings.context';
import { AuditLog } from '../../apis/audit-log/audit-log.interface';
import { ColumnConfig } from '../../components/table/table.component';

export function AuditLogs() {
    const { settings } = useSettings();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(parseInt(settings.logHistorySize) || 10);

    const { logs, total, isLoading, error } = useAuditLogs(page + 1, rowsPerPage);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

    const getActionColor = (action: string): 'error' | 'success' | 'warning' | 'default' => {
        const a = action.toUpperCase();
        if (a.includes('DELETE') || a.includes('KILL')) return 'error';
        if (a.includes('CREATE')) return 'success';
        if (a.includes('UPDATE')) return 'warning';
        return 'default';
    };

    const columns = useMemo<ColumnConfig<AuditLog>[]>(() => [
        {
            id: 'createdAt',
            label: 'Thời gian',
            width: 180,
            render: (row) => (
                <Typography variant="body2" sx={{ whiteSpace: 'nowrap', fontSize: TYPOGRAPHY.fontSize.xs, color: 'text.secondary' }}>
                    {formatDate(row.createdAt)}
                </Typography>
            )
        },
        {
            id: 'action',
            label: 'Hành động',
            width: 120,
            render: (row) => (
                <Chip
                    label={row.action}
                    color={getActionColor(row.action)}
                    size="small"
                    variant="outlined"
                    sx={{
                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                        fontSize: '10px',
                        height: 20
                    }}
                />
            )
        },
        {
            id: 'target',
            label: 'Đối tượng',
            render: (row) => (
                <Typography variant="body2" sx={{ fontWeight: TYPOGRAPHY.fontWeight.medium, fontSize: TYPOGRAPHY.fontSize.sm }}>
                    {row.target}
                </Typography>
            )
        },
        {
            id: 'details',
            label: 'Chi tiết',
            render: (row) => (
                <Typography sx={{
                    color: 'text.secondary',
                    fontSize: TYPOGRAPHY.fontSize.xs,
                    maxWidth: 300,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {row.details || '-'}
                </Typography>
            )
        },
        {
            id: 'performedBy',
            label: 'Người thực hiện',
            width: 150,
            render: (row) => (
                <Chip
                    label={row.performedBy}
                    size="small"
                    sx={(theme) => ({
                        height: 20,
                        fontSize: '0.75rem',
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.text.primary,
                    })}
                />
            )
        },
    ], []);

    const paginationConfig = {
        page,
        rowsPerPage,
        total,
        onPageChange: (p: number) => setPage(p),
        onRowsPerPageChange: (r: number) => {
            setRowsPerPage(r);
            setPage(0);
        }
    };

    return (
        <Box sx={{ p: SPACING.lg / 8, height: '100%', overflow: 'hidden' }}>
            <StackColComponent spacing={SPACING.lg / 8} sx={{ height: '100%' }}>
                <PageHeaderComponent
                    title="Nhật ký hệ thống"
                    subtitle="Lịch sử các hoạt động và sự kiện bảo mật"
                />

                {error && (
                    <Alert severity="error">Không thể tải nhật ký hệ thống</Alert>
                )}

                <CardComponent sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <DataTableComponent
                        idField="id"
                        columns={columns}
                        data={logs}
                        isLoading={isLoading}
                        pagination={paginationConfig}
                        emptyMessage="Không có nhật ký nào"
                        maxHeight="100%"
                    />
                </CardComponent>
            </StackColComponent>
        </Box>
    );
}


