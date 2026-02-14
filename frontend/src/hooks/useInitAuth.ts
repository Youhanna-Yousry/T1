
import { useEffect } from "react";
import { refresh } from "services/authService";

export default function useInitAuth(setIsAuthLoading: (loading: boolean) => void,
    setUser: (user: AuthUser) => void) {

    useEffect(() => {
        refresh()
            .then((user) => {
                setUser(user);
            })
            .catch(_ => {
                setUser({} as AuthUser);
            })
            .finally(() => {
                setIsAuthLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}