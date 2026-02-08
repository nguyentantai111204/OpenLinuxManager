import { Chip } from '@mui/material';
import { Circle as CircleIcon } from '@mui/icons-material';
import { COLORS, TYPOGRAPHY, BORDER_RADIUS, SPACING } from '../../constants/design';

export type ProcessStatus = 'running' | 'sleeping' | 'stopped' | 'zombie';

interface StatusBadgeProps {
    status: ProcessStatus;
}

const statusConfig: Record<ProcessStatus, { color: string; label: string }> = {
    running: {
        color: COLORS.status.running,
        label: 'running',
    },
    sleeping: {
        color: COLORS.status.sleeping,
        label: 'sleeping',
    },
    stopped: {
        color: COLORS.status.stopped,
        label: 'stopped',
    },
    zombie: {
        color: COLORS.status.zombie,
        label: 'zombie',
    },
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <Chip
            icon={
                <CircleIcon
                    sx={{
                        fontSize: `${SPACING.sm}px !important`,
                        color: `${config.color} !important`,
                    }}
                />
            }
            label={config.label}
            size="small"
            sx={{
                backgroundColor: 'transparent',
                border: 'none',
                fontWeight: TYPOGRAPHY.fontWeight.medium,
                fontSize: TYPOGRAPHY.fontSize.sm,
                color: 'text.secondary',
                '& .MuiChip-icon': {
                    marginLeft: 0,
                },
            }}
        />
    );
}
