import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { ChampionshipStanding } from "services/championshipService";

import MercedesLogo from "assets/teams/mercedes.png";
import McLarenLogo from "assets/teams/mclaren.png";
import RedBullLogo from "assets/teams/redbull.png";

import "./StandingsTable.less";

const TEAM_LOGOS: Record<string, string> = {
    MER: MercedesLogo,
    MCL: McLarenLogo,
    RBR: RedBullLogo,
};

interface StandingsTableProps {
    standings: ChampionshipStanding[];
    emptyStateText: string;
    labels: {
        pos: string;
        driver: string;
        team: string;
        pts?: string;
    };
    showPoints?: boolean;
}

export default function StandingsTable({ standings, emptyStateText, labels, showPoints = true }: StandingsTableProps) {
    const leaderPoints = standings.length > 0 ? standings[0].totalPoints : 0;

    return (
        <TableContainer component={Paper} className="shared-standings-container" elevation={0}>
            <Table className="shared-standings-table">
                <TableHead>
                    <TableRow className="standings-head-row">
                        <TableCell className="col-pos">{labels.pos}</TableCell>
                        <TableCell className="col-driver">{labels.driver}</TableCell>
                        <TableCell className="col-team">{labels.team}</TableCell>
                        {showPoints && <TableCell className="col-pts">{labels.pts || "PTS"}</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {standings.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={showPoints ? 4 : 3} align="center" className="empty-state">
                                <Typography variant="body2">{emptyStateText}</Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        standings.map((standing, index) => {
                            const logo = TEAM_LOGOS[standing.teamCode];
                            const isLeader = standing.rank === 1;
                            const gap = leaderPoints - standing.totalPoints;

                            return (
                                <TableRow key={`${standing.rank}-${standing.firstName}-${index}`} className={`standing-row ${isLeader ? "leader" : ""}`}>
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
                                                {showPoints && gap > 0 && (
                                                    <Typography className="gap-label" dir="ltr">-{gap} PTS</Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    <TableCell className="col-team">
                                        <Box className="team-cell">
                                            <Box className="team-logo-wrapper">
                                                {logo ? (
                                                    <img src={logo} alt={standing.teamName} className="team-logo-small" />
                                                ) : (
                                                    <Box className="team-color-dot" style={{ backgroundColor: standing.teamColor || "#888" }} />
                                                )}
                                            </Box>
                                            <Typography className="team-code-text" style={{ color: standing.teamColor }}>
                                                {standing.teamName}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    {showPoints && (
                                        <TableCell className="col-pts">
                                            <Typography className="pts-value">{standing.totalPoints}</Typography>
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}