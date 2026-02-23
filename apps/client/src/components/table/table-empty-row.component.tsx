import React from 'react';
import { Typography } from '@mui/material';
import { TableRowComponent, TableCellComponent } from '../table/table.component';
import { SPACING } from '../../constants/design';

interface TableEmptyRowProps {
    colSpan: number;
    message?: string;
}

/**
 * A full-width "empty state" table row.
 * Drop this inside <TableBodyComponent> when there are no rows to display.
 */
export function TableEmptyRow({
    colSpan,
    message = 'Không có dữ liệu',
}: TableEmptyRowProps) {
    return (
        <TableRowComponent>
            <TableCellComponent
                colSpan={colSpan}
                align="center"
                sx={{ py: SPACING.xl / 8 }}
            >
                <Typography color="text.secondary">{message}</Typography>
            </TableCellComponent>
        </TableRowComponent>
    );
}
