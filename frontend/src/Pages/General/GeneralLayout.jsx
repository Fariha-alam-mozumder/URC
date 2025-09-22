import React, { useState, useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Common/Sidebar';
import Topbar from '../../components/Common/Topbar';
import LogoutModal from '../../components/Common/LogoutModal';
import { AuthContext } from "../../context/AuthContext";

import {
  FaHeart,
  FaHome
} from 'react-icons/fa';

const GeneralLayout = () => {
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

    // Perform logout logic here, like:
    localStorage.clear(); // or remove tokens
    window.location.href = '/'; // redirect to login page or landing
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role="student">
        <Link
          to="/student/home"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700"
        >
        <FaHome /> Home
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

export default GeneralLayout;
