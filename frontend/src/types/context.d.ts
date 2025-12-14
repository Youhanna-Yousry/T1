global {
    interface AuthContextType {
        userTokenAndRole: UserTokenAndRole;
        setUserTokenAndRole: (userTokenAndRole: UserTokenAndRole) => void;
        isAuthLoading: boolean;
    }
}

export { };