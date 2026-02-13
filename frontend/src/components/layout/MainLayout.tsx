import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar/Sidebar";

export default function MainLayout() {
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minHeight: '100vh',
                    backgroundColor: '#f2f2f2',
                    width: '100%'
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}