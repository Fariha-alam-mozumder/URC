import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const LogoutModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  
  if (!isOpen) return null;

  const handleLogout = () => {
    logout();    // call logout from context or props
    onClose();   // close the modal
    navigate('/'); // redirect to landing/login page
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
        <p className="mb-6 text-gray-700">Are you sure you want to logout?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
