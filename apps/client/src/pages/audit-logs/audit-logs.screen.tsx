import { useEffect, useState } from 'react';
import { Box, Typography, Chip, CircularProgress, Alert } from '@mui/material';
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

    useEffect(() => {
        loadLogs();
        // Refresh logs every 30 seconds
        const interval = setInterval(loadLogs, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadLogs = async () => {
        try {
            const data = await AuditLogApi.getAll();
            setLogs(data);
            setError(null);
        } catch (err) {
            setError('Failed to load audit logs');
            console.error(err);
        } finally {
            setLoading(false);
        }
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
        if (action.includes('DELETE') || action.includes('KILL')) return 'error';
        if (action.includes('CREATE')) return 'success';
        if (action.includes('UPDATE')) return 'warning';
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
                    {loading && logs.length === 0 ? (
                        <StackColAlignCenterJusCenterComponent sx={{ p: 4 }}>
                            <CircularProgress />
                        </StackColAlignCenterJusCenterComponent>
                    ) : (
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
                                    {logs.map((log) => (
                                        <TableRowComponent key={log.id} hover>
                                            <TableCellComponent sx={{ whiteSpace: 'nowrap', width: 180 }}>
                                                {formatDate(log.timestamp)}
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
                                    {logs.length === 0 && (
                                        <TableRowComponent>
                                            <TableCellComponent colSpan={5} align="center" sx={{ py: 8 }}>
                                                <Typography color="text.secondary">
                                                    No audit logs found
                                                </Typography>
                                            </TableCellComponent>
                                        </TableRowComponent>
                                    )}
                                </TableBodyComponent>
                            </TableComponent>
                        </TableContainerComponent>
                    )}
                </CardComponent>
            </StackColComponent>
        </Box>
    );
}
