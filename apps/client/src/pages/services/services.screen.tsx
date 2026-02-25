import React, { useMemo, useState } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import {
    PlayArrow as PlayIcon,
    Stop as StopIcon,
    RestartAlt as RestartIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    PowerSettingsNew as PowerIcon,
    NotificationsActive as EnabledIcon,
    NotificationsOff as DisabledIcon
} from '@mui/icons-material';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import {
    SearchComponent,
    AppSnackbar,
    PageLoading,
    StackRowJusBetweenComponent,
    DataTableComponent
} from '../../components';
import { SPACING, TYPOGRAPHY, COLORS } from '../../constants/design';
import { useServices } from '../../hooks/use-services';
import { useSnackbar } from '../../hooks/use-snackbar';
import { ServiceAction, SystemService } from '../../apis/services/services.api';
import { ColumnConfig, ActionConfig } from '../../components/table/table.component';

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

    const columns = useMemo<ColumnConfig<SystemService>[]>(() => [
        {
            id: 'name',
            label: 'Tên dịch vụ & Mô tả',
            sortable: true,
            render: (row) => (
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: TYPOGRAPHY.fontWeight.semibold }}>
                        {row.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {row.description}
                    </Typography>
                </Box>
            )
        },
        {
            id: 'status',
            label: 'Trạng thái',
            sortable: true,
            render: (row) => {
                const isActive = row.status === 'Đang chạy';
                const isError = row.status === 'Lỗi';
                const color = isActive ? COLORS.status.running : isError ? COLORS.status.stopped : 'text.secondary';

                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isActive ? (
                            <CheckCircleIcon sx={{ color: COLORS.status.running, fontSize: 18 }} />
                        ) : isError ? (
                            <ErrorIcon sx={{ color: COLORS.status.stopped, fontSize: 18 }} />
                        ) : (
                            <PowerIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                        )}
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: TYPOGRAPHY.fontWeight.medium, color }}
                        >
                            {row.status}
                        </Typography>
                    </Box>
                );
            }
        },
        {
            id: 'enabled',
            label: 'Tự chạy',
            sortable: true,
            render: (row) => (
                <Tooltip title={row.enabled ? 'Đã bật tự chạy' : 'Đã tắt tự chạy'}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {row.enabled ? (
                            <EnabledIcon sx={{ color: COLORS.primary.main, fontSize: 18 }} />
                        ) : (
                            <DisabledIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                        )}
                    </Box>
                </Tooltip>
            )
        },
    ], []);

    const actions = useMemo<ActionConfig<SystemService>[]>(() => [
        {
            id: 'start',
            icon: <PlayIcon fontSize="small" />,
            tooltip: 'Chạy dịch vụ',
            color: 'success',
            visible: (row) => row.status !== 'Đang chạy',
            onClick: (row) => handleAction(row.name, 'start'),
        },
        {
            id: 'stop',
            icon: <StopIcon fontSize="small" />,
            tooltip: 'Dừng dịch vụ',
            color: 'error',
            visible: (row) => row.status === 'Đang chạy',
            onClick: (row) => handleAction(row.name, 'stop'),
        },
        {
            id: 'restart',
            icon: <RestartIcon fontSize="small" />,
            tooltip: 'Khởi động lại',
            color: 'primary',
            onClick: (row) => handleAction(row.name, 'restart'),
        },
        {
            id: 'toggle-enable',
            icon: (row: SystemService) => row.enabled ? <DisabledIcon fontSize="small" /> : <EnabledIcon fontSize="small" />,
            tooltip: (row: SystemService) => row.enabled ? 'Tắt tự chạy' : 'Bật tự chạy',
            color: (row: SystemService) => row.enabled ? 'warning' : 'info',
            onClick: (row) => handleAction(row.name, row.enabled ? 'disable' : 'enable'),
        },
    ], []);

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

            <DataTableComponent
                idField="name"
                columns={columns}
                data={filteredServices}
                actions={actions as ActionConfig<SystemService>[]}
                emptyMessage="Không tìm thấy dịch vụ nào"
            />

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
