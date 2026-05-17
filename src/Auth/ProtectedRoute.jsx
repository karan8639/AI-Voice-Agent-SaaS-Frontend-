import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 * Wraps any route that requires authentication.
 * If the user is NOT authenticated, they are redirected to /login.
 * The original `location` is saved in router state so that after a successful
 * login the user can be sent back to where they were trying to go.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
