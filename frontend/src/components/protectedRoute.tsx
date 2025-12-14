import { useAuth } from "context/authContext";
import { Navigate } from "react-router-dom";
import Loading from "components/loading";

export default function ProtectedRoute({ element }: { element: React.ReactNode }): React.ReactElement {
    const { userTokenAndRole, isAuthLoading } = useAuth();

    if (isAuthLoading) {
        return <Loading />;
    }

    if (userTokenAndRole.token) {
        if (window.location.pathname === '/login') {
            return <Navigate to="/" replace />;
        }

        return element as React.ReactElement;
    }

    return <Navigate to="/login" replace />;
}