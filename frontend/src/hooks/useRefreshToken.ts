import { useAuth } from "context/authContext";
import { refresh } from "services/authService";

export default function useRefreshToken() {
    const { setUserTokenAndRole } = useAuth();

    const refreshToken = async () => {
        const newTokenAndRole = await refresh();
        setUserTokenAndRole(newTokenAndRole);
        return newTokenAndRole.token;
    }

    return refreshToken;
}