import { useState, useEffect } from "react";
import useAxiosInterceptor from "hooks/useAxiosInterceptor";
import { useTranslation } from "react-i18next";
import { Container, Box, Typography, Chip } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { getWeeklyStandings, ChampionshipStanding, ChampionshipResponse } from "services/championshipService";
import { getTranslatedCompetitionName } from "utils/translationUtils";
import Loading from "components/Loading/Loading";
import StandingsTable from "components/standingsTable/StandingsTable";

import "./RaceWeek.less";

export default function RaceWeek() {
    useAxiosInterceptor();
    const { t } = useTranslation();
    const [data, setData] = useState<ChampionshipResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getWeeklyStandings()
            .then(setData)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Loading />;

    const standings: ChampionshipStanding[] = data?.standings ?? [];
    const competition = data?.competitionSummary;
    const displayName = competition ? getTranslatedCompetitionName(competition.name, t) : "";
    const isActive = competition?.status === "ACTIVE";

    return (
        <Box className="weekly-page">
            <Container maxWidth="lg">
                <Box className="weekly-header">
                    <Box className="weekly-title-block">
                        <Typography variant="overline" className="weekly-season">
                            {competition
                                ? `${t("dashboard.season")} ${competition.year} • ${displayName}`
                                : t("race_week.title")}
                        </Typography>
                        <Typography variant="h4" className="weekly-title">
                            {t("race_week.title")} {competition && <span style={{ color: '#dc0000' }}>{competition.year}</span>}
                        </Typography>
                    </Box>
                    <Chip
                        icon={<CircleIcon style={{ fontSize: 12, color: isActive ? '#2ecc71' : '#95a5a6' }} />}
                        label={isActive ? t("status.live") : t("status.archived")}
                        className={`status-chip ${competition?.status?.toLowerCase() || ''}`}
                    />
                </Box>

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
            </Container>
        </Box>
    );
}