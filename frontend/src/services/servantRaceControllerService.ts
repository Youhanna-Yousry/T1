import axios from "api/axios"

export interface Lookup {
    id: number;
    name: string;
}

export async function getEvents(): Promise<Lookup[]> {
    const response = await axios.get<Lookup[]>(`/servant/events`);
    return response.data;
}

export async function getWeeks(): Promise<Lookup[]> {
    const response = await axios.get<Lookup[]>(`/servant/weeks`);
    return response.data;
}