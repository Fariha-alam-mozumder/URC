import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaEllipsisV } from 'react-icons/fa';

const TeamCard = ({
  id,
  title,
  created,
  description,
  status,
  members,
  clickable = true,
  createdBy,
  to,
  onCardClick,
  role = "teacher",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!clickable) return;
    if (typeof onCardClick === 'function') return onCardClick();
    if (to) return navigate(to);

    if (id) {
      if (role === "admin") navigate(`/AdminDashboard/teams/${encodeURIComponent(id)}`);
      else navigate(`/teacher/team/${encodeURIComponent(id)}`);
    }
  };

  const membersCount = Array.isArray(members) ? members.length : members || 0;

  return (
    <div
      onClick={handleClick}
      className={`bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition ${clickable ? 'cursor-pointer' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg">{title || 'Untitled Team'}</h3>
          {created && <p className="text-sm text-gray-500">{created}</p>}
        </div>
        {clickable && <FaEllipsisV className="text-gray-400 cursor-pointer mt-1" />}
      </div>
      {description && <p className={`text-sm text-gray-600 mb-4 ${clickable ? 'line-clamp-2' : ''}`}>{description}</p>}
      {!clickable && createdBy && (
        <p className="text-sm text-gray-500 mb-4"><span className="font-medium">Created By:</span> {createdBy}</p>
      )}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {status || 'Status Unknown'}
        </span>
        <div className="flex items-center gap-1">
          <FaUsers />
          <span>{membersCount} member{membersCount !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
