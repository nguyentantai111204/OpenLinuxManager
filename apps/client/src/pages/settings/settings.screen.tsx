import { useThemeMode } from '../../contexts/theme-context';
import {
    Box,
    Typography,
    Switch,
    FormControlLabel,
    Divider,
    MenuItem,
    Snackbar,
    Alert
} from '@mui/material';
import { CardComponent, ButtonComponent, TextFieldComponent } from '../../components';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { SPACING, TYPOGRAPHY } from '../../constants/design';
import { StackColComponent } from '../../components/stack';

import { useState, useEffect } from 'react';

export function Settings() {
    const { mode, toggleTheme } = useThemeMode();
    const [settings, setSettings] = useState({
        refreshInterval: '5000',
        logHistorySize: '1000'
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    useEffect(() => {
        const saved = localStorage.getItem('system_settings');
        if (saved) {
            setSettings(JSON.parse(saved));
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('system_settings', JSON.stringify(settings));
        setSnackbar({ open: true, message: 'Settings saved successfully' });
    };

    const handleReset = () => {
        const defaults = { refreshInterval: '5000', logHistorySize: '1000' };
        setSettings(defaults);
        localStorage.setItem('system_settings', JSON.stringify(defaults));
        setSnackbar({ open: true, message: 'Settings reset to defaults' });
    };

    return (
        <Box sx={{ p: SPACING.lg / 8 }}>
            <StackColComponent spacing={SPACING.lg / 8}>
                <PageHeaderComponent
                    title="Settings"
                    subtitle="Configure system preferences and options"
                />

                <CardComponent sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}>
                    <Box sx={{ p: SPACING.lg / 8 }}>
                        <Typography variant="h6" sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold, mb: SPACING.md / 8 }}>
                            Appearance
                        </Typography>
                        <StackColComponent spacing={3}>
                            <FormControlLabel
                                control={<Switch checked={mode === 'dark'} onChange={toggleTheme} color="primary" />}
                                label={
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: TYPOGRAPHY.fontWeight.semibold }}>Dark Mode</Typography>
                                        <Typography variant="body2" color="text.secondary">Use a dark theme for the interface</Typography>
                                    </Box>
                                }
                            />

                            <Divider />

                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold, mb: SPACING.md / 8 }}>
                                    System
                                </Typography>
                                <StackColComponent spacing={2.5}>
                                    <TextFieldComponent
                                        fullWidth
                                        select
                                        label="Refresh Interval"
                                        value={settings.refreshInterval}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, refreshInterval: e.target.value })}
                                        helperText="How often to update system stats"
                                    >
                                        <MenuItem value="1000">1 Second</MenuItem>
                                        <MenuItem value="3000">3 Seconds</MenuItem>
                                        <MenuItem value="5000">5 Seconds</MenuItem>
                                        <MenuItem value="10000">10 Seconds</MenuItem>
                                    </TextFieldComponent>

                                    <TextFieldComponent
                                        fullWidth
                                        label="Log History Size"
                                        type="number"
                                        value={settings.logHistorySize}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, logHistorySize: e.target.value })}
                                        helperText="Maximum number of log lines to keep"
                                    />
                                </StackColComponent>
                            </Box>

                            <Divider />

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <ButtonComponent variant="outlined" color="inherit" onClick={handleReset}>Reset Defaults</ButtonComponent>
                                <ButtonComponent variant="contained" onClick={handleSave}>Save Changes</ButtonComponent>
                            </Box>
                        </StackColComponent>
                    </Box>
                </CardComponent>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert severity="success" sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>

                {/* About Box */}
                <CardComponent sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}>
                    <Box sx={{ p: SPACING.lg / 8 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: TYPOGRAPHY.fontWeight.bold,
                                mb: SPACING.md / 8,
                            }}
                        >
                            About
                        </Typography>
                        <StackColComponent spacing={SPACING.xs / 8}>
                            <Typography variant="body2" color="text.secondary">OpenLinuxManager Client v1.0.0</Typography>
                            <Typography variant="body2" color="text.secondary">© 2026 OpenLinuxManager Team</Typography>
                        </StackColComponent>
                    </Box>
                </CardComponent>
            </StackColComponent>
        </Box>
    );
}
