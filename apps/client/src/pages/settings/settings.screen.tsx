import React, { useState } from 'react';
import { Box, Typography, Switch, FormControlLabel, Divider, MenuItem } from '@mui/material';
import { useThemeMode } from '../../contexts/theme-context';
import { useSettings } from '../../contexts/settings.context';
import { CardComponent, ButtonComponent, TextFieldComponent, AppSnackbar, StackColComponent, StackRowComponent } from '../../components';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { SPACING, TYPOGRAPHY } from '../../constants/design';
import { useSnackbar } from '../../hooks/use-snackbar';

export function Settings() {
    const { mode, toggleTheme } = useThemeMode();
    const { settings, updateSettings, resetSettings } = useSettings();
    const { snackbarProps, showSnackbar } = useSnackbar();

    const [localSettings, setLocalSettings] = useState(settings);

    const handleSave = () => {
        updateSettings(localSettings);
        showSnackbar('Cài đặt đã được lưu thành công', 'success');
    };

    const handleReset = () => {
        resetSettings();
        setLocalSettings((useSettings as any).DEFAULT_SETTINGS || { refreshInterval: '5000', logHistorySize: '1000' });
        showSnackbar('Cài đặt đã được đặt lại mặc định', 'success');
    };

    return (
        <Box sx={{ p: SPACING.lg / 8 }}>
            <PageHeaderComponent
                title="Cài đặt cấu hình"
                subtitle="Tùy chỉnh các tham số và giao diện người dùng"
            />

            <StackColComponent spacing={SPACING.lg / 8} sx={{ mt: SPACING.md / 8, maxWidth: 800 }}>
                <CardComponent>
                    <Box sx={{ p: SPACING.lg / 8 }}>
                        <Typography variant="h6" sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold, mb: SPACING.md / 8 }}>
                            Giao diện
                        </Typography>
                        <StackColComponent spacing={3}>
                            <FormControlLabel
                                control={<Switch checked={mode === 'dark'} onChange={toggleTheme} color="primary" />}
                                label={
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: TYPOGRAPHY.fontWeight.semibold }}>Chế độ tối</Typography>
                                        <Typography variant="body2" color="text.secondary">Sử dụng gam màu tối cho toàn bộ ứng dụng</Typography>
                                    </Box>
                                }
                            />

                            <Divider />

                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold, mb: SPACING.md / 8 }}>
                                    Hệ thống
                                </Typography>
                                <StackColComponent spacing={SPACING.lg / 8}>
                                    <TextFieldComponent
                                        fullWidth
                                        select
                                        label="Tần suất cập nhật dữ liệu"
                                        value={localSettings.refreshInterval}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalSettings({ ...localSettings, refreshInterval: e.target.value })}
                                        helperText="Thời gian giữa các lần làm mới dữ liệu hệ thống"
                                    >
                                        <MenuItem value="1000">Nhanh (1 giây)</MenuItem>
                                        <MenuItem value="3000">Trung bình (3 giây)</MenuItem>
                                        <MenuItem value="5000">Chậm (5 giây)</MenuItem>
                                        <MenuItem value="10000">Rất chậm (10 giây)</MenuItem>
                                    </TextFieldComponent>

                                    <TextFieldComponent
                                        fullWidth
                                        label="Số lượng nhật ký lưu giữ"
                                        type="number"
                                        value={localSettings.logHistorySize}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalSettings({ ...localSettings, logHistorySize: e.target.value })}
                                        helperText="Số lượng bản ghi tối đa được hiển thị trên mỗi trang nhật ký"
                                    />
                                </StackColComponent>
                            </Box>

                            <Divider />

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: SPACING.md / 8 }}>
                                <ButtonComponent variant="outlined" color="inherit" onClick={handleReset}>
                                    Đặt lại mặc định
                                </ButtonComponent>
                                <ButtonComponent variant="contained" onClick={handleSave}>
                                    Lưu cài đặt
                                </ButtonComponent>
                            </Box>
                        </StackColComponent>
                    </Box>
                </CardComponent>

                {/* About Section */}
                <CardComponent>
                    <Box sx={{ p: SPACING.lg / 8 }}>
                        <Typography variant="h6" sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold, mb: SPACING.sm / 8 }}>
                            Thông tin phiên bản
                        </Typography>
                        <StackColComponent spacing={0.5}>
                            <StackRowComponent spacing={1}>
                                <Typography variant="body2" sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold }}>Phiên bản:</Typography>
                                <Typography variant="body2" color="text.secondary">1.0.0 (Production)</Typography>
                            </StackRowComponent>
                            <StackRowComponent spacing={1}>
                                <Typography variant="body2" sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold }}>Phát triển bởi:</Typography>
                                <Typography variant="body2" color="text.secondary">OpenLinuxManager Team</Typography>
                            </StackRowComponent>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                © 2026 Toàn bộ quyền được bảo lưu.
                            </Typography>
                        </StackColComponent>
                    </Box>
                </CardComponent>
            </StackColComponent>

            <AppSnackbar {...snackbarProps} />
        </Box>
    );
}

