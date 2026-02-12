import React from 'react';
import { TableBody, TableSortLabel, Box } from '@mui/material';
import { TableContainerComponent, TableComponent, TableHeadComponent, TableRowComponent, TableCellComponent, TableBodyComponent } from '../../components';
import { SPACING } from '../../constants/design';
import { ProcessStatus } from '../../components/status-badge/status-badge.component';
import { ProcessRow } from './process-row.part';

export interface Process {
    pid: number;
    name: string;
    user: string;
    status: ProcessStatus;
    cpu: number;
    mem: number;
}

type SortField = 'pid' | 'name' | 'user' | 'status' | 'cpu' | 'mem';
type SortOrder = 'asc' | 'desc';

interface ProcessTableProps {
    processes: Process[];
    onKill?: (pid: number) => void;
}

export function ProcessTable({ processes, onKill }: ProcessTableProps) {
    const [orderBy, setOrderBy] = React.useState<SortField>('cpu');
    const [order, setOrder] = React.useState<SortOrder>('desc');

    const handleSort = (field: SortField) => {
        const isAsc = orderBy === field && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(field);
    };

    const sortedProcesses = React.useMemo(() => {
        return [...processes].sort((a, b) => {
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
        { id: 'mem', label: 'MEM %', align: 'right' },
        { id: 'pid', label: 'ACTIONS', align: 'right' }, // Using pid as dummy for actions sort cell
    ];

    return (
        <TableContainerComponent>
            <TableComponent sx={{ minWidth: 650 }}>
                <TableHeadComponent>
                    <TableRowComponent>
                        {headCells.map((headCell, index) => (
                            <TableCellComponent
                                key={`${headCell.id}-${index}`}
                                align={headCell.align}
                            >
                                {headCell.label !== 'ACTIONS' ? (
                                    <TableSortLabel
                                        active={orderBy === headCell.id}
                                        direction={orderBy === headCell.id ? order : 'asc'}
                                        onClick={() => handleSort(headCell.id)}
                                    >
                                        {headCell.label}
                                    </TableSortLabel>
                                ) : (
                                    headCell.label
                                )}
                            </TableCellComponent>
                        ))}
                    </TableRowComponent>
                </TableHeadComponent>
                <TableBodyComponent>
                    {sortedProcesses.map((process) => (
                        <ProcessRow
                            key={process.pid}
                            process={process}
                            onKill={onKill}
                        />
                    ))}
                    {sortedProcesses.length === 0 && (
                        <TableRowComponent>
                            <TableCellComponent colSpan={7} align="center" sx={{ py: SPACING.xl / 8 }}>
                                <Box sx={{ color: 'text.secondary' }}>
                                    No processes found
                                </Box>
                            </TableCellComponent>
                        </TableRowComponent>
                    )}
                </TableBodyComponent>
            </TableComponent>
        </TableContainerComponent>
    );
}
