import {
    TableComponent as MuiTable,
    TableBodyComponent as MuiTableBody,
    TableCellComponent as MuiTableCell,
    TableContainerComponent as MuiTableContainer,
    TableHeadComponent as MuiTableHead,
    TableRowComponent as MuiTableRow,
    styled,
    TableProps,
    TableCellProps,
    TableRowProps,
    alpha
} from '@mui/material';
import { BORDER_RADIUS, COLORS, TYPOGRAPHY, SHADOWS, SPACING, TRANSITIONS } from '../../constants/design';

export const TableComponentContainerComponent = styled(MuiTableContainer)(({ theme }) => ({
    borderRadius: BORDER_RADIUS.lg / 8,
    boxShadow: SHADOWS.sm,
    border: theme.palette.mode === 'dark' ? `1px solid ${COLORS.border.main}` : 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'hidden',
}));

export const TableComponentComponent = styled(MuiTable)(({ theme }) => ({
    borderCollapse: 'separate',
    borderSpacing: 0,
}));

export const TableComponentHeadComponent = styled(MuiTableHead)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.default, 0.5) : theme.palette.grey[50],
}));

export const TableComponentCellComponent = styled(MuiTableCell)<TableCellProps>(({ theme, align }) => ({
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

export const TableComponentRowComponent = styled(MuiTableRow)<TableRowProps>(({ theme }) => ({
    transition: `background-color ${TRANSITIONS.duration.fast} ${TRANSITIONS.easing.easeInOut}`,
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
    },
}));

export const TableComponentBodyComponent = MuiTableBody;
