import axios from "api/axios";

interface CompetitionSummary {
    name: string;
    year: number;
    status: "ARCHIVED" | "ACTIVE";
}

interface StudentProfile {
    firstName: string;
    lastName: string;
    teamName: string;
    teamCode: string;
    teamColor: string;
    totalPoints: number;
    rank: number;
}

interface EventProgress {
    name: string;
    isCompleted: boolean;
}

interface EventCategory {
    events: EventProgress[];
}

export interface WeeklyProgress {
    weekName: string;
    weekNumber: number;
    grandPrix: EventCategory;
    sprint: EventCategory;
    practice: EventCategory;
}

export interface DashboardHeader {
    competition: CompetitionSummary;
    studentProfile: StudentProfile;
}

export async function getDashboardHeader(competitionId?: number): Promise<DashboardHeader> {
    const params = competitionId ? { competitionId } : {};

    const response = await axios.get<DashboardHeader>(`/student/dashboard/header`, { params });
    return response.data;
}

export async function getWeeklyProgress(competitionId?: number, weekId?: number): Promise<WeeklyProgress> {
    const params: Record<string, number> = {};
    if (competitionId) params.competitionId = competitionId;
    if (weekId) params.weekId = weekId;

    const response = await axios.get<WeeklyProgress>(`/student/progress/weekly`, { params });
    return response.data;
}