import { Chip } from '@mui/material';
import { COLORS, TYPOGRAPHY, BORDER_RADIUS, SPACING } from '../../constants/design';

interface UserBadgeProps {
    username: string;
}

export function UserBadge({ username }: UserBadgeProps) {
    const isRoot = username.toLowerCase() === 'root';
    const isSystemUser = username.toLowerCase() === 'user';

    let bgColor = COLORS.user.default.background;
    let textColor = COLORS.user.default.text;

    if (isRoot) {
        bgColor = COLORS.user.root.background;
        textColor = COLORS.user.root.text;
    } else if (isSystemUser) {
        bgColor = COLORS.user.user.background;
        textColor = COLORS.user.user.text;
    }

    return (
        <Chip
            label={username}
            size="small"
            sx={{
                backgroundColor: bgColor,
                color: textColor,
                fontWeight: TYPOGRAPHY.fontWeight.medium,
                fontSize: TYPOGRAPHY.fontSize.xs,
                height: 24,
                borderRadius: BORDER_RADIUS.sm / 8,
                '& .MuiChip-label': {
                    px: SPACING.sm / 8,
                },
            }}
        />
    );
}
