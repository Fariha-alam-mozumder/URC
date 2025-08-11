import React, { useState, useContext } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  FaExchangeAlt,
  FaHistory,
  FaTachometerAlt,
  FaFileAlt,
} from "react-icons/fa";

import Topbar from "../../components/Common/Topbar";
import Sidebar from "../../components/Common/Sidebar";
import LogoutModal from "../../components/Common/LogoutModal";
import { AuthContext } from "./../../context/AuthContext";

const ReviewerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { updateAuth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    // localStorage.removeItem("token"); // only clear auth token
    logout(); // call logout from context
    // Redirect to landing page after logout
    navigate("/");
  };

  // Switch role back to Teacher via backend
  const switchToTeacher = async () => {
    try {
      const token = localStorage.getItem("token");
      const backendBaseUrl = "http://localhost:8000";
      const response = await fetch(`${backendBaseUrl}/api/auth/switch-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newRole: "TEACHER" }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to switch role");
        return;
      }

      updateAuth(data.token, data.user);
      navigate("/teacher/home");
      
    } catch (error) {
      console.error("Error switching role:", error);
      alert("Something went wrong while switching roles.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        role="reviewer"
      >
        <Link
          to="/reviewer/home"
          onClick={() => setIsSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700"
        >
          <FaTachometerAlt /> Home
        </Link>

        <Link
          to="/reviewer/dashboard"
          onClick={() => setIsSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700"
        >
          <FaTachometerAlt /> Dashboard
        </Link>

        <Link
          to="/reviewer/assignedpapers"
          onClick={() => setIsSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700"
        >
          <FaFileAlt /> Assigned Papers
        </Link>

        <Link
          to="/reviewer/assignedproposals"
          onClick={() => setIsSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700"
        >
          <FaFileAlt /> Assigned Proposals
        </Link>

        <Link
          to="/reviewer/reviewhistory"
          onClick={() => setIsSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700"
        >
          <FaHistory /> Review History
        </Link>

        {/* Divider */}
        <div className="border-t border-gray-300 my-3"></div>

        {/* Switch Role */}
        <button
          onClick={switchToTeacher}
          className="flex items-center gap-3 px-4 py-2 hover:bg-blue-100 rounded-md text-blue-700 font-medium w-full text-left"
          type="button"
        >
          <FaExchangeAlt /> Switch to Teacher
        </button>
      </Sidebar>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Topbar
          onMenuClick={() => setIsSidebarOpen(true)}
          onLogout={handleLogoutClick}
        />
        <main>
          <Outlet context={{ toggleSidebar: () => setIsSidebarOpen(true) }} />
        </main>

        {/* Logout Modal */}
        {isLogoutModalOpen && (
          <LogoutModal
            isOpen={isLogoutModalOpen}
            onClose={handleCloseModal}
            onConfirm={handleConfirmLogout}
          />
        )}
      </div>
    </div>
  );
};

export default ReviewerLayout;
