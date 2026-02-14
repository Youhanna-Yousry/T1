import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "context/authContext";
import Loading from "components/Loading/Loading";

interface RoleRouteProps {
    allowedRoles: ("STUDENT" | "SERVANT")[];
}

export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
    const { user, isAuthLoading } = useAuth();

    if (isAuthLoading) return <Loading />;

    if (!user) return <Navigate to="/login" replace />;

    if (!allowedRoles.includes(user.role)) {
        if (user.role === "SERVANT") return <Navigate to="/race-control" replace />;

        if (user.role === "STUDENT") return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}