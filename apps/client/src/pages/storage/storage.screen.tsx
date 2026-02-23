import { Box, Typography, LinearProgress, alpha } from '@mui/material';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { CardComponent, TableContainerComponent, TableComponent, TableHeadComponent, TableRowComponent, TableCellComponent, TableBodyComponent, PageLoading, TableEmptyRow } from '../../components';
import { SPACING, COLORS, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/design';
import { StackColComponent, StackRowComponent, StackRowJusBetweenComponent } from '../../components/stack';
import { useSocketContext } from '../../contexts/socket-context';

export function Storage() {
    const { isConnected, storage } = useSocketContext();

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
                    subtitle="Giám sát dung lượng đĩa"
                    isConnected={isConnected}
                />

                {/* Overall Usage CardComponent */}
                <CardComponent sx={{ p: SPACING.md / 8 }}>
                    <StackColComponent spacing={SPACING.md / 8}>
                        <Typography variant="h6" fontWeight="bold">Tổng dung lượng</Typography>
                        <StackRowComponent spacing={SPACING.md / 8} sx={{ alignItems: 'baseline' }}>
                            <Typography variant="h3" color="primary.main">{storage.used} GB</Typography>
                            <Typography variant="subtitle1" color="text.secondary">used of {storage.total} GB</Typography>
                        </StackRowComponent>
                        <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress
                                variant="determinate"
                                value={(storage.used / (storage.total || 1)) * 100}
                                sx={(theme) => ({
                                    height: 8,
                                    borderRadius: BORDER_RADIUS.full,
                                    backgroundColor: alpha(theme.palette.background.paper, 0.3),
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: COLORS.chart.disk,
                                        borderRadius: BORDER_RADIUS.full,
                                    }
                                })}
                            />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                            {storage.free} GB free
                        </Typography>
                    </StackColComponent>
                </CardComponent>

                {/* Disk Usage Overview CardComponent */}
                <CardComponent sx={{ mb: SPACING.xl / 8 }}>
                    <Box sx={{ p: SPACING.lg / 8 }}>
                        <Typography variant="h6" sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold, mb: SPACING.md / 8 }}>
                            Tổng quan sử dụng đĩa
                        </Typography>
                        <StackRowComponent sx={{ flexWrap: 'wrap', gap: SPACING.lg / 8 }}>
                            {storageData.map((drive) => (
                                <Box key={drive.mountPoint} sx={{ flex: '1 1 300px', p: SPACING.md / 8, border: `1px solid ${COLORS.border.light}`, borderRadius: BORDER_RADIUS.lg }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: TYPOGRAPHY.fontWeight.semibold }}>{drive.mountPoint} ({drive.name})</Typography>
                                    <StackRowJusBetweenComponent sx={{ mb: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary">Sử dụng</Typography>
                                        <Typography variant="caption" sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold }}>{drive.usePercent}%</Typography>
                                    </StackRowJusBetweenComponent>
                                    <LinearProgress
                                        variant="determinate"
                                        value={drive.usePercent}
                                        sx={{ height: 8, borderRadius: BORDER_RADIUS.sm, bgcolor: alpha(COLORS.primary.main, 0.1) }}
                                    />
                                </Box>
                            ))}
                        </StackRowComponent>
                    </Box>
                </CardComponent>

                {/* Partition TableComponent */}
                <TableContainerComponent>
                    <TableComponent sx={{ minWidth: 650 }}>
                        <TableHeadComponent>
                            <TableRowComponent>
                                <TableCellComponent>Hệ thống tệp</TableCellComponent>
                                <TableCellComponent>Kích thước</TableCellComponent>
                                <TableCellComponent>Đã dùng</TableCellComponent>
                                <TableCellComponent>Còn trống</TableCellComponent>
                                <TableCellComponent>% Sử dụng</TableCellComponent>
                                <TableCellComponent>Điểm gắn kết</TableCellComponent>
                            </TableRowComponent>
                        </TableHeadComponent>
                        <TableBodyComponent>
                            {storageData.map((drive) => (
                                <TableRowComponent key={drive.mountPoint}>
                                    <TableCellComponent>{drive.name}</TableCellComponent>
                                    <TableCellComponent>{drive.size}</TableCellComponent>
                                    <TableCellComponent>{drive.used}</TableCellComponent>
                                    <TableCellComponent>{drive.avail}</TableCellComponent>
                                    <TableCellComponent sx={{ minWidth: 150 }}>
                                        <Box sx={{ width: '100%' }}>
                                            <StackRowJusBetweenComponent sx={{ mb: 0.5 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={drive.usePercent}
                                                    sx={{ flexGrow: 1, height: 6, borderRadius: BORDER_RADIUS.sm, mr: 1, alignSelf: 'center' }}
                                                />
                                                <Typography variant="caption" sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold }}>
                                                    {drive.usePercent}%
                                                </Typography>
                                            </StackRowJusBetweenComponent>
                                        </Box>
                                    </TableCellComponent>
                                    <TableCellComponent>{drive.mountPoint}</TableCellComponent>
                                </TableRowComponent>
                            ))}
                            {storageData.length === 0 && (
                                <TableEmptyRow colSpan={6} message="Không tìm thấy phân vùng nào" />
                            )}
                        </TableBodyComponent>
                    </TableComponent>
                </TableContainerComponent>
            </StackColComponent>
        </Box>
    );
}
