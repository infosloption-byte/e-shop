import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // 1. If not logged in at all, send to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If route is for admins only, but user is NOT an admin, send to home
  if (adminOnly && !user.is_admin) {
    return <Navigate to="/" replace />;
  }

  // 3. Otherwise, they are allowed (Customer accessing checkout OR Admin accessing admin)
  return <Outlet />;
};

export default ProtectedRoute;