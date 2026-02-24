import React from 'react';
import { TableSortLabel, Checkbox } from '@mui/material';
import { TableContainerComponent, TableComponent, TableHeadComponent, TableRowComponent, TableCellComponent, TableBodyComponent, TableEmptyRow } from '../../components';
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
    onTerminate?: (pid: number) => void;
    onForceKill?: (pid: number) => void;
    onSuspend?: (pid: number) => void;
    onResume?: (pid: number) => void;
    selectedPids: number[];
    onSelectionChange: (pids: number[]) => void;
}

export function ProcessTable({
    processes,
    onTerminate,
    onForceKill,
    onSuspend,
    onResume,
    selectedPids,
    onSelectionChange
}: ProcessTableProps) {
    const [orderBy, setOrderBy] = React.useState<SortField>('cpu');
    const [order, setOrder] = React.useState<SortOrder>('desc');

    const handleSort = (field: SortField) => {
        const isAsc = orderBy === field && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(field);
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            onSelectionChange(processes.map(p => p.pid));
        } else {
            onSelectionChange([]);
        }
    };

    const handleToggleOne = (pid: number) => {
        const currentIndex = selectedPids.indexOf(pid);
        const newSelected = [...selectedPids];

        if (currentIndex === -1) {
            newSelected.push(pid);
        } else {
            newSelected.splice(currentIndex, 1);
        }

        onSelectionChange(newSelected);
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
        { id: 'mem', label: 'MEMORY', align: 'right' },
        { id: 'pid', label: 'ACTIONS', align: 'right' },
    ];

    return (
        <TableContainerComponent>
            <TableComponent sx={{ minWidth: 650 }}>
                <TableHeadComponent>
                    <TableRowComponent>
                        <TableCellComponent padding="checkbox">
                            <Checkbox
                                indeterminate={selectedPids.length > 0 && selectedPids.length < processes.length}
                                checked={processes.length > 0 && selectedPids.length === processes.length}
                                onChange={handleSelectAll}
                                size="small"
                            />
                        </TableCellComponent>
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
                            onTerminate={onTerminate}
                            onForceKill={onForceKill}
                            onSuspend={onSuspend}
                            onResume={onResume}
                            selected={selectedPids.includes(process.pid)}
                            onToggleSelection={handleToggleOne}
                        />
                    ))}
                    {sortedProcesses.length === 0 && (
                        <TableEmptyRow colSpan={8} message="Không tìm thấy tiến trình nào" />
                    )}
                </TableBodyComponent>
            </TableComponent>
        </TableContainerComponent>
    );
}
