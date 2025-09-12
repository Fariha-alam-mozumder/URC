// components/Topbar.jsx
import { FaBars, FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

const Topbar = ({ onMenuClick, onLogout }) => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(null);

  const userId = useMemo(() => user?.user_id ?? user?.id, [user]);

  // Build a safe, absolute URL and add ?t= cache-buster
  const withTs = (url) => {
    if (!url) return null;
    let full = url;

    // If BE returned a relative path like "images/xxx.png" or "/images/xxx.png"
    if (url.startsWith("/images/") || url.startsWith("images/")) {
      const path = url.startsWith("/") ? url : `/${url}`;
      full = `${API_BASE}${path}`;
    }

    // If BE already returned full http://localhost:8000/images/...
    // we keep it as is and just add the timestamp.
    const sep = full.includes("?") ? "&" : "?";
    return `${full}${sep}t=${Date.now()}`;
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!userId || !token) return;
      try {
        const ts = Date.now(); // also bust cache on the profile response
        const { data } = await axios.get(
          `${API_BASE}/api/user/profile/${userId}?t=${ts}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const photo = data?.profile?.profile_image || null;
        setAvatarUrl(withTs(photo));
      } catch (err) {
        console.error("Topbar: failed to load avatar", err);
        setAvatarUrl(null);
      }
    };

    fetchAvatar();
  }, [userId, token]);

  const goToProfile = () => {
    if (userId) navigate("/profile");
  };

  const onImgError = () => setAvatarUrl(null);

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 shadow-md sticky top-0 z-40">
      {/* Menu icon */}
      <button
        className="text-xl text-gray-600"
        onClick={onMenuClick}
        aria-label="Toggle sidebar"
      >
        <FaBars />
      </button>

      {/* Title (empty or place your title) */}
      <h1 className="text-lg font-semibold"></h1>

      {/* Right icons */}
      <div className="flex items-center gap-4 text-gray-600">
        {/* Notification bell */}
        <div className="relative">
          <FaBell className="text-xl cursor-pointer" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </div>

        {/* Avatar → Profile */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile"
            onClick={goToProfile}
            onError={onImgError}
            className="w-9 h-9 rounded-full object-cover border cursor-pointer"
            crossOrigin="anonymous"
            title="View Profile"
          />
        ) : (
          <FaUserCircle
            className="text-2xl cursor-pointer"
            onClick={goToProfile}
            title="View Profile"
          />
        )}

        {/* Logout */}
        <button onClick={onLogout} aria-label="Logout">
          <FaSignOutAlt className="text-xl cursor-pointer" />
        </button>
      </div>
    </div>
  );
};

export default Topbar;