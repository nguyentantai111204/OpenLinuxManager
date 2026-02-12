import { Typography, IconButton, Checkbox } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { ProcessStatus, StatusBadgeComponent } from '../../components/status-badge/status-badge.component';
import { UserBadgeComponent } from '../../components/user-badge/user-badge.component';
import { Process } from './process-table.part';
import { TableRowComponent, TableCellComponent } from '../../components';
import { SPACING, TYPOGRAPHY, TRANSITIONS, COLORS } from '../../constants/design';

interface ProcessRowProps {
    process: Process;
    onKill?: (pid: number) => void;
    selected?: boolean;
    onToggleSelection?: (pid: number) => void;
}

export function ProcessRow({ process, onKill, selected, onToggleSelection }: ProcessRowProps) {
    return (
        <TableRowComponent selected={selected}>
            <TableCellComponent padding="checkbox">
                <Checkbox
                    checked={selected || false}
                    onChange={() => onToggleSelection?.(process.pid)}
                    size="small"
                />
            </TableCellComponent>
            <TableCellComponent>
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: TYPOGRAPHY.fontWeight.medium,
                        fontSize: TYPOGRAPHY.fontSize.sm,
                        color: 'text.secondary',
                    }}
                >
                    {process.pid}
                </Typography>
            </TableCellComponent>
            <TableCellComponent>
                <Typography variant="body2" sx={{ fontWeight: TYPOGRAPHY.fontWeight.semibold }}>
                    {process.name}
                </Typography>
            </TableCellComponent>
            <TableCellComponent>
                <UserBadgeComponent username={process.user} />
            </TableCellComponent>
            <TableCellComponent>
                <StatusBadgeComponent status={process.status.toLowerCase() as ProcessStatus} />
            </TableCellComponent>
            <TableCellComponent align="right">
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {process.cpu}%
                </Typography>
            </TableCellComponent>
            <TableCellComponent align="right">
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {process.mem}%
                </Typography>
            </TableCellComponent>
            <TableCellComponent align="right">
                {onKill && (
                    <IconButton
                        onClick={() => onKill(process.pid)}
                        size="small"
                        sx={{
                            color: COLORS.status.stopped,
                            transition: `all ${TRANSITIONS.duration.fast} ${TRANSITIONS.easing.easeInOut}`,
                            '&:hover': {
                                backgroundColor: 'transparent',
                                transform: 'none',
                            },
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                )}
            </TableCellComponent>
        </TableRowComponent>
    );
}
