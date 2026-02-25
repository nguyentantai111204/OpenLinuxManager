import { useState } from 'react';
import { Box, Chip, Alert, TablePagination, alpha } from '@mui/material';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { TableContainerComponent, TableComponent, TableHeadComponent, TableRowComponent, TableCellComponent, TableBodyComponent, CardComponent, PageLoading, TableEmptyRow, StackColComponent } from '../../components';
import { SPACING, COLORS, TYPOGRAPHY } from '../../constants/design';
import { useAuditLogs } from '../../hooks/use-audit-logs';

export function AuditLogs() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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
                    <TableContainerComponent sx={{ flex: 1, overflow: 'auto' }}>
                        <TableComponent stickyHeader>
                            <TableHeadComponent>
                                <TableRowComponent>
                                    <TableCellComponent>Thời gian</TableCellComponent>
                                    <TableCellComponent>Hành động</TableCellComponent>
                                    <TableCellComponent>Đối tượng</TableCellComponent>
                                    <TableCellComponent>Chi tiết</TableCellComponent>
                                    <TableCellComponent>Người thực hiện</TableCellComponent>
                                </TableRowComponent>
                            </TableHeadComponent>
                            <TableBodyComponent>
                                {isLoading && logs.length === 0 ? (
                                    <TableRowComponent>
                                        <TableCellComponent colSpan={5} align="center" sx={{ py: 8 }}>
                                            <PageLoading message="Đang tải nhật ký..." minHeight="10vh" size={32} />
                                        </TableCellComponent>
                                    </TableRowComponent>
                                ) : (
                                    <>
                                        {logs.map((log) => (
                                            <TableRowComponent key={log.id}>
                                                <TableCellComponent sx={{ whiteSpace: 'nowrap', width: 180, fontSize: TYPOGRAPHY.fontSize.xs, color: 'text.secondary' }}>
                                                    {formatDate(log.createdAt)}
                                                </TableCellComponent>
                                                <TableCellComponent>
                                                    <Chip
                                                        label={log.action}
                                                        color={getActionColor(log.action)}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{
                                                            fontWeight: TYPOGRAPHY.fontWeight.bold,
                                                            fontSize: '10px',
                                                            height: 20
                                                        }}
                                                    />
                                                </TableCellComponent>
                                                <TableCellComponent sx={{ fontWeight: TYPOGRAPHY.fontWeight.medium, fontSize: TYPOGRAPHY.fontSize.sm }}>
                                                    {log.target}
                                                </TableCellComponent>
                                                <TableCellComponent sx={{
                                                    color: 'text.secondary',
                                                    fontSize: TYPOGRAPHY.fontSize.xs,
                                                    maxWidth: 300,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {log.details || '-'}
                                                </TableCellComponent>
                                                <TableCellComponent>
                                                    <Chip
                                                        label={log.performedBy}
                                                        size="small"
                                                        sx={(theme) => ({
                                                            height: 20,
                                                            fontSize: '0.75rem',
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                            color: theme.palette.text.primary,
                                                        })}
                                                    />
                                                </TableCellComponent>
                                            </TableRowComponent>
                                        ))}
                                        {logs.length === 0 && !isLoading && (
                                            <TableEmptyRow colSpan={5} message="Không có nhật ký nào" />
                                        )}
                                    </>
                                )}
                            </TableBodyComponent>
                        </TableComponent>
                    </TableContainerComponent>
                    <Box sx={{ borderTop: `1px solid ${COLORS.border.light}` }}>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50]}
                            component="div"
                            count={total}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={(_e, p) => setPage(p)}
                            onRowsPerPageChange={(e) => {
                                setRowsPerPage(parseInt(e.target.value, 10));
                                setPage(0);
                            }}
                        />
                    </Box>
                </CardComponent>
            </StackColComponent>
        </Box>
    );
}

