import { createContext, useState, useContext, ReactNode } from "react";
import useInitAuth from "hooks/useInitAuth";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useInitAuth(setIsAuthLoading, setUser);

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);