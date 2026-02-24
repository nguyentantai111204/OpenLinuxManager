import { ReactNode } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Typography, useTheme, useMediaQuery } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Dashboard as DashboardIcon,
    List as ListIcon,
    Storage as StorageIcon,
    Dns as DnsIcon,
    History as HistoryIcon,
    Settings as SettingsIcon,
    Person as PersonIcon,
    Construction as ConstructionIcon,
} from '@mui/icons-material';
import { COLORS, BORDER_RADIUS, LAYOUT, TYPOGRAPHY, TRANSITIONS } from '../constants/design';
import { StackColComponent, StackRowComponent } from '../components/stack';
import { useSocketContext } from '../contexts/socket-context';
import { Brand } from '../components/brand/logo-brand.component';

interface MenuItem {
    id: string;
    label: string;
    icon: ReactNode;
    path: string;
}

const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Bảng điều khiển', icon: <DashboardIcon />, path: '/' },
    { id: 'processes', label: 'Tiến trình', icon: <ListIcon />, path: '/processes' },
    { id: 'users', label: 'Người dùng', icon: <PersonIcon />, path: '/users' },
    { id: 'storage', label: 'Lưu trữ', icon: <StorageIcon />, path: '/storage' },
    { id: 'services', label: 'Dịch vụ', icon: <ConstructionIcon />, path: '/services' },
    { id: 'audit-logs', label: 'Nhật ký', icon: <HistoryIcon />, path: '/audit-logs' },
    { id: 'settings', label: 'Cài đặt', icon: <SettingsIcon />, path: '/settings' },
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
    const { systemStats } = useSocketContext();

    const handleNavigate = (path: string) => {
        navigate(path);
        if (isMobile && onClose) {
            onClose();
        }
    };

    const sidebarContent = (
        <StackColComponent
            sx={{
                width: LAYOUT.sidebar.width,
                height: '100%',
                backgroundColor: COLORS.sidebar.background,
                color: COLORS.sidebar.text,
                backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)', // Subtle gradient
            }}
            spacing={0}
        >
            <Box sx={{ p: 3, pt: 4, mb: 1 }}>
                <Brand variant="sidebar" />
            </Box>

            <List sx={{ flex: 1, py: 1, px: 2, overflowY: 'auto', overflowX: 'hidden' }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <ListItem
                            key={item.id}
                            disablePadding
                            sx={{
                                mb: 0.5,
                                position: 'relative',
                            }}
                        >
                            {isActive && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: 0,
                                        width: 4,
                                        height: '50%',
                                        top: '25%',
                                        backgroundColor: COLORS.primary.main,
                                        borderRadius: '0 4px 4px 0',
                                        boxShadow: `2px 0 8px ${COLORS.primary.main}60`,
                                        zIndex: 1,
                                    }}
                                />
                            )}
                            <ListItemButton
                                onClick={() => handleNavigate(item.path)}
                                sx={{
                                    borderRadius: BORDER_RADIUS.lg,
                                    backgroundColor: isActive ? COLORS.sidebar.activeSubtle : 'transparent',
                                    color: isActive ? COLORS.primary.main : COLORS.sidebar.textSecondary,
                                    transition: `all ${TRANSITIONS.duration.normal} ${TRANSITIONS.easing.easeInOut}`,
                                    px: 2,
                                    '&:hover': {
                                        backgroundColor: COLORS.sidebar.hover,
                                        color: COLORS.sidebar.text,
                                        transform: 'translateX(4px)',
                                    },
                                    py: 1.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: 'inherit',
                                        minWidth: 40,
                                        '& svg': {
                                            fontSize: 22,
                                        }
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? TYPOGRAPHY.fontWeight.bold : TYPOGRAPHY.fontWeight.medium,
                                        fontSize: '1rem',
                                        letterSpacing: '0.2px',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Box sx={{ p: 2 }}>
                <StackRowComponent
                    sx={{
                        p: 1.5,
                        borderRadius: BORDER_RADIUS.xl,
                        backgroundColor: COLORS.sidebar.backgroundLight,
                        border: `1px solid rgba(255,255,255,0.05)`,
                        mb: 1,
                    }}
                    spacing={1.5}
                >
                    <Avatar
                        sx={{
                            width: 36,
                            height: 36,
                            backgroundColor: COLORS.primary.main,
                            fontSize: '1rem',
                            fontWeight: TYPOGRAPHY.fontWeight.bold,
                            boxShadow: `0 4px 8px rgba(0,0,0,0.2)`,
                        }}
                    >
                        A
                    </Avatar>
                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: TYPOGRAPHY.fontWeight.bold,
                                fontSize: TYPOGRAPHY.fontSize.sm,
                                color: COLORS.sidebar.text,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            System Admin
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: COLORS.sidebar.textSecondary,
                                fontSize: '0.7rem',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: 'block',
                            }}
                        >
                            {systemStats?.os_pretty_name || 'Linux System'}
                        </Typography>
                    </Box>
                </StackRowComponent>
            </Box>
        </StackColComponent>
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
                    backgroundColor: COLORS.sidebar.background,
                },
            }}
        >
            {sidebarContent}
        </Drawer>
    );
}
