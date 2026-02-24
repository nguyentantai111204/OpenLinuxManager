import { ReactNode, useState } from 'react';
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Sidebar } from './sidebar';
import { AppHeader } from './header';
import { StackRowComponent, StackColComponent } from '../components/stack';
import { LAYOUT, SPACING } from '../constants/design';

interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const theme = useTheme();

    return (
        <StackRowComponent sx={{ minHeight: '100vh' }} spacing={0}>
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    backgroundColor: theme.palette.background.default,
                    minHeight: '100vh',
                    overflow: 'auto',
                }}
            >
                {children}
            </Box>
        </StackRowComponent>
    );
}
