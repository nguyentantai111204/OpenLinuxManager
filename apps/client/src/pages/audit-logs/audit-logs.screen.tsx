import { useEffect, useState } from 'react';
import { Box, Typography, Chip, CircularProgress, Alert, TablePagination } from '@mui/material';
import { PageHeaderComponent } from '../../components';
import { TableContainerComponent, TableComponent, TableHeadComponent, TableRowComponent, TableCellComponent, TableBodyComponent, CardComponent } from '../../components';
import { AuditLogApi } from '../../apis/audit-log/audit-log.api';
import { SPACING, COLORS } from '../../constants/design';
import { StackColComponent, StackColAlignCenterJusCenterComponent } from '../../components/stack';
import { AuditLog } from '../../apis/audit-log/audit-log.interface';

export function AuditLogs() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    const loadLogs = async (currentPage: number, currentLimit: number) => {
        setLoading(true);
        try {
            const result = await AuditLogApi.getAll(currentPage + 1, currentLimit);

            // Defensive checks for both paginated and legacy array responses
            if (result && 'data' in result && Array.isArray(result.data)) {
                setLogs(result.data);
                setTotal(result.meta?.total || result.data.length);
            } else if (Array.isArray(result)) {
                setLogs(result);
                setTotal(result.length);
            } else {
                setLogs([]);
                setTotal(0);
            }
            setError(null);
        } catch (err) {
            setLogs([]);
            setError('Failed to load audit logs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLogs(page, rowsPerPage);
    }, [page, rowsPerPage]);

    // Cleanup interval if needed, but for now manual refresh/pagination is better for UX
    /*
    useEffect(() => {
        const interval = setInterval(() => loadLogs(page, rowsPerPage), 30000);
        return () => clearInterval(interval);
    }, [page, rowsPerPage]);
    */

    const handleChangePage = (event: unknown, 控制: number) => {
        setPage(控制);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const getActionColor = (action: string) => {
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
                    title="System Audit Logs"
                    subtitle="History of system actions and security events"
                />

                {error && (
                    <Alert severity="error" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <CardComponent sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <TableContainerComponent sx={{ flex: 1, overflow: 'auto' }}>
                        <TableComponent stickyHeader>
                            <TableHeadComponent>
                                <TableRowComponent>
                                    <TableCellComponent>Time</TableCellComponent>
                                    <TableCellComponent>Action</TableCellComponent>
                                    <TableCellComponent>Target</TableCellComponent>
                                    <TableCellComponent>Details</TableCellComponent>
                                    <TableCellComponent>User</TableCellComponent>
                                </TableRowComponent>
                            </TableHeadComponent>
                            <TableBodyComponent>
                                {loading && logs.length === 0 ? (
                                    <TableRowComponent>
                                        <TableCellComponent colSpan={5} align="center" sx={{ py: 8 }}>
                                            <CircularProgress />
                                        </TableCellComponent>
                                    </TableRowComponent>
                                ) : (
                                    <>
                                        {Array.isArray(logs) && logs.map((log) => (
                                            <TableRowComponent key={log.id}>
                                                <TableCellComponent sx={{ whiteSpace: 'nowrap', width: 180 }}>
                                                    {formatDate(log.createdAt)}
                                                </TableCellComponent>
                                                <TableCellComponent>
                                                    <Chip
                                                        label={log.action}
                                                        color={getActionColor(log.action)}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ fontWeight: 'bold' }}
                                                    />
                                                </TableCellComponent>
                                                <TableCellComponent sx={{ fontWeight: 'medium' }}>
                                                    {log.target}
                                                </TableCellComponent>
                                                <TableCellComponent sx={{ color: 'text.secondary' }}>
                                                    {log.details || '-'}
                                                </TableCellComponent>
                                                <TableCellComponent>
                                                    <Chip
                                                        label={log.performedBy}
                                                        size="small"
                                                        sx={{
                                                            height: 20,
                                                            fontSize: '0.75rem',
                                                            backgroundColor: COLORS.background.default
                                                        }}
                                                    />
                                                </TableCellComponent>
                                            </TableRowComponent>
                                        ))}
                                        {logs.length === 0 && !loading && (
                                            <TableRowComponent>
                                                <TableCellComponent colSpan={5} align="center" sx={{ py: 8 }}>
                                                    <Typography color="text.secondary">
                                                        No audit logs found
                                                    </Typography>
                                                </TableCellComponent>
                                            </TableRowComponent>
                                        )}
                                    </>
                                )}
                            </TableBodyComponent>
                        </TableComponent>
                    </TableContainerComponent>
                    <Box sx={{ borderTop: `1px solid ${COLORS.border.light}` }}>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            component="div"
                            count={total}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Box>
                </CardComponent>
            </StackColComponent>
        </Box>
    );
}
