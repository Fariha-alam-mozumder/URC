// Pages/ReviewerHome.jsx

import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { 
  FaChartBar, FaExchangeAlt, FaHome, FaHistory, FaFileAlt,
  FaClipboard, FaCheckCircle, FaClock, FaExclamationTriangle 
} from 'react-icons/fa';

import AssignedPapersTable from '../../components/Reviewer/AssignedPapersTable';
import StatCard from '../../components/Common/StatCard';
import Sidebar from '../../components/Common/Sidebar';

import LogoutModal from '../../components/Common/LogoutModal';

const ReviewerHome = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);


  const handleCloseModal = () => setIsLogoutModalOpen(false);
  const handleConfirmLogout = () => {
    // add logout logic here
    setIsLogoutModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} role="reviewer">
        <Link to="reviewer/home" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700">
          <FaHome /> Home
        </Link>
        <Link to="reviewer/dashboard" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700">
          <FaChartBar /> Dashboard
        </Link>
        <Link to="/ReviewerDashboard/assignedpapers" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700">
          <FaFileAlt /> Assigned Papers
        </Link>
        <Link to="/ReviewerDashboard/assigned-proposals" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700">
          <FaFileAlt /> Assigned Proposals
        </Link>
        <Link to="/ReviewerDashboard/ReviewHistoryPage" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700">
          <FaHistory /> Review History
        </Link>

        <div className="border-t border-gray-300 my-3"></div>

        <Link to="/teacher/teacher/home" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-blue-100 rounded-md text-blue-700 font-medium">
          <FaExchangeAlt /> Switch to Teacher
        </Link>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 flex flex-col space-y-6 p-6">
      
        <h2 className='text-2xl font-bold'>Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Papers" value={24} icon={<FaClipboard />} />
          <StatCard title="Submitted" value={18} icon={<FaCheckCircle />} />
          <StatCard title="Under Review" value={4} icon={<FaClock />} />
          <StatCard title="Pending" value={2} icon={<FaExclamationTriangle />} />
        </div>

        <Outlet context={{ toggleSidebar: () => setIsSidebarOpen(true) }} />

        <AssignedPapersTable reviewPathPrefix="/ReviewerDashboard/reviewpage/" />

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

export default ReviewerHome;
