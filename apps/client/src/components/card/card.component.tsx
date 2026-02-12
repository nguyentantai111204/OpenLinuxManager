import { Card as MuiCard, CardProps, styled } from '@mui/material';
import { BORDER_RADIUS, SHADOWS, COLORS, TRANSITIONS } from '../../constants/design';

interface CustomCardProps extends CardProps {
    hoverable?: boolean;
    flat?: boolean;
}

const StyledCard = styled(MuiCard, {
    shouldForwardProp: (prop) => prop !== 'hoverable' && prop !== 'flat',
})<CustomCardProps>(({ theme, hoverable, flat }) => ({
    borderRadius: BORDER_RADIUS.lg / 8,
    backgroundColor: theme.palette.mode === 'dark' ? COLORS.background.paper : '#ffffff',
    boxShadow: flat ? 'none' : SHADOWS.sm,
    border: flat ? `1px solid ${theme.palette.divider}` : 'none',
    transition: `all ${TRANSITIONS.duration.normal} ${TRANSITIONS.easing.easeInOut}`,

    ...(hoverable && {
        '&:hover': {
            boxShadow: SHADOWS.md,
            transform: 'translateY(-2px)',
        },
    }),
}));

export function CardComponent({ children, sx, ...props }: CardProps) {
    return <StyledCard elevation={0} {...props} />;
}
