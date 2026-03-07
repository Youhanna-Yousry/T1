import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './Loading.less';

interface LoadingProps {
    fullScreen?: boolean;
}

export default function Loading({ fullScreen = true }: LoadingProps) {
    const { t } = useTranslation();

    return (
        <Box className={`f1-loading-screen ${fullScreen ? 'layout-full' : 'layout-partial'}`}>
            <Box className="loading-content">
                <Box className="spinner-wrapper">
                    <CircularProgress
                        size={fullScreen ? 60 : 40}
                        thickness={4}
                        className="f1-spinner"
                    />
                    <Box className="spinner-dot" />
                </Box>

                <Box className="text-wrapper">
                    <Typography variant={fullScreen ? "h6" : "subtitle1"} className="loading-title">
                        {t('loading.title', 'LOADING')}
                    </Typography>
                    {fullScreen && (
                        <Typography variant="caption" className="loading-subtitle">
                            {t('loading.subtitle', 'CONNECTING TO TELEMETRY')}
                        </Typography>
                    )}
                </Box>
            </Box>

            {fullScreen && <Box className="loading-stripe" />}
        </Box>
    );
}