import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
    Box, Container, Grid, Typography, Select, MenuItem,
    FormControl, InputLabel, Paper, Stack, Snackbar, Alert, Chip, SelectChangeEvent
} from "@mui/material";
import { History as HistoryIcon, Flag as FlagIcon } from "@mui/icons-material";
import useAxiosInterceptor from "hooks/useAxiosInterceptor";
import Loading from "components/Loading/Loading";

import { getEvents, EventInfo, markAttendance } from "services/servantService";
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

    const [events, setEvents] = useState<EventInfo[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<EventInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [scanLogs, setScanLogs] = useState<ScanLog[]>([]);
    const [isPaused, setIsPaused] = useState(false);

    const [notification, setNotification] = useState<{ open: boolean, message: string, severity: "success" | "error" | "warning" }>({
        open: false, message: "", severity: "success"
    });

    useEffect(() => {
        getEvents(true)
            .then(data => setEvents(data))
            .catch(() => showNotification("Failed to load events", "error"))
            .finally(() => setLoading(false));
    }, []);

    const handleEventChange = (e: SelectChangeEvent<string>) => {
        const eventId = Number(e.target.value);
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
            showNotification(`ALREADY SCANNED IN SESSION: ${rawValue}`, "warning");
            setTimeout(() => setIsPaused(false), 2000);
            return;
        }

        if (!selectedEvent) {
            setIsPaused(true);
            showNotification("SAFETY CAR: Please select an event first!", "warning");
            setTimeout(() => setIsPaused(false), 2000);
            return;
        }

        setIsPaused(true);
        const newLogId = Date.now();

        try {
            const statusString = await markAttendance(selectedEvent.id, rawValue, selectedEvent.weight) as ScanStatus;

            if (statusString === "USER_REGISTERED_SUCCESSFULLY") {
                logScan(newLogId, rawValue, statusString);
                showNotification(`Checked In: ${rawValue}`, "success");
            }
            else if (statusString === "USER_ALREADY_REGISTERED") {
                logScan(newLogId, rawValue, statusString);
                showNotification(`Duplicate: ${rawValue}`, "error");
            }
            else if (statusString === "USER_NOT_FOUND") {
                logScan(newLogId, rawValue, statusString);
                showNotification(`User Not Found: ${rawValue}`, "warning");
            }
            else {
                showNotification(`Unknown Response: ${JSON.stringify(statusString)}`, "error");
            }

        } catch (error) {
            showNotification("SYSTEM FAILURE: Network Error", "error");
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
                            RACE <span className="red-text">CONTROL</span>
                        </Typography>
                    </Box>
                    <Chip
                        icon={<FlagIcon />}
                        label={selectedEvent ? "SESSION ACTIVE" : "PIT LANE OPEN"}
                        color={selectedEvent ? "success" : "warning"}
                        className="status-chip"
                    />
                </Box>

                <Grid
                    container
                    spacing={3}
                    className="content-wrapper"
                    justifyContent="center"
                >
                    <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                        <Stack spacing={3}>
                            <Paper className="control-panel">
                                <Typography variant="h6" className="panel-title">SESSION CONFIG</Typography>
                                <FormControl fullWidth variant="filled" className="f1-input">
                                    <InputLabel>🏁 SELECT EVENT</InputLabel>
                                    <Select
                                        value={selectedEvent ? String(selectedEvent.id) : ''}
                                        onChange={handleEventChange}
                                        MenuProps={{ className: 'f1-menu-popover' }}
                                    >
                                        <MenuItem value=""><em>Select Event...</em></MenuItem>
                                        {events.map(e => (
                                            <MenuItem key={e.id} value={String(e.id)}>{e.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Paper>

                            <Paper className="telemetry-panel">
                                <Box className="panel-header">
                                    <Typography variant="h6" className="panel-title">LIVE TIMING</Typography>
                                    <HistoryIcon fontSize="small" sx={{ opacity: 0.5 }} />
                                </Box>
                                <Box className="log-container">
                                    {scanLogs.length === 0 && (
                                        <Box className="empty-state">
                                            <Typography variant="body2">WAITING FOR DRIVERS...</Typography>
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
                                                    {log.status.replace(/_/g, " ")}
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
                                    <Typography variant="subtitle2" sx={{ letterSpacing: 2 }}>ONBOARD CAM_1</Typography>
                                </Box>
                                <Chip
                                    label={isPaused ? "PROCESSING..." : "LIVE"}
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
                                            <Typography variant="h5">SELECT EVENT TO ENABLE SCANNER</Typography>
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