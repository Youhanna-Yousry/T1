import axios from "api/axios";

export async function login(userCredentials: UserCredentials): Promise<AuthUser> {
    const response = await axios.post<AuthUser>('/auth/login', userCredentials);
    return response.data;
}

export async function refresh(): Promise<AuthUser> {
    const response = await axios.post<AuthUser>('/auth/refresh');
    return response.data;
}

export function logout(): Promise<void> {
    return axios.post('/auth/logout');
}