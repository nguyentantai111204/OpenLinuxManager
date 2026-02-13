import { Box, Typography, LinearProgress, CircularProgress, alpha } from '@mui/material';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { CardComponent, TableContainerComponent, TableComponent, TableHeadComponent, TableRowComponent, TableCellComponent, TableBodyComponent } from '../../components';
import { SPACING, COLORS, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/design';
import { StackColComponent, StackRowComponent, StackColAlignCenterJusCenterComponent, StackRowJusBetweenComponent } from '../../components/stack';
import { useSocket } from '../../hooks/use-socket';

export function Storage() {
    const { isConnected, storage } = useSocket();

    if (!storage) {
        return (
            <Box sx={{ p: SPACING.lg / 8 }}>
                <StackColAlignCenterJusCenterComponent sx={{ minHeight: '50vh' }}>
                    <CircularProgress color="primary" />
                    <Typography
                        variant="body2"
                        sx={{
                            mt: SPACING.md / 8,
                            color: 'text.secondary',
                            fontWeight: TYPOGRAPHY.fontWeight.medium,
                        }}
                    >
                        Loading storage info...
                    </Typography>
                </StackColAlignCenterJusCenterComponent>
            </Box>
        );
    }

    const storageData = storage.partitions;

    return (
        <Box sx={{ p: SPACING.lg / 8 }}>
            <StackColComponent spacing={SPACING.lg / 8}>
                <PageHeaderComponent
                    title="Disk Storage"
                    subtitle="Monitor disk usage and manage storage"
                    isConnected={isConnected}
                />

                {/* Overall Usage CardComponent */}
                <CardComponent sx={{ p: SPACING.md / 8 }}>
                    <StackColComponent spacing={SPACING.md / 8}>
                        <Typography variant="h6" fontWeight="bold">Total Local Storage</Typography>
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
                            Disk Usage Overview
                        </Typography>
                        <StackRowComponent sx={{ flexWrap: 'wrap', gap: SPACING.lg / 8 }}>
                            {storageData.map((drive) => (
                                <Box key={drive.mountPoint} sx={{ flex: '1 1 300px', p: SPACING.md / 8, border: `1px solid ${COLORS.border.light}`, borderRadius: BORDER_RADIUS.lg }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: TYPOGRAPHY.fontWeight.semibold }}>{drive.mountPoint} ({drive.name})</Typography>
                                    <StackRowJusBetweenComponent sx={{ mb: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary">Usage</Typography>
                                        <Typography variant="caption" sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold }}>{drive.usePercent}%</Typography>
                                    </StackRowJusBetweenComponent>
                                    <LinearProgress
                                        variant="determinate"
                                        value={parseInt(drive.usePercent.toString())}
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
                                <TableCellComponent>Filesystem</TableCellComponent>
                                <TableCellComponent>Size</TableCellComponent>
                                <TableCellComponent>Used</TableCellComponent>
                                <TableCellComponent>Available</TableCellComponent>
                                <TableCellComponent>Usage %</TableCellComponent>
                                <TableCellComponent>Mounted on</TableCellComponent>
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
                                                    value={parseInt(drive.usePercent.toString())}
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
                                <TableRowComponent>
                                    <TableCellComponent colSpan={6} align="center">
                                        No partitions found
                                    </TableCellComponent>
                                </TableRowComponent>
                            )}
                        </TableBodyComponent>
                    </TableComponent>
                </TableContainerComponent>
            </StackColComponent>
        </Box>
    );
}
