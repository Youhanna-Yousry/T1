import axios from "api/axios";

interface StudentInfoDto {
    name: string;
    teamName: string;
    teamCode: string;
    rank: number;
    totalPoints: number;
}

interface Event {
    name: string;
    points: number;
    isCompleted: boolean;
}

interface Category {
    totalPoints: number;
    events: Event[];
}

interface WeeklyInfo {
    weekName: string;
    grandPrix: Category;
    sprint: Category;
    practice: Category;
}

export interface StudentDashboard {
    studentInfo: StudentInfoDto;
    weeklyInfo: WeeklyInfo;
}

export async function getStudentDashboard(username: string): Promise<StudentDashboard> {
    const response = await axios.get<StudentDashboard>(`/student/dashboard?username=${username}`);
    return response.data;
}