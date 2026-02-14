import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from 'components/ProtectedRoute';
import MainLayout from 'components/layout/MainLayout/MainLayout';

import Dashboard from 'pages/dashboard/Dashboard';
import Login from 'pages/login/Login';
import RaceControl from 'pages/raceControl/RaceControl';
import { useAuth } from 'context/authContext';
import RoleRoute from 'components/RoleRoute';
import RacerCode from 'pages/racerCode/RacerCode';

const HomeRedirect = () => {
  const { user } = useAuth();
  if (user?.role === "SERVANT") return <Navigate to="/race-control" replace />;
  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute element={<MainLayout />} />}>
        <Route path="/" element={<HomeRedirect />} />

        <Route element={<RoleRoute allowedRoles={["STUDENT"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={["STUDENT"]} />}>
          <Route path="/racer-code" element={<RacerCode />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={["SERVANT"]} />}>
          <Route path="/race-control" element={<RaceControl />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;