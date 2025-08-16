import { FaBars, FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ onMenuClick, onLogout, role  }) => {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate(`/profile/${role}`);
  };

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 shadow-md sticky top-0 z-40">
      {/* Menu icon */}
      <button
        className="text-xl text-gray-600"
        onClick={onMenuClick}
        aria-label="Toggle sidebar"
      >
        <FaBars />
      </button>

      {/* Title */}
      <h1 className="text-lg font-semibold"></h1>

      {/* Icons */}
      <div className="flex items-center gap-4 text-gray-600">
        {/* Notification bell */}
        <div className="relative">
          <FaBell className="text-xl cursor-pointer" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>

        {/* User icon - go to profile */}
        <FaUserCircle
          className="text-2xl cursor-pointer"
          onClick={goToProfile}
          title="View Profile"
        />

        {/* Logout button */}
        <button onClick={onLogout} aria-label="Logout">
          <FaSignOutAlt className="text-xl cursor-pointer" />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
