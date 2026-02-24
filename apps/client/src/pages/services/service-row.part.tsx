import { Typography, IconButton, Box, Tooltip } from '@mui/material';
import {
    PlayArrow as PlayIcon,
    Stop as StopIcon,
    RestartAlt as RestartIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    PowerSettingsNew as PowerIcon,
    NotificationsActive as EnabledIcon,
    NotificationsOff as DisabledIcon
} from '@mui/icons-material';
import { TableRowComponent, TableCellComponent } from '../../components';
import { StatusBadgeComponent, ProcessStatus } from '../../components/status-badge/status-badge.component';
import { SPACING, TYPOGRAPHY, COLORS, TRANSITIONS } from '../../constants/design';
import { SystemService } from '../../apis/services/services.api';

interface ServiceRowProps {
    service: SystemService;
    onAction: (name: string, action: 'start' | 'stop' | 'restart' | 'enable' | 'disable') => void;
}

export function ServiceRow({ service, onAction }: ServiceRowProps) {
    const getStatusColor = () => {
        switch (service.status) {
            case 'Đang chạy': return COLORS.status.running;
            case 'Lỗi': return COLORS.status.stopped;
            default: return 'text.secondary';
        }
    };

    const isActive = service.status === 'Đang chạy';

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
                    {service.status === 'Đang chạy' ? (
                        <CheckCircleIcon sx={{ color: COLORS.status.running, fontSize: 18 }} />
                    ) : service.status === 'Lỗi' ? (
                        <ErrorIcon sx={{ color: COLORS.status.stopped, fontSize: 18 }} />
                    ) : (
                        <PowerIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                    )}
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: TYPOGRAPHY.fontWeight.medium,
                            color: getStatusColor()
                        }}
                    >
                        {service.status}
                    </Typography>
                </Box>
            </TableCellComponent>
            <TableCellComponent>
                <Tooltip title={service.enabled ? 'Đã bật tự chạy' : 'Đã tắt tự chạy'}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {service.enabled ? (
                            <EnabledIcon sx={{ color: COLORS.primary.main, fontSize: 18 }} />
                        ) : (
                            <DisabledIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                        )}
                    </Box>
                </Tooltip>
            </TableCellComponent>
            <TableCellComponent align="right">
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    {!isActive ? (
                        <Tooltip title="Chạy dịch vụ">
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
                        <Tooltip title="Dừng dịch vụ">
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
                    <Tooltip title="Khởi động lại">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onAction(service.name, 'restart')}
                            sx={{ transition: `all ${TRANSITIONS.duration.fast}` }}
                        >
                            <RestartIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    {!service.enabled ? (
                        <Tooltip title="Bật tự chạy">
                            <IconButton
                                size="small"
                                color="info"
                                onClick={() => onAction(service.name, 'enable')}
                                sx={{ transition: `all ${TRANSITIONS.duration.fast}` }}
                            >
                                <EnabledIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Tắt tự chạy">
                            <IconButton
                                size="small"
                                color="warning"
                                onClick={() => onAction(service.name, 'disable')}
                                sx={{ transition: `all ${TRANSITIONS.duration.fast}` }}
                            >
                                <DisabledIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            </TableCellComponent>
        </TableRowComponent>
    );
}
