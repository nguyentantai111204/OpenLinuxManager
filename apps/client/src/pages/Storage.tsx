import { Box, Card, CardContent, Typography, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { PageHeader } from '../components/common/PageHeader';
import { SPACING, COLORS, BORDER_RADIUS } from '../constants/design';
import { StackCol, StackRow } from '../components/stack';

// Mock Data for Storage
const mockStorage = {
    total: 512, // GB
    used: 320,  // GB
    free: 192,  // GB
    partitions: [
        { name: '/dev/sda1', mountPoint: '/', type: 'ext4', size: '100 GB', used: '60 GB', avail: '40 GB', usePercent: 60 },
        { name: '/dev/sda2', mountPoint: '/home', type: 'ext4', size: '412 GB', used: '260 GB', avail: '152 GB', usePercent: 63 },
    ]
};

export function Storage() {
    return (
        <Box sx={{ p: SPACING.lg / 8 }}>
            <StackCol spacing={SPACING.lg / 8}>
                <PageHeader
                    title="Disk Storage"
                    subtitle="Monitor disk usage and manage storage"
                />

                {/* Overall Usage Card */}
                <Card sx={{ borderRadius: BORDER_RADIUS.lg / 8, boxShadow: 'none', border: `1px solid ${COLORS.border.light}` }}>
                    <CardContent>
                        <StackCol spacing={SPACING.md / 8}>
                            <Typography variant="h6" fontWeight="bold">Total Local Storage</Typography>
                            <StackRow spacing={SPACING.md / 8} sx={{ alignItems: 'baseline' }}>
                                <Typography variant="h3" color="primary.main">{mockStorage.used} GB</Typography>
                                <Typography variant="subtitle1" color="text.secondary">used of {mockStorage.total} GB</Typography>
                            </StackRow>
                            <Box sx={{ width: '100%', mr: 1 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={(mockStorage.used / mockStorage.total) * 100}
                                    sx={{
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: COLORS.background.elevated,
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: COLORS.chart.disk
                                        }
                                    }}
                                />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                                {mockStorage.free} GB free
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
                                    {mockStorage.partitions.map((row) => (
                                        <TableRow
                                            key={row.name}
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
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </StackCol>
        </Box>
    );
}
