import { Box, Typography, LinearProgress, alpha } from '@mui/material';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { CardComponent, TableContainerComponent, TableComponent, TableHeadComponent, TableRowComponent, TableCellComponent, TableBodyComponent, PageLoading, TableEmptyRow, StackColComponent, StackRowComponent, StackRowJusBetweenComponent } from '../../components';
import { SPACING, COLORS, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/design';
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

                <TableContainerComponent>
                    <TableComponent stickyHeader>
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
                                    <TableCellComponent sx={{ fontWeight: TYPOGRAPHY.fontWeight.medium }}>
                                        {drive.name}
                                    </TableCellComponent>
                                    <TableCellComponent>{drive.size}</TableCellComponent>
                                    <TableCellComponent>{drive.used}</TableCellComponent>
                                    <TableCellComponent>{drive.avail}</TableCellComponent>
                                    <TableCellComponent sx={{ minWidth: 160 }}>
                                        <StackRowComponent spacing={1} alignItems="center">
                                            <LinearProgress
                                                variant="determinate"
                                                value={drive.usePercent}
                                                sx={{
                                                    flexGrow: 1,
                                                    height: 8,
                                                    borderRadius: BORDER_RADIUS.full,
                                                    backgroundColor: alpha(COLORS.primary.main, 0.05),
                                                    '& .MuiLinearProgress-bar': {
                                                        backgroundColor: drive.usePercent > 90 ? COLORS.error.main :
                                                            drive.usePercent > 70 ? COLORS.warning.main :
                                                                COLORS.success.main
                                                    }
                                                }}
                                            />
                                            <Typography variant="caption" sx={{ minWidth: 35, fontWeight: TYPOGRAPHY.fontWeight.bold }}>
                                                {drive.usePercent}%
                                            </Typography>
                                        </StackRowComponent>
                                    </TableCellComponent>
                                    <TableCellComponent sx={{ fontFamily: TYPOGRAPHY.fontFamily.mono, fontSize: TYPOGRAPHY.fontSize.xs, color: 'text.secondary' }}>
                                        {drive.mountPoint}
                                    </TableCellComponent>
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
