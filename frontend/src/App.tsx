import Home from 'components/home';
import Login from 'components/login';
import ProtectedRoute from 'components/protectedRoute';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute element={<Home />} />} />
    </Routes>
  );
}

export default App;
