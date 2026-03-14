import React, { useState, useEffect } from "react";
import {
    Box, Container, Grid, Typography, Stack, Paper, Alert
} from "@mui/material";
import { SelectInput } from "components/form/SelectInput";
import { AutocompleteInput } from "components/form/AutocompleteInput";
import { useTranslation } from "react-i18next";
import { getTranslatedEventName } from "utils/translationUtils";
import { SubmitButton } from "components/form/submitButton/SubmitButton";
import { TextInput } from "components/form/TextInput";
import { getEvents, markAttendance, searchStudents, EventSummary } from "services/servantService";
import UseAxiosInterceptor from "hooks/useAxiosInterceptor";
import Loading from "components/loading/Loading";

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
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'warning', msg: string } | null>(null);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await getEvents(false);
                setEvents(data);
            } catch (error) {
                setFeedback({ type: 'error', msg: t("shared_msgs.error_loading") });
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
        setFeedback(null);

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
        const submittedName = inputValue.trim();
        if (!selectedEventId || !submittedName || isPointsInvalid) return;

        setSubmitting(true);
        setFeedback(null);

        try {
            await markAttendance(Number(selectedEventId), submittedName, Number(customPoints));

            setFeedback({ type: 'success', msg: t("shared_msgs.success", { name: submittedName }) });
            setUsername(null);
            setInputValue("");
        } catch (error: any) {
            const status = error?.response?.status;

            if (status === 409) {
                setFeedback({ type: 'warning', msg: t("shared_msgs.duplicate", { name: submittedName }) });
            } else if (status === 400) {
                setFeedback({ type: 'error', msg: t("shared_msgs.not_found", { name: submittedName }) });
            } else {
                setFeedback({ type: 'error', msg: t("shared_msgs.sys_fail") });
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loading />;

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
                                <SelectInput
                                    id="event-select"
                                    label={`📋 ${t("manual_scoring.select_event")}`}
                                    value={selectedEventId}
                                    emptyLabel={t("manual_scoring.none")}
                                    disabled={loading}
                                    onChange={(val) => handleEventChange(Number(val))}
                                    options={events.map(event => ({
                                        value: event.id,
                                        label: `${getTranslatedEventName(event.name, t)} (${event.points} pts)`
                                    }))}
                                />

                                <AutocompleteInput
                                    id="user-search"
                                    label={`👤 ${t("login.username")}`}
                                    value={username}
                                    inputValue={inputValue}
                                    options={userOptions}
                                    loading={isSearching}
                                    onChange={(val) => {
                                        setUsername(val);
                                        setFeedback(null);
                                    }}
                                    onInputChange={(val) => {
                                        setInputValue(val);
                                        setFeedback(null);
                                    }}
                                />

                                <TextInput
                                    id="points"
                                    label={selectedEventId ? `${t("manual_scoring.points")} (Max: ${maxPoints})` : t("manual_scoring.points")}
                                    value={String(customPoints)}
                                    onChange={(val) => {
                                        setCustomPoints(Number(val));
                                        setFeedback(null);
                                    }}
                                    error={isPointsInvalid}
                                />

                                <Box mt={1}>
                                    <SubmitButton
                                        loading={submitting}
                                        disabled={!selectedEventId || !inputValue.trim() || submitting || isPointsInvalid}
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