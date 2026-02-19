import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
    ListItemText, Typography, Divider, IconButton, useMediaQuery, useTheme
} from "@mui/material";
import {
    Dashboard as DashboardIcon, ChevronLeft as ChevronLeftIcon,
    Logout as LogoutIcon,
    QrCode2Outlined,
    Translate as TranslateIcon,
    FlagOutlined,
    PostAdd as PostAddIcon,
    EmojiEvents as TrophyIcon
} from "@mui/icons-material";
import { useAuth } from "context/authContext";
import { logout } from "services/authService";

import "./Sidebar.less";

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
    roles: ("SERVANT" | "STUDENT" | "SUPER_SERVANT")[];
}

interface SidebarProps {
    mobileOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser } = useAuth();
    const { t, i18n } = useTranslation();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [isDesktopOpen, setIsDesktopOpen] = useState(true);

    const isOpen = isMobile ? mobileOpen : isDesktopOpen;

    useEffect(() => {
        document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    }, [i18n.language]);

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
    };

    const navItems = useMemo<NavItem[]>(() => [
        {
            label: t("sidebar.dashboard"),
            path: "/dashboard",
            icon: <DashboardIcon />,
            roles: ["STUDENT"]
        },
        {
            label: t("sidebar.racer_code"),
            path: "/racer-code",
            icon: <QrCode2Outlined />,
            roles: ["STUDENT"]
        },
        {
            label: t("sidebar.manual_scoring"),
            path: "/manual-scoring",
            icon: <PostAddIcon />,
            roles: ["SUPER_SERVANT"]
        },
        {
            label: t("sidebar.race_control"),
            path: "/race-control",
            icon: <FlagOutlined />,
            roles: ["SERVANT", "SUPER_SERVANT"]
        },
        {
            label: t("sidebar.drivers_championship"),
            path: "/drivers-championship",
            icon: <TrophyIcon />,
            roles: ["STUDENT", "SERVANT", "SUPER_SERVANT"]
        }
    ], [t]);

    if (!user) return null;

    const allowedItems = navItems.filter(item => item.roles.includes(user.role));

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

    return (
        <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={isOpen}
            onClose={onClose}
            anchor={isMobile && i18n.language === 'ar' ? 'right' : 'left'}
            className={`f1-sidebar ${isOpen ? 'open' : 'closed'}`}
            ModalProps={{ keepMounted: true }}
        >
            <Box className="sidebar-header">
                <Typography variant="h6" className="brand-text">
                    TAKYULA <Box component="span" className="red-text">1</Box>
                </Typography>

                {!isMobile && (
                    <IconButton onClick={() => setIsDesktopOpen(!isDesktopOpen)} className="toggle-btn">
                        <ChevronLeftIcon className="toggle-icon" />
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
                                <ListItemIcon className="nav-icon">
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label} className="nav-text" />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Box className="sidebar-footer">
                <Divider className="sidebar-divider" />

                <ListItem disablePadding>
                    <ListItemButton onClick={toggleLanguage} className="nav-button">
                        <ListItemIcon className="nav-icon"><TranslateIcon /></ListItemIcon>
                        <Box className="footer-text-wrapper">
                            <Typography variant="body2" className="user-name">
                                {t("sidebar.switch_lang")}
                            </Typography>
                        </Box>
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton onClick={onLogout} className="logout-button nav-button">
                        <ListItemIcon className="nav-icon"><LogoutIcon /></ListItemIcon>
                        <Box className="footer-text-wrapper">
                            <Typography variant="body2" className="user-name">
                                {t("sidebar.logout")}
                            </Typography>
                        </Box>
                    </ListItemButton>
                </ListItem>
            </Box>
        </Drawer>
    );
}