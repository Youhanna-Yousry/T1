import { Box, CircularProgress, Typography } from '@mui/material';
import './Loading.less';

export default function Loading() {
    return (
        <Box className="f1-loading-screen">
            <div className="loading-content">
                <div className="spinner-wrapper">
                    <CircularProgress
                        size={60}
                        thickness={4}
                        className="f1-spinner"
                    />
                    <div className="spinner-dot" />
                </div>

                <Box className="text-wrapper">
                    <Typography variant="h6" className="loading-title">
                        SYSTEM INITIALIZING
                    </Typography>
                    <Typography variant="caption" className="loading-subtitle">
                        ESTABLISHING TELEMETRY LINK...
                    </Typography>
                </Box>
            </div>

            <div className="loading-stripe" />
        </Box>
    );
}