import React from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, TableSortLabel, Box } from '@mui/material';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY, SHADOWS } from '../../../shared/constants/design';
import { ProcessStatus } from '../../../shared/components/common/status-badge';
import { ProcessRow } from './process-row';

export interface Process {
    pid: number;
    name: string;
    user: string;
    status: ProcessStatus;
    cpu: number;
    memory: number;
}

type SortField = 'pid' | 'name' | 'user' | 'status' | 'cpu' | 'memory' | 'actions';
type SortOrder = 'asc' | 'desc';

interface ProcessTableProps {
    processes: Process[];
    onKill?: (pid: number) => void;
    onSuspend?: (pid: number) => void;
}

export function ProcessTable({ processes, onKill, onSuspend }: ProcessTableProps) {
    const [orderBy, setOrderBy] = React.useState<SortField>('cpu');
    const [order, setOrder] = React.useState<SortOrder>('desc');

    const handleSort = (field: SortField) => {
        const isAsc = orderBy === field && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(field);
    };

    const sortedProcesses = React.useMemo(() => {
        return [...processes].sort((a, b) => {
            if (orderBy === 'actions') return 0;

            let aValue = a[orderBy];
            let bValue = b[orderBy];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = (bValue as string).toLowerCase();
            }

            if (aValue < bValue) {
                return order === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return order === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [processes, orderBy, order]);

    const headCells: { id: SortField; label: string; align?: 'left' | 'right' | 'center' }[] = [
        { id: 'pid', label: 'PID', align: 'left' },
        { id: 'name', label: 'PROCESS NAME', align: 'left' },
        { id: 'user', label: 'USER', align: 'left' },
        { id: 'status', label: 'STATUS', align: 'left' },
        { id: 'cpu', label: 'CPU %', align: 'right' },
        { id: 'memory', label: 'MEMORY (MB)', align: 'right' },
        { id: 'actions', label: 'ACTIONS', align: 'right' },
    ];

    return (
        <TableContainer
            component={Paper}
            sx={{
                borderRadius: BORDER_RADIUS.lg / 8,
                boxShadow: SHADOWS.md,
                overflow: 'hidden',
            }}
        >
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow
                        sx={{
                            backgroundColor: 'background.default',
                        }}
                    >
                        {headCells.map((headCell) => (
                            <TableCell
                                key={headCell.id}
                                align={headCell.align}
                                sx={{
                                    fontWeight: TYPOGRAPHY.fontWeight.semibold,
                                    fontSize: TYPOGRAPHY.fontSize.xs,
                                    color: 'text.secondary',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    py: SPACING.md / 8,
                                }}
                            >
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={() => handleSort(headCell.id)}
                                >
                                    {headCell.label}
                                </TableSortLabel>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedProcesses.map((process) => (
                        <ProcessRow
                            key={process.pid}
                            process={process}
                            onKill={onKill}
                            onSuspend={onSuspend}
                        />
                    ))}
                    {sortedProcesses.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: SPACING.xl / 8 }}>
                                <Box sx={{ color: 'text.secondary' }}>
                                    No processes found
                                </Box>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
