import { Circle as CircleIcon } from '@mui/icons-material';
import { COLORS, SPACING } from '../../constants/design';
import { ChipComponent } from '../chip/chip.component';

export type ProcessStatus = 'running' | 'sleeping' | 'stopped' | 'zombie' | 'disk-sleep' | 'idle' | 'unknown';

interface StatusBadgeProps {
    status: ProcessStatus;
}

const statusConfig: Record<ProcessStatus, { color: string; label: string }> = {
    running: {
        color: COLORS.status.running,
        label: 'Đang chạy',
    },
    sleeping: {
        color: COLORS.status.sleeping,
        label: 'Đang ngủ',
    },
    stopped: {
        color: COLORS.status.stopped,
        label: 'Đã dừng',
    },
    zombie: {
        color: COLORS.status.zombie,
        label: 'Zombie',
    },
    'disk-sleep': {
        color: COLORS.status.sleeping, // Using sleeping color for disk sleep
        label: 'Ngủ sâu (D)',
    },
    idle: {
        color: COLORS.text.secondary,
        label: 'Rảnh',
    },
    unknown: {
        color: COLORS.text.secondary,
        label: 'Không xác định',
    },
};

export function StatusBadgeComponent({ status }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <ChipComponent
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
                color: 'text.secondary',
                '& .MuiChip-icon': {
                    marginLeft: 0,
                },
            }}
        />
    );
}
