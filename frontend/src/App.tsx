import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from 'components/ProtectedRoute';
import MainLayout from 'components/layout/MainLayout';

import Dashboard from 'pages/dashboard/Dashboard';
import Login from 'pages/login/Login';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute element={<MainLayout />} />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;