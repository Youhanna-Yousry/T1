import { useState, useEffect, useRef } from "react";
import useAxiosInterceptor from "hooks/useAxiosInterceptor";
import { useTranslation } from "react-i18next";
import { Container, Box, Typography, Chip } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { getTranslatedCompetitionName } from "utils/translationUtils";

import { getWeeklyLeaderboard, ChampionshipStanding, ChampionshipResponse } from "services/championshipService";
import { getFinishedRounds, WeekSummary } from "services/championshipService";

import Loading from "components/loading/Loading";
import { SelectInput } from "components/form/SelectInput";
import StandingsTable from "components/standingsTable/StandingsTable";

import "./RaceWeek.less";

export default function RaceWeek() {
    useAxiosInterceptor();
    const { t } = useTranslation();

    const [data, setData] = useState<ChampionshipResponse | null>(null);
    const [rounds, setRounds] = useState<WeekSummary[]>([]);
    const [selectedWeekId, setSelectedWeekId] = useState<number | "">("");

    const [loading, setLoading] = useState(true);
    const [loadingStandings, setLoadingStandings] = useState(false);

    const standingsCache = useRef(new Map<number, ChampionshipResponse>());

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [leaderboardData, roundsData] = await Promise.all([
                    getWeeklyLeaderboard(),
                    getFinishedRounds()
                ]);

                setData(leaderboardData);
                setRounds(roundsData);
            } catch (error) {
                console.error("Failed to load race week data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleRoundChange = async (value: string | number) => {
        const weekIdParam = value !== "" ? (value as number) : undefined;
        setSelectedWeekId(value as number | "");

        if (weekIdParam && standingsCache.current.has(weekIdParam)) {
            setData(standingsCache.current.get(weekIdParam)!);
            return;
        }

        setLoadingStandings(true);
        try {
            const newData = await getWeeklyLeaderboard(undefined, weekIdParam);
            setData(newData);

            if (weekIdParam) {
                standingsCache.current.set(weekIdParam, newData);
            }
        } catch (error) {
            console.error("Failed to fetch historical standings:", error);
        } finally {
            setLoadingStandings(false);
        }
    };

    if (loading || !data) return <Loading />;

    const standings: ChampionshipStanding[] = data.standings ?? [];
    const competition = data.competitionSummary;
    const displayName = competition ? getTranslatedCompetitionName(competition.name, t) : "";
    const isActive = competition?.status === "ACTIVE";

    const formatRound = (num: number) => num.toString().padStart(2, '0');

    const roundOptions = rounds.map(r => ({
        value: r.weekId,
        label: `Round ${formatRound(r.weekNumber)} - ${r.weekName}`
    }));

    return (
        <Box className="weekly-page">
            <Container maxWidth="lg">
                <Box className="weekly-header">
                    <Box className="header-left">
                        <Box className="weekly-title-block">
                            <Typography variant="overline" className="weekly-season">
                                {competition
                                    ? `${t("dashboard.season")} ${competition.year} • ${displayName}`
                                    : t("race_week.title")}
                            </Typography>
                            <Box className="title-row">
                                <Typography variant="h4" className="weekly-title">
                                    {t("race_week.title")} {competition && <span style={{ color: '#dc0000' }}>{competition.year}</span>}
                                </Typography>
                                <Chip
                                    icon={<CircleIcon style={{ fontSize: 12, color: isActive ? '#2ecc71' : '#95a5a6' }} />}
                                    label={isActive ? t("status.live") : t("status.archived")}
                                    className={`status-chip ${competition?.status?.toLowerCase() || ''}`}
                                />
                            </Box>
                        </Box>
                    </Box>

                    <Box className="round-selector">
                        <SelectInput
                            id="race-week-history-select"
                            label={t("dashboard.history", "Round History")}
                            value={selectedWeekId}
                            options={roundOptions}
                            onChange={handleRoundChange}
                            emptyLabel={t("dashboard.current_round", "Current Round")}
                            disabled={loadingStandings}
                            lightTheme
                        />
                    </Box>
                </Box>

                {loadingStandings ? (
                    <Loading fullScreen={false} />
                ) : (
                    <StandingsTable
                        standings={standings}
                        emptyStateText={t("race_week.no_data")}
                        showPoints={false}
                        labels={{
                            pos: t("race_week.col_pos"),
                            driver: t("race_week.col_driver"),
                            team: t("race_week.col_team")
                        }}
                    />
                )}
            </Container>
        </Box>
    );
}