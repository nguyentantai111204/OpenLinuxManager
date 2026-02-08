import { Container, Typography, Box } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { PageHeader } from '../components/common/PageHeader';
import { SPACING } from '../constants/design';

export function Settings() {
    return (
        <Container maxWidth="xl" sx={{ py: SPACING.lg / 8 }}>
            <PageHeader
                title="Settings"
                subtitle="Configure system preferences and options"
            />

            <Box sx={{ textAlign: 'center', py: SPACING.xxxl / 8 }}>
                <SettingsIcon sx={{ fontSize: 80, color: 'text.secondary', mb: SPACING.md / 8 }} />
                <Typography variant="h5" color="text.secondary">
                    Settings page coming soon...
                </Typography>
            </Box>
        </Container>
    );
}
