import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children, allowedRoles }) {
  const { token, user, currentViewRole, loading } = useContext(AuthContext);

  if (loading || currentViewRole === null) {
    return <div>Loading...</div>;
  }

  if (!token || !user) {
    // Not logged in → go to landing page
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(currentViewRole)) {
    // Role mismatch → fallback (could be home or a "not authorized" page)
    return <Navigate to="/home" replace />;
  }

  return children;
}
