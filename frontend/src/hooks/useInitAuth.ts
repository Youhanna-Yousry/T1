
import { useEffect } from "react";
import { refresh } from "services/authService";

export default function useInitAuth(setIsAuthLoading: (loading: boolean) => void,
    setUserTokenAndRole: (userTokenAndRole: UserTokenAndRole) => void) {

    useEffect(() => {
        refresh()
            .then((newTokenAndRole) => {
                setUserTokenAndRole(newTokenAndRole);
            })
            .catch(_ => {
                setUserTokenAndRole({} as UserTokenAndRole);
            })
            .finally(() => {
                setIsAuthLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}