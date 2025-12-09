import axios from "api/axios";

export async function login(userCredentials: UserCredentials): Promise<UserTokenAndRole> {
    const response = await axios.post<UserTokenAndRole>('/auth/login', userCredentials);
    return response.data;
}

export async function refresh(): Promise<UserTokenAndRole> {
    const response = await axios.post<UserTokenAndRole>('/auth/refresh');
    return response.data;
}

export function logout(): Promise<void> {
    return axios.post('/auth/logout');
}