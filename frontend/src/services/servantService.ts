import axios from "api/axios"

export interface EventInfo {
    id: number;
    name: string;
    weight: number;
}

export async function getEvents(scannable: boolean): Promise<EventInfo[]> {
    const response = await axios.get<EventInfo[]>(`/servant/events?scannable=${scannable}`);
    return response.data;
}

export async function markAttendance(eventId: number, email: string, weight: number): Promise<string> {
    const response = await axios.post("/servant/attendance", { eventId, email, weight })
    return response.data;
}