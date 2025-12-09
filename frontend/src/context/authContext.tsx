import { createContext, useState, useContext, ReactNode } from "react";

const AuthContext = createContext<AuthContextType>({
    userTokenAndRole: { token: "", role: "SERVANT" },
    setUserTokenAndRole: () => { }
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [userTokenAndRole, setUserTokenAndRole] = useState<UserTokenAndRole>({
        token: "",
        role: "SERVANT"
    });

    return (
        <AuthContext.Provider value={{ userTokenAndRole, setUserTokenAndRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);