import { Navigate, useLocation, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { userLoginPath, userPath } from "../../core/config/panelPaths";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, session } = useAuth();
  const location = useLocation();
  const { tenant, role } = useParams();

  if (!isAuthenticated) {
    return <Navigate to={userLoginPath(tenant || "cgu", role || "")} replace state={{ from: location }} />;
  }

  if (session.tenantSlug !== tenant || session.role !== role) {
    return <Navigate to={userPath(`${session.tenantSlug}/${session.role}/dashboard`)} replace />;
  }

  return children;
}
