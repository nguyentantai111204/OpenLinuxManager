import { Chip as MuiChip, ChipProps, styled } from '@mui/material';
import { TYPOGRAPHY, BORDER_RADIUS } from '../../constants/design';

const StyledChip = styled(MuiChip)(({ theme, color, variant }) => ({
    borderRadius: BORDER_RADIUS.lg,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    fontSize: TYPOGRAPHY.fontSize.xs,
    height: 24,

    ...(variant === 'outlined' && {
        borderWidth: '1px',
    }),
}));

export function ChipComponent(props: ChipProps) {
    return <StyledChip {...props} />;
}
