// components/Sidebar.jsx
import React, { useEffect, useMemo, useState } from "react";
import { FaTimes, FaBookOpen } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { resolveApiUrl, resolveBackendUrl } from "../../config/api";

const roleLabel = (profile) => {
  const r = profile?.role;
  // If the user is a TEACHER and flagged as reviewer on the teacher table
  if (r === "TEACHER" && profile?.isReviewer) return "Teacher/Reviewer";
  if (r === "TEACHER") return "Teacher";
  if (r === "REVIEWER") return "Teacher/Reviewer"; // reviewers are teachers in your schema
  if (r === "ADMIN") return "Administrator";
  if (r === "STUDENT") return "Student";
  return "User";
};

const withTs = (url) => {
  if (!url) return null;
  const full = resolveBackendUrl(url);
  const sep = full.includes("?") ? "&" : "?";
  return `${full}${sep}t=${Date.now()}`;
};

const Sidebar = ({ role = "teacher", isOpen, onClose, children }) => {
  const { user, token } = useAuth();
  const userId = useMemo(() => user?.user_id ?? user?.id, [user]);

  const defaultAvatar =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><circle cx='40' cy='40' r='40' fill='lightgray'/></svg>";
  const [footerName, setFooterName] = useState("User");
  const [footerTitle, setFooterTitle] = useState("User");
  const [footerAvatar, setFooterAvatar] = useState(defaultAvatar);

  useEffect(() => {
    // Fetch whenever userId/token changes AND when the sidebar is opened (freshness)
    if (!isOpen || !userId || !token) return;

    const fetchProfile = async () => {
      try {
        const ts = Date.now();
        const { data } = await axios.get(
          resolveApiUrl(`/user/profile/${userId}?t=${ts}`),
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const p = data?.profile || {};
        // Prefer BE-provided full URL; add cache-buster
        const avatar = withTs(p.profile_image) || defaultAvatar;
        setFooterAvatar(avatar);
        setFooterName(p?.name || "User");
        setFooterTitle(roleLabel(p));
      } catch (e) {
        console.error("Sidebar: failed to load profile footer", e);
        setFooterAvatar(defaultAvatar);
        setFooterName("User");
        setFooterTitle("User");
      }
    };

    fetchProfile();
  }, [isOpen, userId, token]);

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
    >
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Close button */}
          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-black text-xl"
            >
              <FaTimes />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center space-x-4 mb-3 p-3">
            <div className="bg-black text-white p-2 rounded-lg">
              <FaBookOpen className="text-xl" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">URCMS</h1>
              <p className="text-sm text-gray-500 whitespace-nowrap">
                University Research Cell
              </p>
            </div>
          </div>

          {/* Menu items */}
          <nav className="flex flex-col gap-2">{children}</nav>
        </div>

        {/* Fixed profile footer (live data) */}
        <div className="p-4 border-t flex items-center bg-white">
          <img
            src={footerAvatar}
            alt="avatar"
            className="rounded-full w-10 h-10 object-cover border"
            onError={(e) => (e.currentTarget.src = defaultAvatar)}
            crossOrigin="anonymous"
          />

          <div className="flex flex-col ml-3">
            <p className="font-bold">{footerName}</p>
            <p className="text-sm text-gray-500">{footerTitle}</p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
