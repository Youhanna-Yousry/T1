import { useState, useEffect } from "react";
import useAxiosInterceptor from "hooks/useAxiosInterceptor";
import { useAuth } from "context/authContext";
import { Container, Grid, Typography, Box, Card, Stack, Chip, Divider } from "@mui/material";
import { getStudentDashboard, StudentDashboard } from "services/studentService";
import Loading from "components/Loading";

import "./Dashboard.less";

import MercedesLogo from "assets/teams/mercedes.png";
import McLarenLogo from "assets/teams/mclaren.png";
import RedBullLogo from "assets/teams/redbull.png";

const TEAM_LOGOS: Record<string, string> = {
    "MER": MercedesLogo,
    "MCL": McLarenLogo,
    "RBR": RedBullLogo,
};

const getDriverCode = (fullName: string) => {
    if (!fullName) return "---";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 3).toUpperCase();

    const firstName = parts[0];
    const lastName = parts[parts.length - 1];
    return `${firstName[0]}${lastName.substring(0, 2)}`.toUpperCase();
};

export default function Dashboard() {
    useAxiosInterceptor();
    const { user } = useAuth();
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

    const { studentInfo, weeklyInfo } = data;

    const CategoryCard = ({ title, category }: { title: string, category: any }) => (
        <Grid size={{ xs: 12, md: 4 }}>
            <Card className="event-category-card">
                <Box className="card-header">
                    <Typography variant="h6" className="category-title">{title}</Typography>
                    <Chip label={`${category.totalPoints} PTS`} size="small" className="points-chip" />
                </Box>
                <Stack spacing={1.5} className="card-content">
                    {category.events.map((event: any, idx: number) => (
                        <Box key={idx} className={`event-row ${event.isCompleted ? 'completed' : ''}`}>
                            <Typography variant="body2">{event.name}</Typography>
                            <Typography variant="caption" className="event-pts">+{event.points}</Typography>
                        </Box>
                    ))}
                </Stack>
            </Card>
        </Grid>
    );

    return (
        <Box className="dashboard-page">
            <Container maxWidth="lg">
                <Box className="driver-header">
                    <Box className="driver-identity">
                        <img
                            src={TEAM_LOGOS[studentInfo.teamCode]}
                            alt={studentInfo.teamName}
                            className="team-logo"
                        />
                        <Box>
                            <Typography variant="h4" className="driver-name">
                                {getDriverCode(studentInfo.name)}
                            </Typography>
                            <Typography variant="subtitle2" className="team-text">
                                {studentInfo.teamName} <span className="team-code">| {studentInfo.teamCode}</span>
                            </Typography>
                        </Box>
                    </Box>
                    <Box className="driver-stats">
                        <Typography variant="h3" className="rank-text">P{studentInfo.rank}</Typography>
                        <Typography variant="caption">TOTAL: {studentInfo.totalPoints} PTS</Typography>
                    </Box>
                </Box>

                <Divider className="section-divider" />

                <Typography variant="h5" gutterBottom className="section-label">
                    WEEKEND SESSION: {weeklyInfo.weekName}
                </Typography>

                <Grid container spacing={3}>
                    <CategoryCard title="🏁 GRAND PRIX" category={weeklyInfo.grandPrix} />
                    <CategoryCard title="🏎️ PRACTICE" category={weeklyInfo.practice} />
                    <CategoryCard title="⚡ SPRINT" category={weeklyInfo.sprint} />
                </Grid>
            </Container>
        </Box>
    );
}