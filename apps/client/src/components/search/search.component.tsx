import { InputAdornment, styled, alpha } from '@mui/material';
import { SearchComponent as SearchIcon } from '@mui/icons-material';
import { TextFieldComponent } from '../text-field/text-field.component';
import { SPACING, COLORS, BORDER_RADIUS, TRANSITIONS } from '../../constants/design';
import { TextFieldProps } from '@mui/material';

const StyledSearch = styled(TextFieldComponent)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        paddingLeft: SPACING.sm / 8,
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? alpha(COLORS.primary.main, 0.05) : alpha(COLORS.primary.main, 0.02),
        },
    },
}));

export function SearchComponentComponent(props: TextFieldProps) {
    return (
        <StyledSearch
            fullWidth
            size="small"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.secondary', ml: 1 }} />
                    </InputAdornment>
                ),
                ...props.InputProps,
            }}
            {...props}
        />
    );
}
