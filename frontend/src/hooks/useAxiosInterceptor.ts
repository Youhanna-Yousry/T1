import { useAuth } from "context/authContext";
import { useEffect } from "react";
import axios from "api/axios";
import useRefreshToken from "hooks/useRefreshToken";

function isAuthEndpoint(url: string | undefined) {
    return url && url.includes("/auth/");
}

export default function UseAxiosInterceptor() {
    const auth = useAuth();
    const refresh = useRefreshToken();

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            config => {
                if (isAuthEndpoint(config.url)) {
                    return config;
                }

                const token = auth.user?.token;
                if (token && !config.headers['Authorization']) {
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

                if (error.response?.status === 401 && !prevRequest?._retry) {

                    if (isAuthEndpoint(prevRequest.url)) {
                        return Promise.reject(error);
                    }

                    prevRequest._retry = true;

                    try {
                        const newToken = await refresh();
                        prevRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        return axios(prevRequest);
                    } catch (refreshError) {
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };

    }, [auth, refresh]);
}