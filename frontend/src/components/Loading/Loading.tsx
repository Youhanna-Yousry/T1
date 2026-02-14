import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './Loading.less';

export default function Loading() {
    const { t } = useTranslation();

    return (
        <Box className="f1-loading-screen">
            <Box className="loading-content">
                <Box className="spinner-wrapper">
                    <CircularProgress
                        size={60}
                        thickness={4}
                        className="f1-spinner"
                    />
                    <Box className="spinner-dot" />
                </Box>

                <Box className="text-wrapper">
                    <Typography variant="h6" className="loading-title">
                        {t('loading.title')}
                    </Typography>
                    <Typography variant="caption" className="loading-subtitle">
                        {t('loading.subtitle')}
                    </Typography>
                </Box>
            </Box>

            <Box className="loading-stripe" />
        </Box>
    );
}