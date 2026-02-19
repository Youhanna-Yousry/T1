import { useState, useEffect } from "react";
import useAxiosInterceptor from "hooks/useAxiosInterceptor";
import { useTranslation } from "react-i18next";
import { Container, Box, Typography, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import { getWeeklyStandings, ChampionshipStanding, ChampionshipResponse } from "services/championshipService";
import { getTranslatedCompetitionName } from "utils/translationUtils";
import Loading from "components/Loading/Loading";

import "./GrandPrixWeekly.less";

import MercedesLogo from "assets/teams/mercedes.png";
import McLarenLogo from "assets/teams/mclaren.png";
import RedBullLogo from "assets/teams/redbull.png";

const TEAM_LOGOS: Record<string, string> = {
    "MER": MercedesLogo,
    "MCL": McLarenLogo,
    "RBR": RedBullLogo,
};

const PODIUM_CLASSES: Record<number, string> = {
    1: "pos-p1",
    2: "pos-p2",
    3: "pos-p3",
};

export default function GrandPrixWeekly() {
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

    return (
        <Box className="weekly-page">
            <Container maxWidth="lg">
                <Box className="weekly-header">
                    <Box className="weekly-title-block">
                        <Typography variant="overline" className="weekly-season">
                            {competition
                                ? `${getTranslatedCompetitionName(competition.name, t)} ${competition.year}`
                                : ""}
                        </Typography>
                        <Typography variant="h4" className="weekly-title">
                            {t("grand_prix_weekly.title")}
                        </Typography>
                    </Box>
                    <Box className="weekly-badge">
                        <Typography className="badge-text">ROUND</Typography>
                    </Box>
                </Box>

                {standings.length === 0 ? (
                    <Box className="no-data">
                        <Typography className="no-data-text">{t("grand_prix_weekly.no_data")}</Typography>
                    </Box>
                ) : (
                    <Box className="standings-table-wrapper">
                        <Table className="standings-table">
                            <TableHead>
                                <TableRow className="table-header-row">
                                    <TableCell className="col-pos">{t("grand_prix_weekly.col_pos")}</TableCell>
                                    <TableCell className="col-driver">{t("grand_prix_weekly.col_driver")}</TableCell>
                                    <TableCell className="col-team">{t("grand_prix_weekly.col_team")}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {standings.map((s: ChampionshipStanding) => {
                                    const podiumClass = PODIUM_CLASSES[s.rank] ?? "";
                                    const logo = TEAM_LOGOS[s.teamCode];
                                    return (
                                        <TableRow key={`${s.rank}-${s.firstName}-${s.lastName}`} className={`standing-row ${podiumClass}`}>
                                            <TableCell className="cell-pos">
                                                <Typography className="pos-number">{s.rank}</Typography>
                                            </TableCell>
                                            <TableCell className="cell-driver">
                                                <Typography className="driver-name">
                                                    {s.firstName} {s.lastName}
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="cell-team">
                                                <Box className="team-cell">
                                                    {logo && (
                                                        <img
                                                            src={logo}
                                                            alt={s.teamName}
                                                            className="team-logo"
                                                        />
                                                    )}
                                                    <Typography
                                                        className="team-name"
                                                        style={{ color: s.teamColor }}
                                                    >
                                                        {s.teamName}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
