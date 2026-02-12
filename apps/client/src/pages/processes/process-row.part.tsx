import { TableRow, TableCell, Typography, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { StatusBadge } from '../../components/status-badge/status-badge';
import { UserBadge } from '../../components/user-badge/user-badge';
import { Process } from './process-table.part';
import { SPACING, TYPOGRAPHY, TRANSITIONS, COLORS } from '../../constants/design';

interface ProcessRowProps {
    process: Process;
    onKill?: (pid: number) => void;
    onSuspend?: (pid: number) => void;
}

export function ProcessRow({ process, onKill }: ProcessRowProps) {
    return (
        <TableRow
            sx={{
                '&:hover': {
                    backgroundColor: 'action.hover',
                },
                transition: `background-color ${TRANSITIONS.duration.normal} ${TRANSITIONS.easing.easeInOut}`,
            }}
        >
            <TableCell>
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
            </TableCell>
            <TableCell>
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: TYPOGRAPHY.fontWeight.semibold,
                        fontSize: TYPOGRAPHY.fontSize.sm,
                        color: 'text.primary',
                    }}
                >
                    {process.name}
                </Typography>
            </TableCell>
            <TableCell>
                <UserBadge username={process.user} />
            </TableCell>
            <TableCell>
                <StatusBadge status={process.status} />
            </TableCell>
            <TableCell align="right">
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: TYPOGRAPHY.fontWeight.semibold,
                        fontSize: TYPOGRAPHY.fontSize.sm,
                        color: process.cpu > 50 ? 'error.main' : 'text.primary',
                    }}
                >
                    {process.cpu.toFixed(1)}%
                </Typography>
            </TableCell>
            <TableCell align="right">
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: TYPOGRAPHY.fontWeight.medium,
                        fontSize: TYPOGRAPHY.fontSize.sm,
                        color: 'text.secondary',
                    }}
                >
                    {process.memory.toFixed(0)} MB
                </Typography>
            </TableCell>
            <TableCell align="right">
                {onKill && (
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onKill(process.pid);
                        }}
                        sx={{
                            color: 'error.main',
                            transition: `all ${TRANSITIONS.duration.fast} ${TRANSITIONS.easing.easeInOut}`,
                            '&:hover': {
                                backgroundColor: COLORS.error.light,
                                color: COLORS.error.dark,
                                transform: 'scale(1.1)',
                            },
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                )}
            </TableCell>
        </TableRow>
    );
}
