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
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (clickable) {
      navigate(`/teacher/team/${encodeURIComponent(title)}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition 
        ${clickable ? 'cursor-pointer' : ''}`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg">{title || 'Untitled Team'}</h3>
          <p className="text-sm text-gray-500">{created || 'Created Date Missing'}</p>
        </div>
        {clickable && <FaEllipsisV className="text-gray-400 cursor-pointer mt-1" />}
      </div>

      {/* Description */}
      <p className={`text-sm text-gray-600 mb-4 ${clickable ? 'line-clamp-2' : ''}`}>
        {description || 'No description provided.'}
      </p>

      {/* Creator for overview */}
      {!clickable && createdBy && (
        <p className="text-sm text-gray-500 mb-4">
          <span className="font-medium">Created By:</span> {createdBy}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            status === 'Active'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {status || 'Status Unknown'}
        </span>
        <div className="flex items-center gap-1">
          <FaUsers />
          <span>{members} members</span>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
