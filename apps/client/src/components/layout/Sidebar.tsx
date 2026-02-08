import { ReactNode } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Typography, useTheme, useMediaQuery } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Dashboard as DashboardIcon,
    List as ListIcon,
    Storage as StorageIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
import { COLORS, SPACING, BORDER_RADIUS, LAYOUT, TYPOGRAPHY, TRANSITIONS } from '../../constants/design';
import { StackCol, StackRow, StackColAlignCenterJusCenter } from '../stack';

interface MenuItem {
    id: string;
    label: string;
    icon: ReactNode;
    path: string;
}

const menuItems: MenuItem[] = [
    {
        id: 'dashboard',
        label: 'Tổng Quan',
        icon: <DashboardIcon />,
        path: '/',
    },
    {
        id: 'processes',
        label: 'Tiến Trình',
        icon: <ListIcon />,
        path: '/processes',
    },
    {
        id: 'storage',
        label: 'Ổ Đĩa',
        icon: <StorageIcon />,
        path: '/storage',
    },
    {
        id: 'settings',
        label: 'Cấu Hình',
        icon: <SettingsIcon />,
        path: '/settings',
    },
];

interface SidebarProps {
    open?: boolean;
    onClose?: () => void;
}

export function Sidebar({ open = true, onClose }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleNavigate = (path: string) => {
        navigate(path);
        if (isMobile && onClose) {
            onClose();
        }
    };

    const sidebarContent = (
        <StackCol
            sx={{
                width: LAYOUT.sidebar.width,
                height: '100%',
                backgroundColor: COLORS.sidebar.background,
                color: COLORS.sidebar.text,
            }}
            spacing={0}
        >
            {/* Logo Section */}
            <StackRow
                sx={{
                    p: SPACING.lg / 8,
                    gap: SPACING.sm / 8,
                    borderBottom: `1px solid ${COLORS.sidebar.hover}`,
                }}
                spacing={SPACING.sm / 8}
            >
                <StackColAlignCenterJusCenter
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: BORDER_RADIUS.md,
                        background: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.primary.dark} 100%)`,
                        fontSize: TYPOGRAPHY.fontSize.xl,
                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                    }}
                    spacing={0}
                >
                    🐧
                </StackColAlignCenterJusCenter>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                        fontSize: TYPOGRAPHY.fontSize.lg,
                    }}
                >
                    UbuntuMonitor
                </Typography>
            </StackRow>

            {/* Navigation Menu */}
            <List sx={{ flex: 1, py: SPACING.md / 8 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <ListItem
                            key={item.id}
                            disablePadding
                            sx={{
                                px: SPACING.md / 8,
                                mb: SPACING.xs / 8,
                            }}
                        >
                            <ListItemButton
                                onClick={() => handleNavigate(item.path)}
                                sx={{
                                    borderRadius: BORDER_RADIUS.lg / 8,
                                    backgroundColor: isActive ? COLORS.sidebar.active : 'transparent',
                                    color: COLORS.sidebar.text,
                                    transition: `all ${TRANSITIONS.duration.fast} ${TRANSITIONS.easing.easeInOut}`,
                                    '&:hover': {
                                        backgroundColor: isActive ? COLORS.sidebar.active : COLORS.sidebar.hover,
                                    },
                                    py: SPACING.md / 8,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: 'inherit',
                                        minWidth: 40,
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? TYPOGRAPHY.fontWeight.semibold : TYPOGRAPHY.fontWeight.medium,
                                        fontSize: TYPOGRAPHY.fontSize.base,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* User Profile Section */}
            <StackRow
                sx={{
                    p: SPACING.md / 8,
                    borderTop: `1px solid ${COLORS.sidebar.hover}`,
                }}
                spacing={SPACING.sm / 8}
            >
                <Avatar
                    sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: COLORS.primary.main,
                        fontSize: TYPOGRAPHY.fontSize.lg,
                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                    }}
                >
                    A
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: TYPOGRAPHY.fontWeight.semibold,
                            fontSize: TYPOGRAPHY.fontSize.sm,
                        }}
                    >
                        Admin User
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: COLORS.sidebar.textSecondary,
                            fontSize: TYPOGRAPHY.fontSize.xs,
                        }}
                    >
                        Ubuntu 22.04 LTS
                    </Typography>
                </Box>
            </StackRow>
        </StackCol>
    );

    // Mobile: Temporary drawer
    if (isMobile) {
        return (
            <Drawer
                anchor="left"
                open={open}
                onClose={onClose}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: LAYOUT.sidebar.width,
                        boxSizing: 'border-box',
                        border: 'none',
                    },
                }}
            >
                {sidebarContent}
            </Drawer>
        );
    }

    // Desktop: Permanent drawer
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: LAYOUT.sidebar.width,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: LAYOUT.sidebar.width,
                    boxSizing: 'border-box',
                    border: 'none',
                },
            }}
        >
            {sidebarContent}
        </Drawer>
    );
}
