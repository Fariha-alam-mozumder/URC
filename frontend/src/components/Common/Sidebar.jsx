// src/components/common/Sidebar.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';

// Define default profiles per role
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
  const displayProfile = profile || defaultProfiles[role] || defaultProfiles['teacher'];

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}>
      {/* Dark background overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar panel */}
      <aside
  className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg p-4 z-50 overflow-y-auto transform transition-transform duration-300 ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  }`}
>

        {/* Close button */}
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="text-gray-600 hover:text-black text-xl">
            <FaTimes />
          </button>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center mb-6">
          <img src={displayProfile.avatar} className="rounded-full w-16 h-16" alt="avatar" />
          <p className="mt-2 font-bold text-center">{displayProfile.name}</p>
          <p className="text-sm text-gray-500">{displayProfile.title}</p>
        </div>

        {/* Menu items */}
        <nav className="flex flex-col gap-2">{children}</nav>
      </aside>
    </div>
  );
};

export default Sidebar;
