global {
    interface AuthContextType {
        user: AuthUser | null;
        setUser: (user: AuthUser | null) => void;
        isAuthLoading: boolean;
    }
}

export { };