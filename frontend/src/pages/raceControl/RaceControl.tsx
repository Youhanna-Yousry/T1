import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
    Box, Container, Grid, Typography, Paper, Stack, Snackbar, Alert, Chip
} from "@mui/material";
import { History as HistoryIcon, Flag as FlagIcon } from "@mui/icons-material";
import useAxiosInterceptor from "hooks/useAxiosInterceptor";
import { useTranslation } from "react-i18next";
import { getTranslatedEventName } from "utils/translationUtils";
import Loading from "components/loading/Loading";

import { SelectInput } from "components/form/selectInput/SelectInput";
import { getEvents, EventSummary, markAttendance } from "services/servantService";
import "./RaceControl.less";

type ScanStatus = "USER_REGISTERED_SUCCESSFULLY" | "USER_NOT_FOUND" | "USER_ALREADY_REGISTERED";

interface ScanLog {
    id: number;
    username: string;
    timestamp: string;
    status: ScanStatus;
}

export default function RaceControl() {
    useAxiosInterceptor();
    const { t } = useTranslation();

    const [events, setEvents] = useState<EventSummary[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<EventSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [scanLogs, setScanLogs] = useState<ScanLog[]>([]);
    const [isPaused, setIsPaused] = useState(false);

    const [notification, setNotification] = useState<{ open: boolean, message: string, severity: "success" | "error" | "warning" }>({
        open: false, message: "", severity: "success"
    });

    useEffect(() => {
        getEvents(true)
            .then(data => setEvents(data))
            .catch(() => showNotification(t("shared_msgs.sys_fail"), "error"))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEventChange = (val: string | number) => {
        const eventId = Number(val);
        const eventObj = events.find(ev => ev.id === eventId) || null;
        setSelectedEvent(eventObj);
        setScanLogs([]);
    };

    const handleScan = async (results: any[]) => {
        if (isPaused || !results || results.length === 0) return;

        const rawValue = results[0].rawValue;
        if (!rawValue) return;

        const alreadyScannedInSession = scanLogs.some(log => log.username === rawValue);

        if (alreadyScannedInSession) {
            setIsPaused(true);
            showNotification(t("race_control.msgs.already_scanned", { name: rawValue }), "warning");
            setTimeout(() => setIsPaused(false), 2000);
            return;
        }

        if (!selectedEvent) {
            setIsPaused(true);
            showNotification(t("race_control.msgs.safety_car"), "warning");
            setTimeout(() => setIsPaused(false), 2000);
            return;
        }

        setIsPaused(true);
        const newLogId = Date.now();

        try {
            await markAttendance(selectedEvent.id, rawValue, selectedEvent.points);

            logScan(newLogId, rawValue, "USER_REGISTERED_SUCCESSFULLY");
            showNotification(t("shared_msgs.success", { name: rawValue }), "success");

        } catch (error: any) {
            const status = error?.response?.status;

            if (status === 409) {
                logScan(newLogId, rawValue, "USER_ALREADY_REGISTERED");
                showNotification(t("shared_msgs.duplicate", { name: rawValue }), "warning");
            } else if (status === 400) {
                logScan(newLogId, rawValue, "USER_NOT_FOUND");
                showNotification(t("shared_msgs.not_found", { name: rawValue }), "error");
            } else {
                showNotification(t("shared_msgs.sys_fail"), "error");
            }
        } finally {
            setTimeout(() => { setIsPaused(false); }, 2000);
        }
    };

    const logScan = (id: number, username: string, status: ScanStatus) => {
        setScanLogs(prev => [{
            id,
            username,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            status
        }, ...prev].slice(0, 15));
    };

    const showNotification = (message: string, severity: "success" | "error" | "warning") => {
        setNotification({ open: true, message, severity });
    };

    if (loading) return <Loading />;

    return (
        <Box className="race-control-page">
            <Container maxWidth="xl" className="race-container">
                <Box className="control-header content-wrapper">
                    <Box>
                        <Typography variant="h4" className="page-title">
                            {t("race_control.title").split(' ')[0]} <span className="red-text">{t("race_control.title").split(' ').slice(1).join(' ')}</span>
                        </Typography>
                    </Box>
                    <Chip
                        icon={<FlagIcon />}
                        label={selectedEvent ? t("race_control.session_active") : t("race_control.pit_lane_open")}
                        color={selectedEvent ? "success" : "warning"}
                        className="status-chip"
                    />
                </Box>

                <Grid container spacing={3} className="content-wrapper" justifyContent="center">
                    <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                        <Stack spacing={3}>
                            <Paper className="control-panel">
                                <Typography variant="h6" className="panel-title">{t("race_control.session_config")}</Typography>
                                <SelectInput
                                    id="race-control-event-select"
                                    label={`🏁 ${t("race_control.select_event_label")}`}
                                    value={selectedEvent ? selectedEvent.id : ''}
                                    emptyLabel={t("race_control.select_event_placeholder")}
                                    onChange={handleEventChange}
                                    options={events.map(e => ({
                                        value: e.id,
                                        label: getTranslatedEventName(e.name, t)
                                    }))}
                                />
                            </Paper>

                            <Paper className="telemetry-panel">
                                <Box className="panel-header">
                                    <Typography variant="h6" className="panel-title">{t("race_control.live_timing")}</Typography>
                                    <HistoryIcon fontSize="small" sx={{ opacity: 0.5 }} />
                                </Box>
                                <Box className="log-container">
                                    {scanLogs.length === 0 && (
                                        <Box className="empty-state">
                                            <Typography variant="body2">{t("race_control.waiting_drivers")}</Typography>
                                        </Box>
                                    )}
                                    {scanLogs.map(log => (
                                        <Box
                                            key={log.id}
                                            className={`log-row ${log.status === "USER_REGISTERED_SUCCESSFULLY" ? 'success' :
                                                log.status === "USER_ALREADY_REGISTERED" ? 'error' : 'warning'
                                                }`}
                                        >
                                            <Box className="log-info">
                                                <Typography variant="body2" className="driver-id">{log.username}</Typography>
                                                <Typography variant="caption" className="log-msg">
                                                    {t(`race_control.log_status.${log.status}`)}
                                                </Typography>
                                            </Box>
                                            <Box className="log-meta">
                                                <Typography variant="caption">{log.timestamp}</Typography>
                                                <Box className={`status-led ${log.status === "USER_REGISTERED_SUCCESSFULLY" ? 'success' :
                                                    log.status === "USER_ALREADY_REGISTERED" ? 'error' : 'warning'
                                                    }`} />
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Paper>
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                        <Paper className="camera-frame">
                            <Box className="camera-header">
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Box className="rec-dot" />
                                    <Typography variant="subtitle2" sx={{ letterSpacing: 2 }}>{t("race_control.onboard_cam")}</Typography>
                                </Box>
                                <Chip
                                    label={isPaused ? t("race_control.processing") : t("race_control.live")}
                                    size="small"
                                    className={`cam-status ${isPaused ? 'paused' : 'live'}`}
                                />
                            </Box>

                            <Box className="scanner-wrapper">
                                <Scanner
                                    onScan={handleScan}
                                    allowMultiple={true}
                                    scanDelay={300}
                                    components={{ torch: true, zoom: true }}
                                    sound={false}
                                    styles={{ container: { width: '100%', height: '100%' }, video: { objectFit: 'cover' } }}
                                />
                                <Box className="hud-overlay">
                                    <div className="crosshair" />
                                    <div className="corner tl" /> <div className="corner tr" />
                                    <div className="corner bl" /> <div className="corner br" />
                                    {!selectedEvent && (
                                        <Box className="warning-overlay">
                                            <Typography variant="h5">{t("race_control.scanner_warning")}</Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <Snackbar
                open={notification.open}
                autoHideDuration={2500}
                onClose={() => setNotification(p => ({ ...p, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}