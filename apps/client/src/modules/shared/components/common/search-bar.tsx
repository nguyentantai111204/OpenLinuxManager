import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { BORDER_RADIUS, SPACING } from '../../constants/design';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Tìm kiếm tiến trình (PID, Name)...' }: SearchBarProps) {
    return (
        <TextField
            fullWidth
            size="small"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                ),
            }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    borderRadius: BORDER_RADIUS.md / 8,
                    backgroundColor: 'background.paper',
                },
            }}
        />
    );
}
