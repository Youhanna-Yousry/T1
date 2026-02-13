// import { useState, useEffect } from "react";
// import { QrReader } from "react-qr-reader";
// import { Box, Container, Grid, Typography, Select, MenuItem, 
//     FormControl, InputLabel, Paper, Chip, Stack, IconButton, Alert, Snackbar 
// } from "@mui/material";
// import { 
//     Cameraswitch as CameraIcon, 
//     History as HistoryIcon, 
//     Flag as FlagIcon,
//     AccessTime as TimeIcon
// } from "@mui/icons-material";
// import Loading from "components/Loading";
// import useAxiosInterceptor from "hooks/useAxiosInterceptor";
// import { getEvents, markAttendance, getWeeks } from "services/servantRaceControllerService"; 
// import "./RaceControl.less";

// // Types
// interface ScanLog {
//     id: number;
//     studentEmail: string;
//     timestamp: string;
//     status: "SUCCESS" | "ERROR";
//     message: string;
// }

// export default function RaceControl() {
//     useAxiosInterceptor();
    
//     // --- State ---
//     const [events, setEvents] = useState<any[]>([]);
//     const [weeks, setWeeks] = useState<any[]>([]);
    
//     // Selection State
//     const [selectedEvent, setSelectedEvent] = useState<string>("");
//     const [selectedWeek, setSelectedWeek] = useState<string>("CURRENT"); // 'CURRENT' or specific ID
    
//     // Scanner State
//     const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
//     const [scanLogs, setScanLogs] = useState<ScanLog[]>([]);
//     const [lastScanned, setLastScanned] = useState<string | null>(null);
    
//     // Feedback State
//     const [notification, setNotification] = useState<{open: boolean, message: string, severity: "success" | "error"}>({
//         open: false, message: "", severity: "success"
//     });

//     // --- Init ---
//     useEffect(() => {
//         // Fetch available events and weeks on mount
//         // You would replace this with your actual API calls
//         // Promise.all([getEvents(), getWeeks()]).then(...)
        
//         // Mock Data for visualization
//         setEvents([
//             { id: 1, name: "Service Liturgy" },
//             { id: 2, name: "Sunday School" },
//             { id: 3, name: "Vespers" },
//         ]);
//         setWeeks([
//             { id: 101, name: "Week 1: Preparation" },
//             { id: 102, name: "Week 2: Qualifying" },
//         ]);
//     }, []);

//     // --- Handlers ---
    
//     const handleScan = async (result: any, error: any) => {
//         if (result) {
//             const email = result?.text;
            
//             // Prevent spamming the same code instantly
//             if (email === lastScanned) return; 
//             setLastScanned(email);

//             // 1. Validation
//             if (!selectedEvent) {
//                 showNotification("⚠️ SAFETY CAR: Please select an event first!", "error");
//                 return;
//             }

//             // 2. Optimistic UI Update (Add to log as "Processing")
//             const newLogId = Date.now();
            
//             try {
//                 // 3. API Call
//                 // await markAttendance(selectedEvent, selectedWeek, email);
                
//                 // Mock Success
//                 logScan(newLogId, email, "SUCCESS", "Sector time recorded");
//                 showNotification(`✅ ATTENDANCE MARKED: ${email}`, "success");

//                 // Reset last scanned after 3 seconds so they can scan again if needed
//                 setTimeout(() => setLastScanned(null), 3000);

//             } catch (err) {
//                 logScan(newLogId, email, "ERROR", "Driver not found or duplicate");
//                 showNotification("❌ RED FLAG: Failed to mark attendance", "error");
//                 setLastScanned(null); // Allow immediate retry on error
//             }
//         }
//     };

//     const logScan = (id: number, email: string, status: "SUCCESS" | "ERROR", message: string) => {
//         setScanLogs(prev => [{
//             id, 
//             studentEmail: email, 
//             timestamp: new Date().toLocaleTimeString(), 
//             status, 
//             message
//         }, ...prev].slice(0, 10)); // Keep last 10
//     };

//     const showNotification = (message: string, severity: "success" | "error") => {
//         setNotification({ open: true, message, severity });
//     };

//     return (
//         <Box className="race-control-page">
//             <Container maxWidth="lg">
                
//                 <Box className="control-header">
//                     <Typography variant="h4" className="page-title">
//                         RACE <span className="red-text">CONTROL</span>
//                     </Typography>
//                     <Chip 
//                         icon={<FlagIcon />} 
//                         label={selectedEvent ? "SESSION ACTIVE" : "PIT LANE OPEN"} 
//                         color={selectedEvent ? "success" : "warning"}
//                         className="status-chip"
//                     />
//                 </Box>

//                 <Grid container spacing={3}>
//                     <Grid size={{ xs: 12, md: 5 }}>
//                         <Paper className="control-panel">
//                             <Typography variant="h6" className="panel-title">SESSION SETUP</Typography>
                            
//                             <Stack spacing={3}>
//                                 <FormControl fullWidth variant="filled" className="f1-input">
//                                     <InputLabel>🏁 SELECT EVENT (GRAND PRIX)</InputLabel>
//                                     <Select
//                                         value={selectedEvent}
//                                         onChange={(e) => setSelectedEvent(e.target.value)}
//                                     >
//                                         {events.map(e => (
//                                             <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>
//                                         ))}
//                                     </Select>
//                                 </FormControl>

//                                 <FormControl fullWidth variant="filled" className="f1-input">
//                                     <InputLabel>⏱️ SELECT WEEK (LAP)</InputLabel>
//                                     <Select
//                                         value={selectedWeek}
//                                         onChange={(e) => setSelectedWeek(e.target.value)}
//                                     >
//                                         <MenuItem value="CURRENT">⚡ CURRENT WEEK (LIVE)</MenuItem>
//                                         {weeks.map(w => (
//                                             <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>
//                                         ))}
//                                     </Select>
//                                 </FormControl>
//                             </Stack>
//                         </Paper>

//                         {/* Recent Scans (Telemetry) */}
//                         <Paper className="telemetry-panel">
//                             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//                                 <Typography variant="h6" className="panel-title">TELEMETRY LOG</Typography>
//                                 <HistoryIcon className="icon-muted" />
//                             </Box>
                            
//                             <Stack spacing={1}>
//                                 {scanLogs.length === 0 && (
//                                     <Typography className="no-data-text">Waiting for data...</Typography>
//                                 )}
//                                 {scanLogs.map(log => (
//                                     <Box key={log.id} className={`log-row ${log.status.toLowerCase()}`}>
//                                         <Box>
//                                             <Typography variant="body2" className="log-email">
//                                                 {log.studentEmail.split('@')[0]}
//                                             </Typography>
//                                             <Typography variant="caption" className="log-msg">
//                                                 {log.message}
//                                             </Typography>
//                                         </Box>
//                                         <Box textAlign="right">
//                                             <Typography variant="caption" className="log-time">
//                                                 {log.timestamp}
//                                             </Typography>
//                                             <Box className={`status-dot ${log.status.toLowerCase()}`} />
//                                         </Box>
//                                     </Box>
//                                 ))}
//                             </Stack>
//                         </Paper>
//                     </Grid>

//                     {/* Right Column: Camera Feed */}
//                     <Grid item xs={12} md={7}>
//                         <Paper className="camera-frame">
//                             <Box className="camera-header">
//                                 <Box display="flex" alignItems="center" gap={1}>
//                                     <Box className="recording-dot" />
//                                     <Typography variant="subtitle2">ONBOARD CAM_01</Typography>
//                                 </Box>
//                                 <IconButton onClick={() => setFacingMode(prev => prev === "user" ? "environment" : "user")}>
//                                     <CameraIcon className="camera-icon" />
//                                 </IconButton>
//                             </Box>
                            
//                             <Box className="camera-viewport">
//                                 {/* The Scanner Component */}
//                                 <QrReader
//                                     constraints={{ facingMode: facingMode }}
//                                     onResult={handleScan}
//                                     containerStyle={{ width: '100%', height: '100%' }}
//                                     videoStyle={{ objectFit: 'cover' }}
//                                     scanDelay={500}
//                                 />
                                
//                                 {/* Overlay Graphics */}
//                                 <Box className="scanner-overlay">
//                                     <Box className="corner tl" />
//                                     <Box className="corner tr" />
//                                     <Box className="corner bl" />
//                                     <Box className="corner br" />
//                                 </Box>
//                             </Box>

//                             <Box className="camera-footer">
//                                 <Typography variant="caption">
//                                     SCANNING FOR DRIVER ID (QR CODE)...
//                                 </Typography>
//                             </Box>
//                         </Paper>
//                     </Grid>
//                 </Grid>
//             </Container>

//             <Snackbar 
//                 open={notification.open} 
//                 autoHideDuration={4000} 
//                 onClose={() => setNotification(p => ({...p, open: false}))}
//                 anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//             >
//                 <Alert severity={notification.severity} variant="filled">
//                     {notification.message}
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// }