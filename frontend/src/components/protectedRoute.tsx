import { useAuth } from "context/authContext";
import { Navigate } from "react-router-dom";
import Loading from "components/Loading";

export default function ProtectedRoute({ element }: { element: React.ReactNode }): React.ReactElement {
    const { userTokenAndRole, isAuthLoading } = useAuth();

    if (isAuthLoading) {
        return <Loading />;
    }

    if (userTokenAndRole.token) {
        return element as React.ReactElement;
    }

    return <Navigate to="/login" replace />;
}