import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentViewRole, setCurrentViewRole] = useState(null);
  const navigate = useNavigate();

  const normalizeUser = (u) => {
    if (!u) return u;
    return {
      ...u,
      // Normalize both possible property names to emailVerified
      emailVerified: Boolean(u.emailVerified || u.isEmailVerified || false),
    };
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
        clearAuth();
        return;
      }

      const roleToSet = (overrideRole ?? decoded.role) || null;
      setToken(newToken);
      setUser(normalizeUser(decoded));
      setCurrentViewRole(roleToSet);
      localStorage.setItem("token", newToken);
      localStorage.setItem("currentViewRole", roleToSet);
      console.log("Decoded user from token:", decoded);
      console.log("Normalized user:", normalizeUser(decoded));
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
    setLoading(false);
  }, []);

  const login = (newToken, newUser = null) => {
    setLoading(true);
    if (newUser) {
      const role = newUser.role || null;
      setToken(newToken);
      setUser(normalizeUser(newUser));
      setCurrentViewRole(role);
      localStorage.setItem("token", newToken);
      localStorage.setItem("currentViewRole", role);
    } else {
      setAuthFromToken(newToken);
    }
    setLoading(false);
  };

  const logout = () => {
    clearAuth();
    navigate("/");
  };

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