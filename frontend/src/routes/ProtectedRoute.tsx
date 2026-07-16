import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated } from "../app/slices/AuthSlice";
import { useBootstrapping } from "../app/BootContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const normalizeRole = (role?: string | null) => {
  if (!role) return "";
  return role === "provider" ? "service_provider" : role;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const bootstrapping = useBootstrapping();
  const location = useLocation();

  if (bootstrapping) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.some((role) => normalizeRole(role) === normalizeRole(user?.role))
  ) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
