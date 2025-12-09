import { Navigate } from "react-router-dom";
import { useAuth } from "context/authContext";
import isNonEmptyString from "utils/stringUtils";

export default function ProtectedRoute({ element }: { element: React.ReactNode }): React.ReactElement {
    const { userTokenAndRole } = useAuth();

    if (isNonEmptyString(userTokenAndRole.token)) {
        return element as React.ReactElement;
    }

    return <Navigate to="/login" replace />;
}