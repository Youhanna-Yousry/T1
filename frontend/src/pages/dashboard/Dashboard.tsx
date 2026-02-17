import { useState, useEffect } from "react";
import useAxiosInterceptor from "hooks/useAxiosInterceptor";
import { useAuth } from "context/authContext";
import { useTranslation } from "react-i18next";
import { Container, Grid, Typography, Box, Card, Stack, Divider, Chip } from "@mui/material";
import { getStudentDashboard, StudentDashboard } from "services/studentService";
import Loading from "components/Loading/Loading";
import CircleIcon from '@mui/icons-material/Circle'; // You might need to install @mui/icons-material

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
    const { user } = useAuth();
    const { t } = useTranslation();
    const [data, setData] = useState<StudentDashboard | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.username) {
            getStudentDashboard(user.username)
                .then(setData)
                .finally(() => setLoading(false));
        }
    }, [user]);

    if (loading || !data) return <Loading />;

    const { competitionInfo, driverInfo, trackData } = data;

    const getTranslatedEventName = (name: string) => {
        const key = `activities.${name.toLowerCase().replace(/\s+/g, '_')}`;
        return t(key, name);
    };

    const CompetitionHeader = () => {
        const getTranslatedCompetitionName = (fullName: string) => {
            const nameOnly = fullName.replace(/[0-9]/g, '').trim();
            const key = `competitions.${nameOnly.toLowerCase().replace(/\s+/g, '_')}`;
            return t(key, nameOnly);
        };

        const displayName = getTranslatedCompetitionName(competitionInfo.name);

        return (
            <Box className="competition-header">
                <Box className="comp-info">
                    <Typography variant="overline" className="comp-year">
                        {t("dashboard.season")} {competitionInfo.year}
                    </Typography>
                    <Typography variant="h4" className="comp-name">
                        {displayName} <span style={{ color: '#dc0000' }}>{competitionInfo.year}</span>
                    </Typography>
                </Box>
                <Chip
                    icon={<CircleIcon style={{ fontSize: 12, color: competitionInfo.status === 'ACTIVE' ? '#2ecc71' : '#95a5a6' }} />}
                    label={competitionInfo.status === 'ACTIVE' ? t("status.live") : t("status.archived")}
                    className={`status-chip ${competitionInfo.status.toLowerCase()}`}
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
                        <Box key={idx} className={`event-row ${event.completed ? 'completed' : 'pending'}`}>
                            <Typography variant="body2">
                                {getTranslatedEventName(event.name)}
                            </Typography>
                            <Typography variant="caption" className="status-text">
                                {event.completed ? t("status.cmp") : t("status.dns")}
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
                            src={TEAM_LOGOS[driverInfo.teamCode]}
                            alt={driverInfo.teamName}
                            className="team-logo"
                        />
                        <Box className="identity-text">
                            <Typography variant="h4" className="driver-name">
                                {getDriverCode(driverInfo.firstName, driverInfo.lastName)}
                            </Typography>
                            <Typography variant="subtitle2" className="team-text">
                                {driverInfo.teamName} <span
                                    className="team-code"
                                    style={{ color: driverInfo.teamColor }}
                                >
                                    | {driverInfo.teamCode}
                                </span>
                            </Typography>
                        </Box>
                    </Box>
                    <Box className="driver-stats">
                        <Typography variant="h3" className="rank-text">P{driverInfo.championshipRank}</Typography>
                        <Typography variant="caption">
                            {t("dashboard.total_pts", { count: driverInfo.championshipPoints })}
                        </Typography>
                    </Box>
                </Box>

                <Divider className="section-divider" />

                <Typography variant="h5" gutterBottom className="section-label">
                    {trackData.weekName}
                </Typography>

                <Grid container spacing={3}>
                    <CategoryCard title={`🏁 ${t("dashboard.grand_prix")}`} category={trackData.grandPrix} />
                    <CategoryCard title={`🏎️ ${t("dashboard.practice")}`} category={trackData.practice} />
                    <CategoryCard title={`⚡ ${t("dashboard.sprint")}`} category={trackData.sprint} />
                </Grid>
            </Container>
        </Box>
    );
}