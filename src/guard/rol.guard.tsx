import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { role, isAuthenticated } = useSelector((state: RootState) => state.auth);
  console.log("Authenticated:", isAuthenticated, "Role:", role);
  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si el rol no está permitido, redirige a "no autorizado"
  if (!allowedRoles.includes(role || '')) {
    return <Navigate to="/not-authorized" />;
  }

  return children ? children : <Outlet/>
};


