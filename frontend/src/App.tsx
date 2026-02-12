import Home from 'pages/home/Home';
import Login from 'pages/login/Login';
import ProtectedRoute from 'components/ProtectedRoute';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
      <Route path="/" element={<ProtectedRoute element={<Home />} />} />
    </Routes>
  );
}

export default App;
