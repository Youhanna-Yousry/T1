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

interface WeeklyProgress {
    weekName: string;
    weekNumber: number;
    grandPrix: EventCategory;
    sprint: EventCategory;
    practice: EventCategory;
}

export interface StudentDashboard {
    competition: CompetitionSummary;
    studentProfile: StudentProfile;
    weeklyProgress: WeeklyProgress;
}

export async function getStudentDashboard(): Promise<StudentDashboard> {
    const response = await axios.get<StudentDashboard>(`/student/dashboard`);
    return response.data;
}