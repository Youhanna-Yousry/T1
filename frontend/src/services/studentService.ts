import axios from "api/axios";

interface StudentInfo {
    name: string;
    teamName: string;
    teamCode: string;
    teamColor: string;
    rank: number;
    totalPoints: number;
}

interface Event {
    name: string;
    completed: boolean;
}

interface Category {
    events: Event[];
}

interface WeeklyInfo {
    weekName: string;
    grandPrix: Category;
    sprint: Category;
    practice: Category;
}

export interface StudentDashboard {
    studentInfo: StudentInfo;
    weeklyInfo: WeeklyInfo;
}

export async function getStudentDashboard(username: string): Promise<StudentDashboard> {
    const response = await axios.get<StudentDashboard>(`/student/dashboard?username=${username}`);
    return response.data;
}