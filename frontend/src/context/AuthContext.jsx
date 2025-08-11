import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // new loading state
  //! current UI role/view for switching
  const [currentViewRole, setCurrentViewRole] = useState(null);

  const navigate = useNavigate();

  const normalizeUser = (u) => {
    if (!u) return u;
    const verified =
      u.emailVerified ??
      u.isEmailVerified ?? // API variant
      u.isemailVerified ?? // typo safeguard
      u.email_verified ?? // snake_case
      u.isVerified ?? // DB field leaked to client
      u.verified ??
      false;

    return { ...u, emailVerified: Boolean(verified) };
  };

  const safeDecode = (token) => {
    try {
      return jwtDecode(token);
    } catch (err) {
      console.error("Failed to decode token:", err.message);
      return null;
    }
  };

  const setAuthFromToken = (newToken, overrideRole = null) => {
    try {
      const decoded = safeDecode(newToken);

      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
        // Token expired
        clearAuth();
        return;
      }

      // Either use provided overrideRole or decoded role
      const roleToSet = (overrideRole ?? decoded.role) || null;

      setToken(newToken);
      setUser(normalizeUser(decoded));
      setCurrentViewRole(roleToSet);

      localStorage.setItem("token", newToken);
      localStorage.setItem("currentViewRole", roleToSet);

      console.log("Decoded user from token:", decoded);
    } catch (err) {
      console.error("Invalid token:", err.message);
      clearAuth();
    }
  };

  const clearAuth = () => {
    setToken(null);
    setUser(null);
    setCurrentViewRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("currentViewRole");
  };

  // Update auth: set token/localStorage + update user and role
  const updateAuth = (newToken, newUser = null, overrideRole = null) => {
    setLoading(true);
    if (newToken) {
      if (newUser) {
        const role = (overrideRole ?? newUser.role) || null;
        setToken(newToken);
        setUser(normalizeUser(newUser));
        setCurrentViewRole(role);
        localStorage.setItem("token", newToken);
        localStorage.setItem("currentViewRole", newUser.role);
      } else {
        setAuthFromToken(newToken, overrideRole);
      }
    } else {
      clearAuth();
    }
    setLoading(false);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("currentViewRole");
    if (storedToken) {
      setAuthFromToken(storedToken, storedRole);
    }
    setLoading(false); // done loading (even if no token)
  }, []);

  const login = (newToken, newUser = null) => {
    setLoading(true);
    if (newUser) {
      // If your login API already returns user, this path avoids an extra decode.
      const role = newUser.role || null;
      setToken(newToken);
      setUser(normalizeUser(newUser));
      setCurrentViewRole(role);
      localStorage.setItem("token", newToken);
      localStorage.setItem("currentViewRole", role);
    } else {
      // If you only have a token, decode it
      setAuthFromToken(newToken);
    }
    setLoading(false);
  };

  const logout = () => {
    clearAuth();
    navigate("/"); // redirect to login page
  };

  // Export currentViewRole and setter so UI can switch role
  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        loading,
        currentViewRole,
        setCurrentViewRole,
        updateAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
