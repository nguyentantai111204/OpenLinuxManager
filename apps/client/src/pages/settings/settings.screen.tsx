import { useThemeMode } from '../../contexts/theme-context';
import {
    Box,
    Typography,
    Switch,
    FormControlLabel,
    Divider,
    MenuItem,
} from '@mui/material';
import { CardComponent, ButtonComponent, TextFieldComponent, AppSnackbar } from '../../components';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { SPACING, TYPOGRAPHY } from '../../constants/design';
import { StackColComponent } from '../../components/stack';
import { useState, useEffect } from 'react';
import { useSnackbar } from '../../hooks/use-snackbar';

export function Settings() {
    const { mode, toggleTheme } = useThemeMode();
    const { snackbarProps, showSnackbar } = useSnackbar();
    const [settings, setSettings] = useState({
        refreshInterval: '5000',
        logHistorySize: '1000'
    });

    useEffect(() => {
        const saved = localStorage.getItem('system_settings');
        if (saved) {
            setSettings(JSON.parse(saved));
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('system_settings', JSON.stringify(settings));
        showSnackbar('Cài đặt đã được lưu', 'success');
    };

    const handleReset = () => {
        const defaults = { refreshInterval: '5000', logHistorySize: '1000' };
        setSettings(defaults);
        localStorage.setItem('system_settings', JSON.stringify(defaults));
        showSnackbar('Cài đặt đã được đặt lại mặc định', 'success');
    };

    return (
        <Box sx={{ p: SPACING.lg / 8 }}>
            <StackColComponent spacing={SPACING.lg / 8}>
                <PageHeaderComponent
                    title="Cài đặt"
                    subtitle="Cấu hình tùy chọn hệ thống"
                />

                <CardComponent sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}>
                    <Box sx={{ p: SPACING.lg / 8 }}>
                        <Typography variant="h6" sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold, mb: SPACING.md / 8 }}>Giao diện</Typography>
                        <StackColComponent spacing={3}>
                            <FormControlLabel
                                control={<Switch checked={mode === 'dark'} onChange={toggleTheme} color="primary" />}
                                label={
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: TYPOGRAPHY.fontWeight.semibold }}>Chế độ tối</Typography>
                                        <Typography variant="body2" color="text.secondary">Sử dụng giao diện tối</Typography>
                                    </Box>
                                }
                            />

                            <Divider />

                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold, mb: SPACING.md / 8 }}>Hệ thống</Typography>
                                <StackColComponent spacing={2.5}>
                                    <TextFieldComponent
                                        fullWidth
                                        select
                                        label="Tần suất cập nhật"
                                        value={settings.refreshInterval}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, refreshInterval: e.target.value })}
                                        helperText="Tần suất cập nhật thống kê hệ thống"
                                    >
                                        <MenuItem value="1000">1 giây</MenuItem>
                                        <MenuItem value="3000">3 giây</MenuItem>
                                        <MenuItem value="5000">5 giây</MenuItem>
                                        <MenuItem value="10000">10 giây</MenuItem>
                                    </TextFieldComponent>

                                    <TextFieldComponent
                                        fullWidth
                                        label="Kích thước lịch sử nhật ký"
                                        type="number"
                                        value={settings.logHistorySize}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, logHistorySize: e.target.value })}
                                        helperText="Số dòng nhật ký tối đa cần giữ"
                                    />
                                </StackColComponent>
                            </Box>

                            <Divider />

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <ButtonComponent variant="outlined" color="inherit" onClick={handleReset}>Mặc định</ButtonComponent>
                                <ButtonComponent variant="contained" onClick={handleSave}>Lưu thay đổi</ButtonComponent>
                            </Box>
                        </StackColComponent>
                    </Box>
                </CardComponent>

                <AppSnackbar {...snackbarProps} />

                {/* About Box */}
                <CardComponent sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}>
                    <Box sx={{ p: SPACING.lg / 8 }}>
                        <Typography variant="h6" sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold, mb: SPACING.md / 8 }}>Giới thiệu</Typography>
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
