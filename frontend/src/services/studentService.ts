import axios from "api/axios";

interface CompetitionInfo {
    name: string;
    year: number;
    status: "ARCHIVED" | "ACTIVE";
}

interface DriverInfo {
    firstName: string;
    lastName: string;
    teamName: string;
    teamCode: string;
    teamColor: string;
    championshipPoints: number;
    championshipRank: number;
}

interface Event {
    name: string;
    completed: boolean;
}

interface Category {
    events: Event[];
}

interface TrackData {
    weekName: string;
    weekNumber: number;
    grandPrix: Category;
    sprint: Category;
    practice: Category;
}

export interface StudentDashboard {
    competitionInfo: CompetitionInfo;
    driverInfo: DriverInfo;
    trackData: TrackData;
}

export async function getStudentDashboard(username: string): Promise<StudentDashboard> {
    const response = await axios.get<StudentDashboard>(`/student/dashboard?username=${username}`);
    return response.data;
}