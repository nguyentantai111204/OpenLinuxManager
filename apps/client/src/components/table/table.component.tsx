import {
    Table as MuiTable,
    TableBody as MuiTableBody,
    TableCell as MuiTableCell,
    TableContainer as MuiTableContainer,
    TableHead as MuiTableHead,
    TableRow as MuiTableRow,
    styled,
    TableCellProps,
    TableRowProps,
    alpha
} from '@mui/material';
import { BORDER_RADIUS, COLORS, TYPOGRAPHY, SHADOWS, SPACING, TRANSITIONS } from '../../constants/design';

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

export const TableCellComponent = styled(MuiTableCell)<TableCellProps>(({ theme, align }) => ({
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
    },
}));

export const TableRowComponent = styled(MuiTableRow)<TableRowProps>(({ theme }) => ({
    transition: `background-color ${TRANSITIONS.duration.fast} ${TRANSITIONS.easing.easeInOut}`,
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
    },
}));

export const TableBodyComponent = MuiTableBody;
