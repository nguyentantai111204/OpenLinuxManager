import { Chip } from '..';
import { COLORS, SPACING } from '../../constants/design';

interface UserBadgeProps {
    username: string;
}

export function UserBadgeComponentComponent({ username }: UserBadgeProps) {
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
                '& .MuiChip-label': {
                    px: SPACING.sm / 8,
                },
            }}
        />
    );
}
