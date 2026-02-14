import QRCode from "react-qr-code";
import useAxiosInterceptor from "hooks/useAxiosInterceptor";
import { useAuth } from "context/authContext";
import { Box, Typography, Card } from "@mui/material";
import Loading from "components/Loading/Loading";
import "./RacerCode.less";

export default function RacerCode() {
    useAxiosInterceptor();
    const { user } = useAuth();
    const username = user?.username;

    if (!username) return <Loading />;

    return (
        <Box className="racer-code-page">
            <Card className="code-card">
                <Box className="card-header">
                    <Typography variant="h5" className="header-title">
                        OFFICIAL ENTRY CODE
                    </Typography>
                </Box>

                <Box className="qr-container">
                    <Box className="qr-bg">
                        <QRCode
                            value={username}
                            size={220}
                            fgColor="#000000"
                            bgColor="#ffffff"
                        />
                    </Box>
                </Box>

                <Box className="card-footer">
                    <Typography variant="caption" className="label">DRIVER HANDLE</Typography>
                    <Typography variant="h4" className="username-text">
                        {username}
                    </Typography>
                </Box>
            </Card>
        </Box>
    );
}