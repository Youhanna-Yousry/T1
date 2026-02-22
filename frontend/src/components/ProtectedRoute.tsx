import { useAuth } from "context/authContext";
import { Navigate } from "react-router-dom";
import Loading from "components/loading/Loading";

export default function ProtectedRoute({ element }: { element: React.ReactNode }): React.ReactElement {
    const { user, isAuthLoading } = useAuth();

    if (isAuthLoading) {
        return <Loading />;
    }

    if (user?.token) {
        return element as React.ReactElement;
    }

    return <Navigate to="/login" replace />;
}