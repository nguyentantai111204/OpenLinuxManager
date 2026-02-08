import { ReactNode, useState } from 'react';
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Sidebar } from './Sidebar';
import { LAYOUT, SPACING } from '../../constants/design';

interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <Sidebar open={isMobile ? mobileOpen : true} onClose={handleDrawerToggle} />

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: {
                        xs: '100%',
                        md: `calc(100% - ${LAYOUT.sidebar.width}px)`,
                    },
                    minHeight: '100vh',
                    backgroundColor: 'background.default',
                }}
            >
                {/* Mobile Menu Button */}
                {isMobile && (
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
        </Box>
    );
}
