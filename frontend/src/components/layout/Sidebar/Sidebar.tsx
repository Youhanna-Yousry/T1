import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
    ListItemText, Typography, Divider, IconButton, useMediaQuery, useTheme
} from "@mui/material";
import {
    Dashboard as DashboardIcon, EmojiEvents as TrophyIcon, ChevronLeft as ChevronLeftIcon,
    Logout as LogoutIcon,
    QrCode2Outlined,
} from "@mui/icons-material";
import { useAuth } from "context/authContext";
import { logout } from "services/authService";

import "./Sidebar.less";

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
    roles: ("SERVANT" | "STUDENT")[];
}

const NAV_ITEMS: NavItem[] = [
    { label: "DASHBOARD", path: "/dashboard", icon: <DashboardIcon />, roles: ["STUDENT"] },
    { label: "LEADERBOARD", path: "/leaderboard", icon: <TrophyIcon />, roles: ["STUDENT"] },
    { label: "RACE CONTROL", path: "/race-control", icon: <QrCode2Outlined />, roles: ["SERVANT"] },
];

interface SidebarProps {
    mobileOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser } = useAuth();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [isDesktopOpen, setIsDesktopOpen] = useState(true);

    if (!user) return null;

    const allowedItems = NAV_ITEMS.filter(item => item.roles.includes(user.role));

    const handleNavigate = (path: string) => {
        navigate(path);
        if (isMobile) onClose();
    };

    const onLogout = () => {
        logout().then(() => {
            setUser(null);
            navigate("/login");
        });
    };

    const isOpen = isMobile ? mobileOpen : isDesktopOpen;

    return (
        <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={isOpen}
            onClose={onClose}
            className={`f1-sidebar ${isOpen ? 'open' : 'closed'} ${isMobile ? 'mobile' : ''}`}
            ModalProps={{ keepMounted: true }}
        >
            <Box className={`sidebar-header ${!isOpen && !isMobile ? 'closed' : ''}`}>
                <Typography variant="h6" className="brand-text">
                    TAKYULA <span className="red-text">1</span>
                </Typography>

                {!isMobile && (
                    <IconButton onClick={() => setIsDesktopOpen(!isDesktopOpen)} className="toggle-btn">
                        <ChevronLeftIcon sx={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: '0.3s' }} />
                    </IconButton>
                )}
            </Box>

            <Divider className="sidebar-divider" />

            <List className="nav-list">
                {allowedItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.path} disablePadding className="nav-item">
                            <ListItemButton
                                onClick={() => handleNavigate(item.path)}
                                className={`nav-button ${isActive ? 'active' : ''}`}
                            >
                                <ListItemIcon className="nav-icon">{item.icon}</ListItemIcon>
                                <ListItemText primary={item.label} className="nav-text" />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Box className="sidebar-footer">
                <Divider className="sidebar-divider" />
                <ListItem disablePadding>
                    <ListItemButton onClick={onLogout} className="logout-button">
                        <ListItemIcon className="nav-icon"><LogoutIcon /></ListItemIcon>
                        <Box>
                            <Typography variant="body2" className="user-name">
                                Logout
                            </Typography>
                        </Box>
                    </ListItemButton>
                </ListItem>
            </Box>
        </Drawer>
    );
}