import { Navigate } from "react-router-dom";

import { useAuth } from "../../modules/context/AuthContext.jsx";
import { adminLoginPath } from "../config/panelPaths.js";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to={adminLoginPath()} replace />;
}
