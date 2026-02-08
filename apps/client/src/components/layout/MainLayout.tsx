import { ReactNode, useState } from 'react';
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Sidebar } from './Sidebar';
import { StackRow } from '../stack';
import { LAYOUT, SPACING } from '../../constants/design';

interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    // const [mobileOpen, setMobileOpen] = useState(false); // No longer needed
    const [sidebarOpen, setSidebarOpen] = useState(false); // New state for sidebar

    // const handleDrawerToggle = () => { // No longer needed
    //     setMobileOpen(!mobileOpen);
    // };

    return (
        <StackRow sx={{ minHeight: '100vh' }} spacing={0}>
            {/* Sidebar */}
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    backgroundColor: 'background.default',
                    minHeight: '100vh',
                    overflow: 'auto',
                }}
            >
                {/* Mobile Menu Button - Removed as per the change, but keeping the original logic for context if needed */}
                {/* {isMobile && (
                    <Box
                        sx={{
                            p: SPACING.md / 8,
                            display: { xs: 'block', md: 'none' },
                        }}
                    >
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                )}

                {/* Page Content */}
                {children}
            </Box>
        </StackRow>
    );
}
