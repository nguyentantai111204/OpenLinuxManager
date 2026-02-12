import { TextFieldComponent as MuiTextField, TextFieldProps as MuiTextFieldProps, styled } from '@mui/material';
import { BORDER_RADIUS, COLORS, TYPOGRAPHY } from '../../constants/design';
import { alpha } from '@mui/material/styles';

export type TextFieldProps = MuiTextFieldProps;

const StyledTextField = styled(MuiTextField)<MuiTextFieldProps>(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: BORDER_RADIUS.md / 8,
        backgroundColor: theme.palette.mode === 'dark' ? alpha(COLORS.background.elevated, 0.4) : COLORS.background.paper,
        transition: 'all 0.2s ease-in-out',

        '& fieldset': {
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },

        '&:hover fieldset': {
            borderColor: COLORS.primary.main,
        },

        '&.Mui-focused fieldset': {
            borderColor: COLORS.primary.main,
            borderWidth: '1.5px',
        },
    },

    '& .MuiInputLabel-root': {
        fontSize: TYPOGRAPHY.fontSize.sm,
        '&.Mui-focused': {
            color: COLORS.primary.main,
        },
    },

    '& .MuiInputBase-input': {
        fontSize: TYPOGRAPHY.fontSize.sm,
        padding: '10px 14px',
    },
}));


export function TextFieldComponentComponent(props: TextFieldProps) {
    return <StyledTextField variant="outlined" {...props} />;
}
