import React, { useState, useContext } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Common/Sidebar";
import Topbar from "../../components/Common/Topbar";
import LogoutModal from "../../components/Common/LogoutModal";
import { AuthContext } from "../../context/AuthContext";
import {
  FaFileAlt,
  FaUsers,
  FaHistory,
  FaChartBar,
  FaExchangeAlt,
  FaHome,
  FaAcquisitionsIncorporated,
  Fa500Px
} from 'react-icons/fa';

const TeacherLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    logout(); // only clear auth token
    navigate("/"); // react-router navigation without reload
  };

  //! Function to switch role to Reviewer via backend
  const switchToReviewer = async () => {
    try {
      const token = localStorage.getItem("token");
      const backendBaseUrl = "http://localhost:8000";
      const response = await fetch(`${backendBaseUrl}/api/auth/switch-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newRole: "REVIEWER" }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to switch role");
        return;
      }

      // Update token and user in context
      updateAuth(data.token, data.user);

      // Navigate to reviewer home page
      navigate("/reviewer/home");
    } catch (error) {
      console.error("Error switching role:", error);
      alert("Something went wrong while switching roles.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role="teacher"
      >
        <Link
          to="/teacher/home"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700"
        >
        <FaHome /> Home
        </Link>
        <Link
          to="/teacher/dashboard"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700"
        >
        <FaChartBar /> Dashboard
        </Link>
        <Link
          to="/teacher/mypapers"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700"
        >
          <FaFileAlt /> My Papers
        </Link>
        <Link
          to="/teacher/myproposals"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700"
        >
          <FaFileAlt /> My Proposals
        </Link>
        <Link
          to="/teacher/team"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700"
        >
          <FaUsers /> Team Management
        </Link>
        <Link
          to="/teacher/history"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700"
        >
          <FaHistory /> Submission History
        </Link>
        {/* Divider */}
        <div className="border-t border-gray-300 my-3"></div>

        {/* Switch Role Button */}
        <button
          type="button"
          onClick={switchToReviewer}
          className="flex items-center gap-3 px-4 py-2 hover:bg-blue-100 rounded-md text-blue-700 font-medium w-full text-left"
        >
          <FaExchangeAlt /> Switch to Reviewer
        </button>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1">
        <Topbar
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogoutClick}
        />
        <main className="">
          <Outlet />
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

export default TeacherLayout;
