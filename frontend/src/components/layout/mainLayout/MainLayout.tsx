import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, useMediaQuery, useTheme, AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import Sidebar from "../sidebar/Sidebar";
import "./MainLayout.less";

export default function MainLayout() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box className="layout-root">
            {isMobile && (
                <AppBar position="fixed" className="mobile-app-bar">
                    <Toolbar>
                        <IconButton
                            edge="start"
                            onClick={handleDrawerToggle}
                            className="menu-button"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className="brand-text">
                            TAKYULA <Box component="span" className="brand-accent">1</Box>
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}

            <Sidebar
                mobileOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />

            <Box component="main" className="main-content">
                <Outlet />
            </Box>
        </Box>
    );
}