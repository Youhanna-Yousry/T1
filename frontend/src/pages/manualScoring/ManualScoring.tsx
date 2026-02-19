import React, { useState, useEffect } from "react";
import {
    Box, Container, Grid, Typography, Stack, MenuItem, Paper,
    Select, FormControl, InputLabel, Alert, Autocomplete, TextField, CircularProgress
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { getTranslatedEventName } from "utils/translationUtils";
import { SubmitButton } from "components/form/submitButton/SubmitButton";
import { TextInput } from "components/form/textInput/TextInput";
import { getEvents, markAttendance, searchStudents, EventSummary } from "services/servantService";
import UseAxiosInterceptor from "hooks/useAxiosInterceptor";

import "./ManualScoring.less";

export default function ManualScoring() {
    UseAxiosInterceptor();
    const { t } = useTranslation();

    const [selectedEventId, setSelectedEventId] = useState<number | "">("");
    const [customPoints, setCustomPoints] = useState<number>(0);

    const [username, setUsername] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [userOptions, setUserOptions] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const [events, setEvents] = useState<EventSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'warning', msg: string } | null>(null);

    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true);
            try {
                const data = await getEvents(false);
                setEvents(data);
            } catch (error) {
                setFeedback({ type: 'error', msg: t("manual_scoring.msgs.error_loading") });
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, [t]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (inputValue.length > 1) {
                setIsSearching(true);
                try {
                    const results = await searchStudents(inputValue);
                    setUserOptions(results);
                } catch (error) {
                    setUserOptions([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setUserOptions([]);
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [inputValue]);

    const handleEventChange = (eventId: number) => {
        setSelectedEventId(eventId);
        const event = events.find(e => e.id === eventId);
        if (event) {
            setCustomPoints(event.points);
        }
    };

    const selectedEventObj = events.find(e => e.id === selectedEventId);
    const maxPoints = selectedEventObj ? selectedEventObj.points : 0;
    const isPointsInvalid = isNaN(customPoints) || customPoints <= 0 || (selectedEventId !== "" && customPoints > maxPoints);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEventId || !username || isPointsInvalid) return;

        setSubmitting(true);
        setFeedback(null);

        try {
            const statusString = await markAttendance(Number(selectedEventId), username, Number(customPoints));

            if (statusString === "USER_REGISTERED_SUCCESSFULLY") {
                setFeedback({ type: 'success', msg: t("manual_scoring.msgs.success_added") });
                setUsername(null);
                setInputValue("");
            } else if (statusString === "USER_ALREADY_REGISTERED") {
                setFeedback({ type: 'warning', msg: t("manual_scoring.msgs.error_conflict") });
            } else if (statusString === "USER_NOT_FOUND") {
                setFeedback({ type: 'error', msg: t("manual_scoring.msgs.error_user_not_found") });
            } else {
                setFeedback({ type: 'error', msg: t("manual_scoring.msgs.error_generic") });
            }
        } catch (err) {
            setFeedback({ type: 'error', msg: t("manual_scoring.msgs.error_generic") });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box className="manual-scoring-page">
            <Container maxWidth="xl" className="scoring-container">
                <Box className="control-header content-wrapper">
                    <Box>
                        <Typography variant="h4" className="page-title">
                            {t("manual_scoring.title_first")} <span className="red-text">{t("manual_scoring.title_second")}</span>
                        </Typography>
                    </Box>
                </Box>

                <Grid container spacing={3} className="content-wrapper" justifyContent="center">
                    <Grid size={{ xs: 12, md: 8, lg: 6 }}>
                        <Paper className="control-panel" component="form" onSubmit={handleSubmit}>
                            <Typography variant="h6" className="panel-title">
                                {t("manual_scoring.subtitle")}
                            </Typography>

                            {feedback && (
                                <Alert
                                    severity={feedback.type}
                                    className={`scoring-alert alert-${feedback.type}`}
                                    sx={{ mb: 3 }}
                                >
                                    {feedback.msg}
                                </Alert>
                            )}

                            <Stack spacing={3}>
                                <FormControl fullWidth variant="filled" className="f1-input">
                                    <InputLabel>📋 {t("manual_scoring.select_event")}</InputLabel>
                                    <Select
                                        value={selectedEventId}
                                        onChange={(e) => handleEventChange(Number(e.target.value))}
                                        disabled={loading}
                                        MenuProps={{ PaperProps: { className: 'f1-menu-popover' } }}
                                    >
                                        <MenuItem value=""><em>{t("manual_scoring.none")}</em></MenuItem>
                                        {events.map((event) => (
                                            <MenuItem key={event.id} value={event.id}>
                                                {getTranslatedEventName(event.name, t)} ({event.points} pts)
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Autocomplete
                                    freeSolo
                                    options={userOptions}
                                    value={username}
                                    onChange={(event, newValue) => setUsername(newValue)}
                                    inputValue={inputValue}
                                    onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                                    loading={isSearching}
                                    slotProps={{
                                        paper: { className: 'f1-menu-popover' },
                                        listbox: { className: 'f1-autocomplete-listbox' }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={`👤 ${t("login.username")}`}
                                            variant="filled"
                                            className="f1-input"
                                            slotProps={{
                                                input: {
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <React.Fragment>
                                                            {isSearching ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </React.Fragment>
                                                    ),
                                                },
                                                htmlInput: {
                                                    ...params.inputProps,
                                                }
                                            }}
                                        />
                                    )}
                                />

                                <TextInput
                                    id="points"
                                    label={selectedEventId ? `${t("manual_scoring.points")} (Max: ${maxPoints})` : t("manual_scoring.points")}
                                    value={String(customPoints)}
                                    onChange={(val) => setCustomPoints(Number(val))}
                                    error={isPointsInvalid}
                                />

                                <Box mt={1}>
                                    <SubmitButton
                                        loading={submitting}
                                        disabled={!selectedEventId || !username || submitting || isPointsInvalid}
                                        text={submitting ? t("login.loading") : t("manual_scoring.submit_points")}
                                    />
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}