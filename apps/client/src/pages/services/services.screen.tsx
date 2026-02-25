import React, { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { ServiceTable } from './service-table.part';
import { SearchComponent, AppSnackbar, PageLoading, StackColComponent, StackRowJusBetweenComponent } from '../../components';
import { SPACING, TYPOGRAPHY } from '../../constants/design';
import { useServices } from '../../hooks/use-services';
import { useSnackbar } from '../../hooks/use-snackbar';
import { ServiceAction } from '../../apis/services/services.api';

export function Services() {
    const { services, isLoading, performAction } = useServices();
    const { snackbarProps, showSnackbar } = useSnackbar();
    const [searchQuery, setSearchQuery] = useState('');

    const handleAction = async (name: string, action: ServiceAction) => {
        try {
            await performAction(name, action);
            showSnackbar(`Dịch vụ ${name} đã được ${action} thành công`, 'success');
        } catch {
            showSnackbar(`Không thể thực hiện "${action}" trên dịch vụ ${name}`, 'error');
        }
    };

    const filteredServices = useMemo(() => {
        if (!searchQuery.trim()) return services;
        const query = searchQuery.toLowerCase();
        return services.filter(
            (s) =>
                s.name.toLowerCase().includes(query) ||
                s.description.toLowerCase().includes(query),
        );
    }, [services, searchQuery]);

    if (isLoading && services.length === 0) {
        return (
            <Box sx={{ p: SPACING.lg / 8 }}>
                <PageLoading message="Đang tải dịch vụ hệ thống..." />
            </Box>
        );
    }

    return (
        <Box sx={{ p: SPACING.lg / 8 }}>
            <PageHeaderComponent
                title="Quản lý dịch vụ"
                subtitle="Giám sát và điều khiển các systemd units"
            />

            <Box sx={{ my: SPACING.md / 8 }}>
                <SearchComponent
                    placeholder="Tìm kiếm theo tên hoặc mô tả dịch vụ..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchQuery(e.target.value)
                    }
                    sx={{ maxWidth: 500 }}
                />
            </Box>

            <ServiceTable services={filteredServices} onAction={handleAction} />

            <StackRowJusBetweenComponent sx={{ mt: SPACING.md / 8 }}>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: TYPOGRAPHY.fontWeight.medium }}
                >
                    Tổng số: {services.length} dịch vụ
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: TYPOGRAPHY.fontWeight.medium, opacity: 0.7 }}
                >
                    Cập nhật lúc: {new Date().toLocaleTimeString('vi-VN')}
                </Typography>
            </StackRowJusBetweenComponent>

            <AppSnackbar {...snackbarProps} />
        </Box>
    );
}
