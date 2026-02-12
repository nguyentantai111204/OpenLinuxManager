import { Typography, IconButton, Box, Tooltip } from '@mui/material';
import {
    PlayArrow as PlayIcon,
    Stop as StopIcon,
    RestartAlt as RestartIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    PowerSettingsNew as PowerIcon
} from '@mui/icons-material';
import { TableRowComponent, TableCellComponent } from '../../components';
import { StatusBadgeComponent, ProcessStatus } from '../../components/status-badge/status-badge.component';
import { SPACING, TYPOGRAPHY, COLORS, TRANSITIONS } from '../../constants/design';

export interface SystemService {
    name: string;
    description: string;
    status: 'active' | 'inactive' | 'failed' | 'unknown';
    running: boolean;
    enabled: boolean;
}

interface ServiceRowProps {
    service: SystemService;
    onAction: (name: string, action: 'start' | 'stop' | 'restart') => void;
}

export function ServiceRow({ service, onAction }: ServiceRowProps) {
    const getStatusColor = () => {
        switch (service.status) {
            case 'active': return COLORS.status.running;
            case 'failed': return COLORS.status.stopped;
            default: return 'text.secondary';
        }
    };

    return (
        <TableRowComponent>
            <TableCellComponent>
                <Typography variant="body2" sx={{ fontWeight: TYPOGRAPHY.fontWeight.semibold }}>
                    {service.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {service.description}
                </Typography>
            </TableCellComponent>
            <TableCellComponent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {service.status === 'active' ? (
                        <CheckCircleIcon sx={{ color: COLORS.status.running, fontSize: 18 }} />
                    ) : service.status === 'failed' ? (
                        <ErrorIcon sx={{ color: COLORS.status.stopped, fontSize: 18 }} />
                    ) : (
                        <PowerIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                    )}
                    <Typography
                        variant="body2"
                        sx={{
                            textTransform: 'capitalize',
                            fontWeight: TYPOGRAPHY.fontWeight.medium,
                            color: getStatusColor()
                        }}
                    >
                        {service.status}
                    </Typography>
                </Box>
            </TableCellComponent>
            <TableCellComponent align="right">
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    {service.status !== 'active' ? (
                        <Tooltip title="Start Service">
                            <IconButton
                                size="small"
                                color="success"
                                onClick={() => onAction(service.name, 'start')}
                                sx={{ transition: `all ${TRANSITIONS.duration.fast}` }}
                            >
                                <PlayIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Stop Service">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => onAction(service.name, 'stop')}
                                sx={{ transition: `all ${TRANSITIONS.duration.fast}` }}
                            >
                                <StopIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Restart Service">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onAction(service.name, 'restart')}
                            sx={{ transition: `all ${TRANSITIONS.duration.fast}` }}
                        >
                            <RestartIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </TableCellComponent>
        </TableRowComponent>
    );
}
