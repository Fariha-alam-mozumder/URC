import { useState } from 'react';
import { FaChartBar, FaExchangeAlt, FaHome } from 'react-icons/fa';
import { FaHistory } from 'react-icons/fa';
import { FaTachometerAlt } from 'react-icons/fa';
import {
  FaFileAlt
} from 'react-icons/fa';
import { Outlet, Link } from 'react-router-dom';

import Topbar from '../../components/Common/Topbar';
import Sidebar from '../../components/Common/Sidebar';
import LogoutModal from '../../components/Common/LogoutModal';

const ReviewerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    window.location.href = '/'; // redirect to login page or landing
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} role="reviewer">
        <Link
          to="reviewer/home"
          onClick={() => setIsSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700"
        >
          <FaHome /> Home
        </Link>
        <Link
  to="reviewer/dashboard"
  onClick={() => setIsSidebarOpen(false)}
  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700"
>
  <FaChartBar /> Dashboard
</Link>

        <Link
          to="/ReviewerDashboard/assignedpapers"
          onClick={() => setIsSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700"
        >
          <FaFileAlt /> Assigned Papers
        </Link>
        <Link
          to="/ReviewerDashboard/assigned-proposals"
          onClick={() => setIsSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700"
        >
          <FaFileAlt /> Assigned Proposals
        </Link>
        <Link
          to="/ReviewerDashboard/ReviewHistoryPage"
          onClick={() => setIsSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700"
        >
         <FaHistory /> Review History
        </Link>
        
        {/* Divider */}
       <div className="border-t border-gray-300 my-3"></div>

        {/* Switch Role */}
       <Link
        to="/teacher/teacher/home"
         onClick={() => setIsSidebarOpen(false)}
         className="flex items-center gap-3 px-4 py-2 hover:bg-blue-100 rounded-md text-blue-700 font-medium"
       >
    <FaExchangeAlt /> Switch to Teacher
</Link>
      </Sidebar>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)}
         onLogout={handleLogoutClick} />
        <main className="">
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

export default ReviewerDashboard;
