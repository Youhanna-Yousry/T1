import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Box, Container, Typography, Chip } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import useAxiosInterceptor from "hooks/useAxiosInterceptor";
import { getTranslatedCompetitionName } from "utils/translationUtils";
import { getChampionshipDriversStandings, ChampionshipStanding, CompetitionSummary } from "services/championshipService";
import Loading from "components/Loading/Loading";
import StandingsTable from "components/standingsTable/StandingsTable"; // UPDATE THIS PATH

import "./DriversChampionship.less";

export default function DriverChampionship() {
    useAxiosInterceptor();
    const { t } = useTranslation();

    const [standings, setStandings] = useState<ChampionshipStanding[]>([]);
    const [summary, setSummary] = useState<CompetitionSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getChampionshipDriversStandings()
            .then((data) => {
                setStandings(data.standings);
                setSummary(data.competitionSummary);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Loading />;

    const isActive = summary?.status === "ACTIVE";
    const displayName = summary ? getTranslatedCompetitionName(summary.name, t) : "";

    return (
        <Box className="championship-page">
            <Container maxWidth="lg">
                <Box className="championship-header">
                    <Box className="champ-title-block">
                        <Typography variant="overline" className="champ-season-label">
                            {summary ? `${t("dashboard.season")} ${summary.year} • ${displayName}` : t("drivers_championship.title")}
                        </Typography>
                        <Typography variant="h4" className="champ-title">
                            {t("drivers_championship.title")} {summary && <span style={{ color: '#dc0000' }}>{summary.year}</span>}
                        </Typography>
                    </Box>
                    <Chip
                        icon={<CircleIcon style={{ fontSize: 12, color: isActive ? '#2ecc71' : '#95a5a6' }} />}
                        label={isActive ? t("status.live") : t("status.archived")}
                        className={`status-chip ${summary?.status?.toLowerCase() || ''}`}
                    />
                </Box>

                <StandingsTable
                    standings={standings}
                    emptyStateText={t("drivers_championship.no_data")}
                    showPoints={true}
                    labels={{
                        pos: t("drivers_championship.col_pos"),
                        driver: t("drivers_championship.col_driver"),
                        team: t("drivers_championship.col_team"),
                        pts: t("drivers_championship.col_pts")
                    }}
                />

            </Container>
        </Box>
    );
}