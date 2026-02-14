import { useAuth } from "context/authContext";
import { refresh } from "services/authService";

export default function useRefreshToken() {
    const { setUser } = useAuth();

    const refreshToken = async () => {
        const user = await refresh();
        setUser(user);
        return user.token;
    }

    return refreshToken;
}