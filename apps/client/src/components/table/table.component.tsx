import React, { useState, useMemo } from 'react';
import {
    Table as MuiTable,
    TableBody as MuiTableBody,
    TableCell as MuiTableCell,
    TableContainer as MuiTableContainer,
    TableHead as MuiTableHead,
    TableRow as MuiTableRow,
    TableSortLabel,
    Checkbox,
    IconButton,
    Tooltip,
    TablePagination,
    Box,
    styled,
    TableCellProps,
    TableRowProps,
    alpha
} from '@mui/material';
import { BORDER_RADIUS, COLORS, TYPOGRAPHY, SHADOWS, SPACING, TRANSITIONS } from '../../constants/design';
import { StackRowComponent } from '../stack';
import { PageLoading } from '../page-loading/page-loading.component';
import { TableEmptyRow } from './table-empty-row.component';

// --- Styled Components ---

export const TableContainerComponent = styled(MuiTableContainer)(({ theme }) => ({
    borderRadius: BORDER_RADIUS.lg,
    boxShadow: SHADOWS.sm,
    border: theme.palette.mode === 'dark' ? `1px solid ${COLORS.border.main}` : 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'hidden',
}));

export const TableComponent = styled(MuiTable)(({ theme }) => ({
    borderCollapse: 'separate',
    borderSpacing: 0,
}));

export const TableHeadComponent = styled(MuiTableHead)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.default, 0.5) : theme.palette.grey[50],
}));

export const TableCellComponent = styled(MuiTableCell)<TableCellProps>(({ theme }) => ({
    padding: `${SPACING.md}px ${SPACING.lg}px`,
    borderBottom: `1px solid ${theme.palette.divider}`,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: theme.palette.text.primary,

    '&.MuiTableCell-head': {
        color: theme.palette.text.secondary,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        fontSize: TYPOGRAPHY.fontSize.xs,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        whiteSpace: 'nowrap',
    },
}));

export const TableRowComponent = styled(MuiTableRow)<TableRowProps>(({ theme }) => ({
    transition: `all ${TRANSITIONS.duration.fast} ${TRANSITIONS.easing.easeInOut}`,
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
    },
    '&.Mui-selected': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
        },
    },
}));

export const TableBodyComponent = MuiTableBody;


export interface ColumnConfig<T> {
    id: keyof T | string;
    label: string;
    align?: 'left' | 'right' | 'center';
    sortable?: boolean;
    render?: (row: T) => React.ReactNode;
    width?: string | number;
}

export type ActionColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'inherit';

export interface ActionConfig<T> {
    id: string;
    label?: string | ((row: T) => string);
    icon: React.ReactNode | ((row: T) => React.ReactNode);
    color?: ActionColor | ((row: T) => ActionColor);
    onClick: (row: T) => void;
    tooltip?: string | ((row: T) => string);
    disabled?: (row: T) => boolean;
    visible?: (row: T) => boolean;
}

interface PaginationConfig {
    page: number;
    rowsPerPage: number;
    total: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rowsPerPage: number) => void;
    rowsPerPageOptions?: number[];
}

interface DataTableProps<T> {
    columns: ColumnConfig<T>[];
    data: T[];
    actions?: ActionConfig<T>[];
    onRowClick?: (row: T) => void;
    isLoading?: boolean;
    emptyMessage?: string;
    idField: keyof T;

    selectable?: boolean;
    selectedIds?: (string | number)[];
    onSelectionChange?: (ids: (string | number)[]) => void;

    initialOrderBy?: keyof T | string;
    initialOrder?: 'asc' | 'desc';

    pagination?: PaginationConfig;
    maxHeight?: string | number;
    stickyHeader?: boolean;
}

export function DataTableComponent<T extends Record<string, any>>({
    columns,
    data,
    actions,
    onRowClick,
    isLoading,
    emptyMessage = 'Không có dữ liệu',
    idField,
    selectable,
    selectedIds = [],
    onSelectionChange,
    initialOrderBy,
    initialOrder = 'asc',
    pagination,
    maxHeight,
    stickyHeader = true,
}: DataTableProps<T>) {
    const [orderBy, setOrderBy] = useState<keyof T | string | undefined>(initialOrderBy);
    const [order, setOrder] = useState<'asc' | 'desc'>(initialOrder);

    const handleSort = (property: keyof T | string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedData = useMemo(() => {
        if (!orderBy) return data;

        const column = columns.find(c => c.id === orderBy);
        if (!column || column.sortable === false) return data;

        return [...data].sort((a, b) => {
            const aValue = a[orderBy as keyof T];
            const bValue = b[orderBy as keyof T];

            if (aValue === bValue) return 0;
            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            const comparison = aValue < bValue ? -1 : 1;
            return order === 'asc' ? comparison : -comparison;
        });
    }, [data, orderBy, order, columns]);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!onSelectionChange) return;
        if (event.target.checked) {
            onSelectionChange(data.map(item => item[idField]));
        } else {
            onSelectionChange([]);
        }
    };

    const handleSelectOne = (id: string | number) => {
        if (!onSelectionChange) return;
        const selectedIndex = selectedIds.indexOf(id);
        let newSelected: (string | number)[] = [];

        if (selectedIndex === -1) {
            newSelected = [...selectedIds, id];
        } else {
            newSelected = selectedIds.filter(item => item !== id);
        }

        onSelectionChange(newSelected);
    };

    return (
        <TableContainerComponent sx={{ maxHeight }}>
            <TableComponent stickyHeader={stickyHeader}>
                <TableHeadComponent>
                    <TableRowComponent>
                        {selectable && (
                            <TableCellComponent padding="checkbox">
                                <Checkbox
                                    indeterminate={selectedIds.length > 0 && selectedIds.length < data.length}
                                    checked={data.length > 0 && selectedIds.length === data.length}
                                    onChange={handleSelectAll}
                                    size="small"
                                />
                            </TableCellComponent>
                        )}
                        {columns.map((column) => (
                            <TableCellComponent
                                key={String(column.id)}
                                align={column.align || 'left'}
                                style={{ width: column.width }}
                            >
                                {column.sortable !== false ? (
                                    <TableSortLabel
                                        active={orderBy === column.id}
                                        direction={orderBy === column.id ? order : 'asc'}
                                        onClick={() => handleSort(column.id)}
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                ) : (
                                    column.label
                                )}
                            </TableCellComponent>
                        ))}
                        {actions && actions.length > 0 && (
                            <TableCellComponent align="right">Thao tác</TableCellComponent>
                        )}
                    </TableRowComponent>
                </TableHeadComponent>
                <TableBodyComponent>
                    {isLoading ? (
                        <TableRowComponent>
                            <TableCellComponent colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} align="center" sx={{ py: 8 }}>
                                <PageLoading message="Đang tải dữ liệu..." minHeight="10vh" size={32} />
                            </TableCellComponent>
                        </TableRowComponent>
                    ) : (
                        <>
                            {sortedData.map((row) => {
                                const id = row[idField];
                                const isSelected = selectedIds.indexOf(id) !== -1;

                                return (
                                    <TableRowComponent
                                        key={String(id)}
                                        hover
                                        onClick={() => onRowClick?.(row)}
                                        selected={isSelected}
                                        sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                                    >
                                        {selectable && (
                                            <TableCellComponent padding="checkbox">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onChange={() => handleSelectOne(id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    size="small"
                                                />
                                            </TableCellComponent>
                                        )}
                                        {columns.map((column) => (
                                            <TableCellComponent
                                                key={`${String(id)}-${String(column.id)}`}
                                                align={column.align || 'left'}
                                            >
                                                {column.render ? column.render(row) : row[column.id]}
                                            </TableCellComponent>
                                        ))}
                                        {actions && actions.length > 0 && (
                                            <TableCellComponent align="right" onClick={(e) => e.stopPropagation()}>
                                                <StackRowComponent spacing={1} justifyContent="flex-end">
                                                    {actions.map((action) => {
                                                        const isVisible = action.visible ? action.visible(row) : true;
                                                        if (!isVisible) return null;

                                                        const isDisabled = action.disabled ? action.disabled(row) : false;
                                                        const tooltip = typeof action.tooltip === 'function' ? action.tooltip(row) : action.tooltip || (typeof action.label === 'function' ? action.label(row) : action.label) || '';
                                                        const icon = typeof action.icon === 'function' ? action.icon(row) : action.icon;
                                                        const color = typeof action.color === 'function' ? action.color(row) : action.color || 'default';

                                                        return (
                                                            <Tooltip key={action.id} title={tooltip}>
                                                                <Box component="span">
                                                                    <IconButton
                                                                        size="small"
                                                                        color={color as any}
                                                                        onClick={() => action.onClick(row)}
                                                                        disabled={isDisabled}
                                                                        sx={{
                                                                            '&:hover': {
                                                                                backgroundColor: color !== 'default' && color !== 'inherit' && (COLORS as any)[color]
                                                                                    ? alpha((COLORS as any)[color].main || (COLORS as any)[color], 0.1)
                                                                                    : undefined
                                                                            }
                                                                        }}
                                                                    >
                                                                        {icon}
                                                                    </IconButton>
                                                                </Box>
                                                            </Tooltip>
                                                        );
                                                    })}
                                                </StackRowComponent>
                                            </TableCellComponent>
                                        )}
                                    </TableRowComponent>
                                );
                            })}
                            {sortedData.length === 0 && (
                                <TableEmptyRow
                                    colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                                    message={emptyMessage}
                                />
                            )}
                        </>
                    )}
                </TableBodyComponent>
            </TableComponent>
            {pagination && (
                <Box sx={{ borderTop: `1px solid ${COLORS.border.light}` }}>
                    <TablePagination
                        component="div"
                        count={pagination.total}
                        page={pagination.page}
                        onPageChange={(_, page) => pagination.onPageChange(page)}
                        rowsPerPage={pagination.rowsPerPage}
                        onRowsPerPageChange={(e) => pagination.onRowsPerPageChange(parseInt(e.target.value, 10))}
                        rowsPerPageOptions={pagination.rowsPerPageOptions || [10, 25, 50]}
                        labelRowsPerPage="Hàng mỗi trang:"
                    />
                </Box>
            )}
        </TableContainerComponent>
    );
}
