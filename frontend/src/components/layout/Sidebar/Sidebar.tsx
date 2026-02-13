import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, IconButton } from "@mui/material";
import {
    Dashboard as DashboardIcon, EmojiEvents as TrophyIcon, ChevronLeft as ChevronLeftIcon,
    Menu as MenuIcon, Logout as LogoutIcon
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
    {
        label: "DASHBOARD",
        path: "/dashboard",
        icon: <DashboardIcon />,
        roles: ["STUDENT"]
    },
    {
        label: "LEADERBOARD",
        path: "/leaderboard",
        icon: <TrophyIcon />,
        roles: ["STUDENT"]
    }
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser } = useAuth();
    const [isOpen, setIsOpen] = useState(true);

    if (!user) return null;

    const allowedItems = NAV_ITEMS.filter(item => item.roles.includes(user.role));

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    const onLogout = () => {
        logout();
        setUser(null);
        navigate("/login");
    }

    return (
        <Drawer
            variant="permanent"
            className={`f1-sidebar ${isOpen ? 'open' : 'closed'}`}
        >
            <Box className={`sidebar-header ${!isOpen ? 'closed' : ''}`}>
                <Typography variant="h6" className="brand-text">
                    TAKULA <span className="red-text">1</span>
                </Typography>

                <IconButton onClick={() => setIsOpen(!isOpen)} className="toggle-btn">
                    {isOpen ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
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
                    <ListItemButton onClick={onLogout} className="logout-button">
                        <ListItemIcon className="nav-icon">
                            <LogoutIcon />
                        </ListItemIcon>
                        <Box>
                            <Typography variant="body2" className="user-name">
                                {user.username}
                            </Typography>
                        </Box>
                    </ListItemButton>
                </ListItem>
            </Box>
        </Drawer>
    );
}