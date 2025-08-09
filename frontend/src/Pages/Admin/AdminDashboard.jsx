import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../../components/Common/Sidebar';
import Topbar from '../../components/Common/Topbar';
import LogoutModal from '../../components/Common/LogoutModal';

import {
  FaFileAlt,
  FaUsers,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  }
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
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} role="admin">
        {/* Dashboard Section */}
        <div className="text-gray-700 font-semibold px-4 mb-2">Dashboard</div>
        <Link to="/AdminDashboard" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700">
          <FaFileAlt /> Dashboard
        </Link>
        <Link to="/AdminDashboard/all-papers" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-600">
          <FaFileAlt /> All Papers
        </Link>
        <Link to="/AdminDashboard/pending-review" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-600">
          <FaClock /> Pending Review
        </Link>
        <Link to="/AdminDashboard/assigned-papers" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-600">
          <FaCheckCircle /> Assigned Papers
        </Link>
        <Link to="/AdminDashboard/waiting-assignment" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-600">
          <FaFileAlt /> Waiting Assignment
        </Link>
        <Link to="/AdminDashboard/accepted-papers" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-600">
          <FaFileAlt /> Accepted Papers
        </Link>
        <Link to="/AdminDashboard/rejected-papers" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-600">
          <FaFileAlt /> Rejected Papers
        </Link>

        {/* Teams Section */}
        <div className="text-gray-700 font-semibold px-4 mt-4 mb-2">Teams</div>
        <Link to="/AdminDashboard/review-committee" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-600">
          <FaUsers /> Review Committee
        </Link>
        <Link to="/AdminDashboard/program-committee" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-600">
          <FaUsers /> Program Committee
        </Link>
        <Link to="/AdminDashboard/add-members" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-600">
          <FaUsers /> Add Members
        </Link>
        <Link to="/AdminDashboard/team-settings" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-600">
          <FaUsers /> Team Settings
        </Link>

        {/* Conference & Analytics */}
        <div className="text-gray-700 font-semibold px-4 mt-4 mb-2">Conference</div>
        <Link to="/AdminDashboard/schedule" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-600">
          <FaFileAlt /> Conference Schedule
        </Link>
        <Link to="/AdminDashboard/analytics" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-600">
          <FaFileAlt /> Analytics
        </Link>

        {/* Settings */}
        <div className="text-gray-700 font-semibold px-4 mt-4 mb-2">Settings</div>
        <Link to="/AdminDashboard/settings" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md text-gray-600">
          <FaFileAlt /> Settings
        </Link>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} 
           onLogout={handleLogoutClick}/>
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

export default AdminDashboard;
