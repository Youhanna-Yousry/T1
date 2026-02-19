import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    Box, Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import useAxiosInterceptor from "hooks/useAxiosInterceptor";
import { getTranslatedCompetitionName } from "utils/translationUtils";
import { getChampionshipDriversStandings, ChampionshipStanding, CompetitionSummary } from "services/championshipService";
import Loading from "components/Loading/Loading";

import MercedesLogo from "assets/teams/mercedes.png";
import McLarenLogo from "assets/teams/mclaren.png";
import RedBullLogo from "assets/teams/redbull.png";

import "./DriversChampionship.less";

const TEAM_LOGOS: Record<string, string> = {
    MER: MercedesLogo,
    MCL: McLarenLogo,
    RBR: RedBullLogo,
};

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

    const leader = standings[0];
    const leaderPoints = leader?.totalPoints ?? 0;

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

                <TableContainer component={Paper} className="standings-table-container" elevation={0}>
                    <Table className="standings-table">
                        <TableHead>
                            <TableRow className="standings-head-row">
                                <TableCell className="col-pos">{t("drivers_championship.col_pos")}</TableCell>
                                <TableCell className="col-driver">{t("drivers_championship.col_driver")}</TableCell>
                                <TableCell className="col-team">{t("drivers_championship.col_team")}</TableCell>
                                <TableCell className="col-pts">{t("drivers_championship.col_pts")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {standings.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" className="empty-state">
                                        <Typography variant="body2">{t("drivers_championship.no_data")}</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                standings.map((standing, index) => (
                                    <StandingRow
                                        key={`${standing.rank}-${index}`}
                                        standing={standing}
                                        leaderPoints={leaderPoints}
                                    />
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    );
}

function StandingRow({
    standing,
    leaderPoints,
}: {
    standing: ChampionshipStanding;
    leaderPoints: number;
}) {
    const logo = TEAM_LOGOS[standing.teamCode];
    const isLeader = standing.rank === 1;
    const gap = leaderPoints - standing.totalPoints;

    return (
        <TableRow className={`standing-row ${isLeader ? "leader" : ""}`}>
            <TableCell className="col-pos">
                <Typography className="rank-number">{standing.rank}</Typography>
            </TableCell>

            <TableCell className="col-driver">
                <Box className="driver-cell">
                    <Box
                        className="driver-color-bar"
                        style={{ backgroundColor: standing.teamColor || "#dc0000" }}
                    />
                    <Box>
                        <Typography className="driver-full-name">
                            {standing.firstName + " " + standing.lastName}
                        </Typography>
                        {gap > 0 && (
                            <Typography className="gap-label" dir="ltr">-{gap} PTS</Typography>
                        )}
                    </Box>
                </Box>
            </TableCell>

            <TableCell className="col-team">
                <Box className="team-cell">
                    <Box className="team-logo-wrapper">
                        {logo ? (
                            <img
                                src={logo}
                                alt={standing.teamName}
                                className="team-logo-small"
                            />
                        ) : (
                            <Box
                                className="team-color-dot"
                                style={{ backgroundColor: standing.teamColor || "#888" }}
                            />
                        )}
                    </Box>
                    <Typography className="team-code-text" style={{ color: standing.teamColor }}>
                        {standing.teamName}
                    </Typography>
                </Box>
            </TableCell>

            <TableCell className="col-pts">
                <Typography className="pts-value">{standing.totalPoints}</Typography>
            </TableCell>
        </TableRow>
    );
}