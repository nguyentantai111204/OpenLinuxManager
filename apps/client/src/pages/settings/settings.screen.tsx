import { useThemeMode } from '../../contexts/theme-context';
import {
    Box,
    Typography,
    Switch,
    FormControlLabel,
    Divider,
    MenuItem
} from '@mui/material';
import { CardComponent, ButtonComponent, TextFieldComponent } from '../../components';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { SPACING, TYPOGRAPHY } from '../../constants/design';
import { StackColComponent } from '../../components/stack';

export function Settings() {
    const { mode, toggleTheme } = useThemeMode();

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
                                        defaultValue="5000"
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
                                        defaultValue="1000"
                                        helperText="Maximum number of log lines to keep"
                                    />
                                </StackColComponent>
                            </Box>

                            <Divider />

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <ButtonComponent variant="outlined" color="inherit">Reset Defaults</ButtonComponent>
                                <ButtonComponent variant="contained">Save Changes</ButtonComponent>
                            </Box>
                        </StackColComponent>
                    </Box>
                </CardComponent>

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
