import axios from "api/axios"

export interface EventSummary {
    id: number;
    name: string;
    points: number;
}

export async function getEvents(scannable: boolean): Promise<EventSummary[]> {
    const response = await axios.get<EventSummary[]>(`/servant/events?scannable=${scannable}`);
    return response.data;
}

export async function markAttendance(eventId: number, username: string, points: number): Promise<string> {
    const response = await axios.post("/servant/attendance", { eventId, username, points });
    return response.data;
}

export async function searchStudents(query: string): Promise<string[]> {
    if (!query) return [];

    const response = await axios.get<string[]>(`/servant/students/search?query=${encodeURIComponent(query)}`);
    return response.data;
}