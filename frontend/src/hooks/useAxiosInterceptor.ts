import { useAuth } from "context/authContext";
import { useEffect } from "react";
import axios from "api/axios";
import useRefreshToken from "hooks/useRefreshToken";

function isAuthEndpoint(url: string) {
    return url.startsWith("/auth/");
}

export default function UseAxiosInterceptor() {
    const auth = useAuth();
    const refresh = useRefreshToken();

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            config => {
                if (isAuthEndpoint(config.url || '')) {
                    return config;
                }

                const token = auth.user?.token;
                if (!config.headers['Authorization'] && token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }

                return config;
            },
            error => Promise.reject(error)
        );

        const responseInterceptor = axios.interceptors.response.use(
            response => response,
            async error => {
                const prevRequest = error.config;

                if (!isAuthEndpoint(prevRequest.url) && error.response?.status === 403 && !prevRequest._retry) {
                    prevRequest._retry = true;
                    const newToken = await refresh();

                    prevRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return axios(prevRequest);
                };

                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };

    }, [auth, refresh]);
}