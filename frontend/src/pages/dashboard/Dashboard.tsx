import { useState, useEffect, useRef } from "react";
import useAxiosInterceptor from "hooks/useAxiosInterceptor";
import { useTranslation } from "react-i18next";
import { getTranslatedEventName, getTranslatedCompetitionName } from "utils/translationUtils";
import { Container, Grid, Typography, Box, Card, Stack, Divider, Chip } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import {
    getDashboardHeader, DashboardHeader,
    getWeeklyProgress, WeeklyProgress
} from "services/studentService";
import { getFinishedRounds, WeekSummary } from "services/championshipService";

import Loading from "components/loading/Loading";
import { SelectInput } from "components/form/selectInput/SelectInput";

import "./Dashboard.less";

import MercedesLogo from "assets/teams/mercedes.png";
import McLarenLogo from "assets/teams/mclaren.png";
import RedBullLogo from "assets/teams/redbull.png";

const TEAM_LOGOS: Record<string, string> = {
    "MER": MercedesLogo,
    "MCL": McLarenLogo,
    "RBR": RedBullLogo,
};

const getDriverCode = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName.substring(0, 2)}`.toUpperCase();
};

export default function Dashboard() {
    useAxiosInterceptor();
    const { t } = useTranslation();

    const [header, setHeader] = useState<DashboardHeader | null>(null);
    const [progress, setProgress] = useState<WeeklyProgress | null>(null);
    const [rounds, setRounds] = useState<WeekSummary[]>([]);
    const [selectedWeekId, setSelectedWeekId] = useState<number | "">("");

    const [loading, setLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(false);

    const progressCache = useRef(new Map<number, WeeklyProgress>());

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [headerData, progressData, roundsData] = await Promise.all([
                    getDashboardHeader(),
                    getWeeklyProgress(),
                    getFinishedRounds()
                ]);

                setHeader(headerData);
                setProgress(progressData);
                setRounds(roundsData);
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleRoundChange = async (value: string | number) => {
        const weekIdParam = value !== "" ? (value as number) : undefined;
        setSelectedWeekId(value as number | "");

        if (weekIdParam && progressCache.current.has(weekIdParam)) {
            setProgress(progressCache.current.get(weekIdParam)!);
            return;
        }

        setLoadingProgress(true);

        try {
            const newProgress = await getWeeklyProgress(undefined, weekIdParam);
            setProgress(newProgress);

            if (weekIdParam) {
                progressCache.current.set(weekIdParam, newProgress);
            }
        } catch (error) {
            console.error("Failed to fetch historical round progress:", error);
        } finally {
            setLoadingProgress(false);
        }
    };

    if (loading || !header || !progress) return <Loading />;

    const { competition, studentProfile } = header;
    const formatRound = (num: number) => num.toString().padStart(2, '0');

    const roundOptions = rounds.map(r => ({
        value: r.weekId,
        label: `Round ${formatRound(r.weekNumber)} - ${r.weekName}`
    }));

    const CompetitionHeader = () => {
        const displayName = getTranslatedCompetitionName(competition.name, t);

        return (
            <Box className="competition-header">
                <Box className="comp-info">
                    <Typography variant="overline" className="comp-year">
                        {t("dashboard.season")} {competition.year}
                    </Typography>
                    <Typography variant="h4" className="comp-name">
                        {displayName} <span style={{ color: '#dc0000' }}>{competition.year}</span>
                    </Typography>
                </Box>
                <Chip
                    icon={<CircleIcon style={{ fontSize: 12, color: competition.status === 'ACTIVE' ? '#2ecc71' : '#95a5a6' }} />}
                    label={competition.status === 'ACTIVE' ? t("status.live") : t("status.archived")}
                    className={`status-chip ${competition.status.toLowerCase()}`}
                />
            </Box>
        );
    };

    const CategoryCard = ({ title, category }: { title: string, category: any }) => (
        <Grid size={{ xs: 12, md: 4 }}>
            <Card className="event-category-card">
                <Box className="card-header">
                    <Typography variant="h6" className="category-title">{title}</Typography>
                </Box>
                <Stack spacing={1.5} className="card-content">
                    {category.events.map((event: any, idx: number) => (
                        <Box key={idx} className={`event-row ${event.isCompleted ? 'completed' : 'pending'}`}>
                            <Typography variant="body2">
                                {getTranslatedEventName(event.name, t)}
                            </Typography>
                            <Typography variant="caption" className="status-text">
                                {event.isCompleted ? t("status.cmp") : t("status.dns")}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Card>
        </Grid>
    );

    return (
        <Box className="dashboard-page">
            <Container maxWidth="lg">
                <CompetitionHeader />

                <Box className="driver-header">
                    <Box className="driver-identity">
                        <img
                            src={TEAM_LOGOS[studentProfile.teamCode]}
                            alt={studentProfile.teamName}
                            className="team-logo"
                        />
                        <Box className="identity-text">
                            <Typography variant="h4" className="driver-name">
                                {getDriverCode(studentProfile.firstName, studentProfile.lastName)}
                            </Typography>
                            <Typography variant="subtitle2" className="team-text">
                                {studentProfile.teamName} <span
                                    className="team-code"
                                    style={{ color: studentProfile.teamColor }}
                                >
                                    | {studentProfile.teamCode}
                                </span>
                            </Typography>
                        </Box>
                    </Box>
                    <Box className="driver-stats">
                        <Typography variant="h3" className="rank-text">P{studentProfile.rank}</Typography>
                        <Typography variant="caption">
                            {t("dashboard.total_pts", { count: studentProfile.totalPoints })}
                        </Typography>
                    </Box>
                </Box>

                <Divider className="section-divider" />

                <Box className="week-section-top">
                    <Box className="week-header">
                        <Typography variant="overline" className="round-counter">
                            Round {formatRound(progress.weekNumber)}
                        </Typography>
                        <Typography variant="h3" className="week-title">
                            {progress.weekName.toUpperCase()}
                        </Typography>
                    </Box>

                    <Box className="round-selector">
                        <SelectInput
                            id="round-history-select"
                            label={t("dashboard.history", "Round History")}
                            value={selectedWeekId}
                            options={roundOptions}
                            onChange={handleRoundChange}
                            emptyLabel={t("dashboard.current_round", "Current Round")}
                            disabled={loadingProgress}
                        />
                    </Box>
                </Box>

                {loadingProgress ? (
                    <Loading fullScreen={false} />
                ) : (
                    <Grid container spacing={3}>
                        <CategoryCard title={`🏁 ${t("dashboard.grand_prix")}`} category={progress.grandPrix} />
                        <CategoryCard title={`🏎️ ${t("dashboard.practice")}`} category={progress.practice} />
                        <CategoryCard title={`⚡ ${t("dashboard.sprint")}`} category={progress.sprint} />
                    </Grid>
                )}
            </Container>
        </Box>
    );
}