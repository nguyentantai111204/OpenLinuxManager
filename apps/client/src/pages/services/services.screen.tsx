import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, CircularProgress, Snackbar, Alert, Paper } from '@mui/material';
import axios from 'axios';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { ServiceTable } from './service-table.part';
import { SystemService } from './service-row.part';
import { SearchComponent } from '../../components';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/design';
import { StackColComponent, StackRowJusBetweenComponent, StackColAlignCenterJusCenterComponent } from '../../components/stack';

export function Services() {
    const [services, setServices] = useState<SystemService[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const fetchServices = async () => {
        try {
            const response = await axios.get('/api/services');
            const data = response.data?.data || response.data;
            if (Array.isArray(data)) {
                setServices(data);
            } else {
                console.error('Expected array of services, got:', data);
                setServices([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch services', error);
            setSnackbar({ open: true, message: 'Failed to load services', severity: 'error' });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
        const interval = setInterval(fetchServices, 10000); // Refresh every 10s
        return () => clearInterval(interval);
    }, []);

    const handleAction = async (name: string, action: 'start' | 'stop' | 'restart' | 'enable' | 'disable') => {
        try {
            await axios.post(`/api/services/${name}/action`, { action });
            setSnackbar({ open: true, message: `Service ${name} ${action}ed successfully`, severity: 'success' });
            fetchServices();
        } catch (error) {
            console.error(`Failed to ${action} service`, error);
            setSnackbar({ open: true, message: `Failed to ${action} service ${name}`, severity: 'error' });
        }
    };

    const filteredServices = useMemo(() => {
        if (!searchQuery.trim()) return services;
        const query = searchQuery.toLowerCase();
        return services.filter(s =>
            s.name.toLowerCase().includes(query) ||
            s.description.toLowerCase().includes(query)
        );
    }, [services, searchQuery]);

    if (loading && services.length === 0) {
        return (
            <Box sx={{ p: SPACING.lg / 8 }}>
                <StackColAlignCenterJusCenterComponent sx={{ minHeight: '50vh' }}>
                    <CircularProgress color="primary" />
                    <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                        Loading system services...
                    </Typography>
                </StackColAlignCenterJusCenterComponent>
            </Box>
        );
    }

    return (
        <Box sx={{ p: SPACING.lg / 8 }}>
            <StackColComponent spacing={SPACING.lg / 8}>
                <PageHeaderComponent
                    title="Service Management"
                    subtitle="Monitor and control systemd units"
                />

                <Box sx={{ mb: SPACING.md / 8 }}>
                    <SearchComponent
                        placeholder="Search services by name or description..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        sx={{ maxWidth: 500 }}
                    />
                </Box>

                <ServiceTable
                    services={filteredServices}
                    onAction={handleAction}
                />

                <StackRowJusBetweenComponent sx={{ mt: SPACING.md / 8 }}>
                    <Typography variant="body2" color="text.secondary">
                        Total Units: {services.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Last Updated: {new Date().toLocaleTimeString()}
                    </Typography>
                </StackRowJusBetweenComponent>
            </StackColComponent>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: BORDER_RADIUS.md }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
