import { Button as MuiButton, ButtonProps as MuiButtonProps, styled } from '@mui/material';
import { COLORS, BORDER_RADIUS, TYPOGRAPHY, TRANSITIONS } from '../../constants/design';

export type ButtonProps = MuiButtonProps & {
    /**
     * Optional custom styling
     */
    rounded?: boolean;
};

const StyledButton = styled(MuiButton, {
    shouldForwardProp: (prop) => prop !== 'rounded',
})<ButtonProps>(({ variant, color, rounded }) => ({
    textTransform: 'none',
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    fontSize: TYPOGRAPHY.fontSize.sm,
    borderRadius: rounded ? BORDER_RADIUS.full : BORDER_RADIUS.lg,
    padding: '8px 16px',
    boxShadow: 'none',
    transition: `all ${TRANSITIONS.duration.normal} ${TRANSITIONS.easing.easeInOut}`,

    '&:hover': {
        boxShadow: 'none',
        transform: 'translateY(-1px)',
    },

    '&:active': {
        transform: 'translateY(0)',
    },

    ...(variant === 'contained' && color === 'primary' && {
        background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
        '&:hover': {
            background: `linear-gradient(135deg, ${COLORS.primary.light} 0%, ${COLORS.primary.main} 100%)`,
        },
    }),

    ...(variant === 'outlined' && {
        borderWidth: '1.5px',
        '&:hover': {
            borderWidth: '1.5px',
        },
    }),
}));

export function ButtonComponent(props: ButtonProps) {
    return <StyledButton {...props} />;
}
