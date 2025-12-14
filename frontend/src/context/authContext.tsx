import { createContext, useState, useContext, ReactNode } from "react";
import useInitAuth from "hooks/useInitAuth";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [userTokenAndRole, setUserTokenAndRole] = useState<UserTokenAndRole>({} as UserTokenAndRole);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useInitAuth(setIsAuthLoading, setUserTokenAndRole);

    return (
        <AuthContext.Provider value={{ userTokenAndRole, setUserTokenAndRole, isAuthLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);