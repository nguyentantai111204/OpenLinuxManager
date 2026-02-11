import { Typography, Box } from '@mui/material';
import { Storage as StorageIcon } from '@mui/icons-material';
import { PageHeader } from '../components/common/PageHeader';
import { SPACING } from '../constants/design';

export function Storage() {
    return (
        <Box sx={{ p: SPACING.lg / 8 }}>
            <PageHeader
                title="Disk Storage"
                subtitle="Monitor disk usage and manage storage"
            />

            <Box sx={{ textAlign: 'center', py: SPACING.xxxl / 8 }}>
                <StorageIcon sx={{ fontSize: 80, color: 'text.secondary', mb: SPACING.md / 8 }} />
                <Typography variant="h5" color="text.secondary">
                    Storage management coming soon...
                </Typography>
            </Box>
        </Box>
    );
}
