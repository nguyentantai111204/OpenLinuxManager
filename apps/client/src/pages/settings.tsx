import { Box, Card, CardContent, Typography, Switch, TextField, MenuItem, Divider } from '@mui/material';
import { PageHeader } from '../modules/shared/components/common/page-header';
import { SPACING, COLORS, BORDER_RADIUS } from '../modules/shared/constants/design';
import { StackCol, StackRow, StackRowJusBetween } from '../modules/shared/components/stack';

export function Settings() {
    return (
        <Box sx={{ p: SPACING.lg / 8 }}>
            <StackCol spacing={SPACING.lg / 8}>
                <PageHeader
                    title="Settings"
                    subtitle="Configure system preferences and options"
                />

                <Card sx={{ borderRadius: BORDER_RADIUS.lg / 8, boxShadow: 'none', border: `1px solid ${COLORS.border.light}` }}>
                    <CardContent>
                        <StackCol spacing={SPACING.lg / 8}>
                            {/* General Settings */}
                            <Box>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: SPACING.md / 8 }}>General</Typography>
                                <StackCol spacing={SPACING.md / 8}>
                                    <StackRowJusBetween>
                                        <Box>
                                            <Typography variant="body1">Dark Mode</Typography>
                                            <Typography variant="caption" color="text.secondary">Use dark theme for the application</Typography>
                                        </Box>
                                        <Switch defaultChecked />
                                    </StackRowJusBetween>
                                    <Divider />
                                    <StackRowJusBetween>
                                        <Box>
                                            <Typography variant="body1">Refresh Rate</Typography>
                                            <Typography variant="caption" color="text.secondary">Interval for fetching system stats</Typography>
                                        </Box>
                                        <TextField
                                            select
                                            size="small"
                                            defaultValue={1000}
                                            sx={{ width: 150 }}
                                        >
                                            <MenuItem value={500}>500ms</MenuItem>
                                            <MenuItem value={1000}>1000ms</MenuItem>
                                            <MenuItem value={2000}>2000ms</MenuItem>
                                            <MenuItem value={5000}>5000ms</MenuItem>
                                        </TextField>
                                    </StackRowJusBetween>
                                </StackCol>
                            </Box>

                            {/* Connection Settings */}
                            <Box>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: SPACING.md / 8 }}>Connection</Typography>
                                <StackCol spacing={SPACING.md / 8}>
                                    <StackRowJusBetween>
                                        <Box>
                                            <Typography variant="body1">Server URL</Typography>
                                            <Typography variant="caption" color="text.secondary">WebSocket server address</Typography>
                                        </Box>
                                        <TextField
                                            size="small"
                                            defaultValue="http://localhost:3000"
                                            sx={{ width: 250 }}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </StackRowJusBetween>
                                </StackCol>
                            </Box>

                            {/* About */}
                            <Box>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: SPACING.md / 8 }}>About</Typography>
                                <StackCol spacing={SPACING.xs / 8}>
                                    <Typography variant="body2" color="text.secondary">OpenLinuxManager Client v1.0.0</Typography>
                                    <Typography variant="body2" color="text.secondary">© 2026 OpenLinuxManager Team</Typography>
                                </StackCol>
                            </Box>
                        </StackCol>
                    </CardContent>
                </Card>
            </StackCol>
        </Box>
    );
}
