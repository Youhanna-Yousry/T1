import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from 'components/ProtectedRoute';
import MainLayout from 'components/layout/MainLayout/MainLayout';

import Dashboard from 'pages/dashboard/Dashboard';
import Login from 'pages/login/Login';
import RaceControl from 'pages/raceControl/RaceControl';
import { useAuth } from 'context/authContext';
import RoleRoute from 'components/RoleRoute';
import RacerCode from 'pages/racerCode/RacerCode';
import ManualScoring from 'pages/manualScoring/ManualScoring';
import DriverChampionship from 'pages/driverChampionship/DriverChampionship';

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

        <Route element={<RoleRoute allowedRoles={["SERVANT", "SUPER_SERVANT"]} />}>
          <Route path="/race-control" element={<RaceControl />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={["SUPER_SERVANT"]} />}>
          <Route path="/manual-scoring" element={<ManualScoring />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={["STUDENT", "SERVANT"]} />}>
          <Route path="/driver-championship" element={<DriverChampionship />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;