import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    Box,
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import useAxiosInterceptor from "hooks/useAxiosInterceptor";
import { getChampionshipStandings, ChampionshipStanding } from "services/championshipService";
import Loading from "components/Loading/Loading";

import MercedesLogo from "assets/teams/mercedes.png";
import McLarenLogo from "assets/teams/mclaren.png";
import RedBullLogo from "assets/teams/redbull.png";

import "./DriverChampionship.less";

const TEAM_LOGOS: Record<string, string> = {
    MER: MercedesLogo,
    MCL: McLarenLogo,
    RBR: RedBullLogo,
};

export default function DriverChampionship() {
    useAxiosInterceptor();
    const { t } = useTranslation();
    const [standings, setStandings] = useState<ChampionshipStanding[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getChampionshipStandings()
            .then(setStandings)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Loading />;

    const leader = standings[0];
    const leaderPoints = leader?.totalPoints ?? 0;

    return (
        <Box className="championship-page">
            <Container maxWidth="lg">

                {/* Page header — mirrors the F1 standings page style */}
                <Box className="championship-header">
                    <Box className="champ-title-block">
                        <Typography variant="overline" className="champ-season-label">
                            {t("championship.season_standings")}
                        </Typography>
                        <Typography variant="h4" className="champ-title">
                            {t("championship.title")}
                        </Typography>
                    </Box>
                    <Chip
                        icon={<CircleIcon style={{ fontSize: 12, color: "#2ecc71" }} />}
                        label={t("status.live")}
                        className="status-chip active"
                    />
                </Box>

                {/* Standings table */}
                <TableContainer component={Paper} className="standings-table-container" elevation={0}>
                    <Table className="standings-table">
                        <TableHead>
                            <TableRow className="standings-head-row">
                                <TableCell className="col-pos">{t("championship.col_pos")}</TableCell>
                                <TableCell className="col-driver">{t("championship.col_driver")}</TableCell>
                                <TableCell className="col-nationality">{t("championship.col_team_name")}</TableCell>
                                <TableCell className="col-team">{t("championship.col_team")}</TableCell>
                                <TableCell className="col-pts" align="right">{t("championship.col_pts")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {standings.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" className="empty-state">
                                        <Typography variant="body2">{t("championship.no_data")}</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                standings.map((standing) => (
                                    <StandingRow
                                        key={standing.rank}
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
            {/* Rank */}
            <TableCell className="col-pos">
                <Typography className="rank-number">{standing.rank}</Typography>
            </TableCell>

            {/* Driver name */}
            <TableCell className="col-driver">
                <Box className="driver-cell">
                    <Box
                        className="driver-color-bar"
                        style={{ backgroundColor: standing.teamColor || "#dc0000" }}
                    />
                    <Box>
                        <Typography className="driver-full-name">
                            {standing.firstName}{" "}
                            <span className="driver-last-name">{standing.lastName}</span>
                        </Typography>
                        {gap > 0 && (
                            <Typography className="gap-label">-{gap} PTS</Typography>
                        )}
                    </Box>
                </Box>
            </TableCell>

            {/* Team name (text) */}
            <TableCell className="col-nationality">
                <Typography className="team-name-text">{standing.teamName}</Typography>
            </TableCell>

            {/* Team (icon + code) */}
            <TableCell className="col-team">
                <Box className="team-cell">
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
                    <Typography className="team-code-text" style={{ color: standing.teamColor }}>
                        {standing.teamName}
                    </Typography>
                </Box>
            </TableCell>

            {/* Points */}
            <TableCell className="col-pts" align="right">
                <Typography className="pts-value">{standing.totalPoints}</Typography>
            </TableCell>
        </TableRow>
    );
}
