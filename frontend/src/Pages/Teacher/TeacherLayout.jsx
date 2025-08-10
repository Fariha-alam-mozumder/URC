// src/layouts/TeacherLayout.jsx
import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
// import Sidebar from '../../components/Common/Sidebar';
// import Topbar from '../../components/Common/Topbar';
// import LogoutModal from '../../components/Common/LogoutModal';
import Sidebar from '../../components/Common/Sidebar';
import Topbar from '../../components/Common/Topbar';
import LogoutModal from '../../components/Common/LogoutModal';
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

  
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLogoutModalOpen(false);
  };

  
  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);

    // Perform logout logic here, like:
    localStorage.clear(); // or remove tokens
    window.location.href = '/'; // redirect to login page or landing
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role="teacher">
        <Link
          to="teacher/home"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700"
        >
        <FaHome /> Home
        </Link>
        <Link
          to="teacher/dashboard"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700"
        >
        <FaChartBar /> Dashboard
        </Link>
        <Link
          to="mypapers"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700"
        >
          <FaFileAlt /> My Papers
        </Link>
        <Link
          to="teacher/team"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700"
        >
          <FaUsers /> Team Management
        </Link>
        <Link
          to="teacher/history"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700"
        >
          <FaHistory /> Submission History
        </Link>
        {/* Divider */}
       <div className="border-t border-gray-300 my-3"></div>

        {/* Switch Role */}
       <Link
        to="/ReviewerDashboard/reviewer/home"
         onClick={() => setSidebarOpen(false)}
         className="flex items-center gap-3 px-4 py-2 hover:bg-blue-100 rounded-md text-blue-700 font-medium"
       >
    <FaExchangeAlt /> Switch to Reviewer
     </Link> 
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1">
        <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onLogout={handleLogoutClick} />
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
