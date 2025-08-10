import React from 'react';
import { FaTimes, FaBookOpen } from 'react-icons/fa';

const defaultProfiles = {
  teacher: {
    name: 'Dr. Sarah Johnson',
    title: 'Teacher/Author',
    avatar: 'https://i.pravatar.cc/100?img=3',
  },
  reviewer: {
    name: 'Mr. John Doe',
    title: 'Reviewer',
    avatar: 'https://i.pravatar.cc/100?img=5',
  },
  admin: {
    name: 'Admin User',
    title: 'Administrator',
    avatar: 'https://i.pravatar.cc/100?img=8',
  },
  student: {
    name: 'Student',
    title: 'Student',
    avatar: 'https://i.pravatar.cc/100?img=8',
  },
};

const Sidebar = ({ role = 'teacher', isOpen, onClose, children, profile }) => {
  const displayProfile = profile || defaultProfiles[role] || defaultProfiles.teacher;



  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Close button */}
          <div className="flex justify-end mb-2">
            <button onClick={onClose} className="text-gray-600 hover:text-black text-xl">
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
              <p className="text-sm text-gray-500 whitespace-nowrap">University Research Cell</p>
            </div>
          </div>

          {/* Menu items */}
          <nav className="flex flex-col gap-2">{children}</nav>
        </div>

        {/* Fixed profile footer */}
        <div className="p-4 border-t flex items-center bg-white">
          <img
            src={displayProfile.avatar}
            className="rounded-full w-10 h-10"
            alt="avatar"
          />
          <div className="flex flex-col ml-3">
            <p className="font-bold">{displayProfile.name}</p>
            <p className="text-sm text-gray-500">{displayProfile.title}</p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
