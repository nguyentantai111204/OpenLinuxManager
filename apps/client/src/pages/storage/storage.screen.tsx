import React, { useMemo } from 'react';
import { Box, Typography, LinearProgress, alpha } from '@mui/material';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import {
    CardComponent,
    PageLoading,
    StackColComponent,
    StackRowComponent,
    StackRowJusBetweenComponent,
    DataTableComponent
} from '../../components';
import { SPACING, COLORS, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/design';
import { useSocketContext } from '../../contexts/socket-context';
import { StoragePartition } from '../../types/socket.types';
import { ColumnConfig } from '../../components/table/table.component';

export function Storage() {
    const { isConnected, storage } = useSocketContext();

    const columns = useMemo<ColumnConfig<StoragePartition>[]>(() => [
        {
            id: 'name',
            label: 'Hệ thống tệp',
            sortable: true,
            render: (row) => (
                <Typography variant="body2" sx={{ fontWeight: TYPOGRAPHY.fontWeight.medium }}>
                    {row.name}
                </Typography>
            )
        },
        { id: 'size', label: 'Kích thước', sortable: true },
        { id: 'used', label: 'Đã dùng', sortable: true },
        { id: 'avail', label: 'Còn trống', sortable: true },
        {
            id: 'usePercent',
            label: '% Sử dụng',
            sortable: true,
            width: 180,
            render: (row) => (
                <StackRowComponent spacing={1} alignItems="center">
                    <LinearProgress
                        variant="determinate"
                        value={row.usePercent}
                        sx={{
                            flexGrow: 1,
                            height: 8,
                            borderRadius: BORDER_RADIUS.full,
                            backgroundColor: alpha(COLORS.primary.main, 0.05),
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: row.usePercent > 90 ? COLORS.error.main :
                                    row.usePercent > 70 ? COLORS.warning.main :
                                        COLORS.success.main
                            }
                        }}
                    />
                    <Typography variant="caption" sx={{ minWidth: 35, fontWeight: TYPOGRAPHY.fontWeight.bold }}>
                        {row.usePercent}%
                    </Typography>
                </StackRowComponent>
            )
        },
        {
            id: 'mountPoint',
            label: 'Điểm gắn kết',
            render: (row) => (
                <Typography
                    variant="caption"
                    sx={{
                        fontFamily: TYPOGRAPHY.fontFamily.mono,
                        fontSize: TYPOGRAPHY.fontSize.xs,
                        color: 'text.secondary'
                    }}
                >
                    {row.mountPoint}
                </Typography>
            )
        },
    ], []);

    if (!storage) {
        return (
            <Box sx={{ p: SPACING.lg / 8 }}>
                <PageLoading message="Đang tải thông tin đĩa..." />
            </Box>
        );
    }

    const storageData = storage.partitions;

    return (
        <Box sx={{ p: SPACING.lg / 8 }}>
            <StackColComponent spacing={SPACING.lg / 8}>
                <PageHeaderComponent
                    title="Đĩa cứng & Lưu trữ"
                    subtitle="Giám sát dung lượng và phân vùng hệ thống"
                    isConnected={isConnected}
                />

                <CardComponent sx={{ p: SPACING.lg / 8 }}>
                    <StackColComponent spacing={SPACING.md / 8}>
                        <Typography variant="subtitle1" sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold }}>
                            Tổng hợp lưu trữ
                        </Typography>
                        <StackRowComponent spacing={1} sx={{ alignItems: 'baseline' }}>
                            <Typography variant="h3" sx={{ fontWeight: TYPOGRAPHY.fontWeight.extrabold, color: 'primary.main' }}>
                                {storage.used} GB
                            </Typography>
                            <Typography variant="h6" color="text.secondary" sx={{ opacity: 0.7 }}>
                                / {storage.total} GB
                            </Typography>
                        </StackRowComponent>

                        <Box sx={{ width: '100%', mt: 1 }}>
                            <LinearProgress
                                variant="determinate"
                                value={(storage.used / (storage.total || 1)) * 100}
                                sx={{
                                    height: 12,
                                    borderRadius: BORDER_RADIUS.full,
                                    backgroundColor: alpha(COLORS.primary.main, 0.1),
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: COLORS.chart.disk,
                                        borderRadius: BORDER_RADIUS.full,
                                    }
                                }}
                            />
                        </Box>

                        <StackRowJusBetweenComponent>
                            <Typography variant="body2" color="text.secondary">
                                Còn trống: {storage.free} GB
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold }}>
                                {Math.round((storage.used / (storage.total || 1)) * 100)}% đã dùng
                            </Typography>
                        </StackRowJusBetweenComponent>
                    </StackColComponent>
                </CardComponent>

                <DataTableComponent
                    idField="mountPoint"
                    columns={columns}
                    data={storageData}
                    emptyMessage="Không tìm thấy phân vùng nào"
                />
            </StackColComponent>
        </Box>
    );
}
