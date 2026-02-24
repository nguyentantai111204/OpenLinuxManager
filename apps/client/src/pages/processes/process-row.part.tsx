import { Typography, IconButton, Checkbox, Tooltip } from '@mui/material';
import {
    Delete as DeleteIcon,
    Pause as PauseIcon,
    PlayArrow as PlayArrowIcon,
    Block as BlockIcon
} from '@mui/icons-material';
import { ProcessStatus, StatusBadgeComponent } from '../../components/status-badge/status-badge.component';
import { UserBadgeComponent } from '../../components/user-badge/user-badge.component';
import { Process } from './process-table.part';
import { TableRowComponent, TableCellComponent } from '../../components';
import { SPACING, TYPOGRAPHY, TRANSITIONS, COLORS } from '../../constants/design';
import { StackRowComponent } from '../../components/stack';

interface ProcessRowProps {
    process: Process;
    onTerminate?: (pid: number) => void;
    onForceKill?: (pid: number) => void;
    onSuspend?: (pid: number) => void;
    onResume?: (pid: number) => void;
    selected?: boolean;
    onToggleSelection?: (pid: number) => void;
}

export function ProcessRow({
    process,
    onTerminate,
    onForceKill,
    onSuspend,
    onResume,
    selected,
    onToggleSelection
}: ProcessRowProps) {
    const isRunning = process.status === 'running' || process.status === 'sleeping';
    const isStopped = process.status === 'stopped';

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
                <StatusBadgeComponent status={process.status as ProcessStatus} />
            </TableCellComponent>
            <TableCellComponent align="right">
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {process.cpu}%
                </Typography>
            </TableCellComponent>
            <TableCellComponent align="right">
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {process.mem} MB
                </Typography>
            </TableCellComponent>
            <TableCellComponent align="right">
                <StackRowComponent spacing={1} justifyContent="flex-end">
                    {isRunning && onSuspend && (
                        <Tooltip title="Tạm dừng">
                            <IconButton
                                onClick={() => onSuspend(process.pid)}
                                size="small"
                                sx={{ color: COLORS.status.sleeping }}
                            >
                                <PauseIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    {isStopped && onResume && (
                        <Tooltip title="Tiếp tục">
                            <IconButton
                                onClick={() => onResume(process.pid)}
                                size="small"
                                sx={{ color: COLORS.status.running }}
                            >
                                <PlayArrowIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    {onTerminate && (
                        <Tooltip title="Kết thúc (Dịu dàng)">
                            <IconButton
                                onClick={() => onTerminate(process.pid)}
                                size="small"
                                sx={{ color: COLORS.status.stopped }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    {onForceKill && (
                        <Tooltip title="Buộc dừng (Mạnh mẽ)">
                            <IconButton
                                onClick={() => onForceKill(process.pid)}
                                size="small"
                                sx={{ color: 'error.main' }}
                            >
                                <BlockIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </StackRowComponent>
            </TableCellComponent>
        </TableRowComponent>
    );
}
