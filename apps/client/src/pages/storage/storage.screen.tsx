import { Box, Card, CardContent, Typography, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { PageHeader } from '../../components/page-header/page-header';
import { SPACING, COLORS, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/design';
import { StackCol, StackRow, StackColAlignCenterJusCenter } from '../../components/stack';
import { useSocket, StorageData } from '../../hooks/use-socket';

export function Storage() {
    const { isConnected, storage } = useSocket();

    if (!storage) {
        return (
            <Box sx={{ p: SPACING.lg / 8 }}>
                <StackColAlignCenterJusCenter sx={{ minHeight: '50vh' }}>
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
                </StackColAlignCenterJusCenter>
            </Box>
        );
    }

    return (
        <Box sx={{ p: SPACING.lg / 8 }}>
            <StackCol spacing={SPACING.lg / 8}>
                <PageHeader
                    title="Disk Storage"
                    subtitle="Monitor disk usage and manage storage"
                    isConnected={isConnected}
                />

                {/* Overall Usage Card */}
                <Card sx={{ borderRadius: BORDER_RADIUS.lg / 8, boxShadow: 'none', border: `1px solid ${COLORS.border.light}` }}>
                    <CardContent>
                        <StackCol spacing={SPACING.md / 8}>
                            <Typography variant="h6" fontWeight="bold">Total Local Storage</Typography>
                            <StackRow spacing={SPACING.md / 8} sx={{ alignItems: 'baseline' }}>
                                <Typography variant="h3" color="primary.main">{storage.used} GB</Typography>
                                <Typography variant="subtitle1" color="text.secondary">used of {storage.total} GB</Typography>
                            </StackRow>
                            <Box sx={{ width: '100%', mr: 1 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={(storage.used / storage.total) * 100}
                                    sx={{
                                        height: 8,
                                        borderRadius: BORDER_RADIUS.full,
                                        backgroundColor: COLORS.background.elevated,
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: COLORS.chart.disk,
                                            borderRadius: BORDER_RADIUS.full,
                                        }
                                    }}
                                />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                                {storage.free} GB free
                            </Typography>
                        </StackCol>
                    </CardContent>
                </Card>

                {/* Partition Table */}
                <Card sx={{ borderRadius: BORDER_RADIUS.lg / 8, boxShadow: 'none', border: `1px solid ${COLORS.border.light}` }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: SPACING.md / 8 }}>Partitions</Typography>
                        <TableContainer component={Paper} elevation={0}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Filesystem</TableCell>
                                        <TableCell>Mount Point</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Size</TableCell>
                                        <TableCell>Used</TableCell>
                                        <TableCell>Avail</TableCell>
                                        <TableCell>Use %</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {storage.partitions.map((row, index) => (
                                        <TableRow
                                            key={`${row.name}-${index}`}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.name}
                                            </TableCell>
                                            <TableCell>{row.mountPoint}</TableCell>
                                            <TableCell>{row.type}</TableCell>
                                            <TableCell>{row.size}</TableCell>
                                            <TableCell>{row.used}</TableCell>
                                            <TableCell>{row.avail}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box sx={{ width: '100%', mr: 1 }}>
                                                        <LinearProgress variant="determinate" value={row.usePercent} />
                                                    </Box>
                                                    <Box sx={{ minWidth: 35 }}>
                                                        <Typography variant="body2" color="text.secondary">{`${row.usePercent}%`}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {storage.partitions.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                No partitions found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </StackCol>
        </Box>
    );
}
