<<<<<<< HEAD
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaEllipsisV } from 'react-icons/fa';
const TeamCard = ({
  id,
  title,              // This will always be the display name, not the ID
=======
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaEllipsisV } from "react-icons/fa";

const TeamCard = ({
  id,
  title,              // Display name of the team
>>>>>>> origin/frontend/dev-erina
  created,
  description,
  status,
  members,
  clickable = true,
  createdBy,
<<<<<<< HEAD
  to,                 // Optional: override navigation path
  onCardClick,        // Optional: custom click handler
=======
  to,                 // Optional override path
  onCardClick,        // Optional custom click handler
  role = "teacher",   // Default role
>>>>>>> origin/frontend/dev-erina
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!clickable) return;

<<<<<<< HEAD
    if (typeof onCardClick === 'function') {
=======
    if (typeof onCardClick === "function") {
>>>>>>> origin/frontend/dev-erina
      onCardClick();
      return;
    }

    if (to) {
      navigate(to);
      return;
    }

<<<<<<< HEAD
    // Default teacher navigation (uses ID in URL, not in title)
    if (id) {
      navigate(`/teacher/team/${encodeURIComponent(id)}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition ${clickable ? 'cursor-pointer' : ''}`}
=======
    if (id) {
      if (role === "admin") {
        navigate(`/AdminDashboard/teams/${encodeURIComponent(id)}`);
      } else if (role === "teacher") {
        navigate(`/teacher/team/${encodeURIComponent(id)}`);
      } else {
        navigate(`/teacher/team/${encodeURIComponent(id)}`);
      }
    }
  };

  // Calculate members count safely
  const membersCount = Array.isArray(members) ? members.length : members;

  return (
    <div
      onClick={handleClick}
      className={`bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition ${
        clickable ? "cursor-pointer" : ""
      }`}
>>>>>>> origin/frontend/dev-erina
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
<<<<<<< HEAD
          <h3 className="font-semibold text-lg">{title || 'Untitled Team'}</h3>
=======
          <h3 className="font-semibold text-lg">{title || "Untitled Team"}</h3>
>>>>>>> origin/frontend/dev-erina
          {created && <p className="text-sm text-gray-500">{created}</p>}
        </div>
        {clickable && <FaEllipsisV className="text-gray-400 cursor-pointer mt-1" />}
      </div>

      {/* Description */}
      {description && (
<<<<<<< HEAD
        <p className={`text-sm text-gray-600 mb-4 ${clickable ? 'line-clamp-2' : ''}`}>
=======
        <p
          className={`text-sm text-gray-600 mb-4 ${
            clickable ? "line-clamp-2" : ""
          }`}
        >
>>>>>>> origin/frontend/dev-erina
          {description}
        </p>
      )}

      {/* Created By */}
      {!clickable && createdBy && (
        <p className="text-sm text-gray-500 mb-4">
          <span className="font-medium">Created By:</span> {createdBy}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
<<<<<<< HEAD
            status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {status || 'Status Unknown'}
        </span>
        <div className="flex items-center gap-1">
          <FaUsers />
          <span>{members} members</span>
=======
            status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {status || "Status Unknown"}
        </span>
        <div className="flex items-center gap-1">
          <FaUsers />
          <span>
            {membersCount} member{membersCount !== 1 ? "s" : ""}
          </span>
>>>>>>> origin/frontend/dev-erina
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default TeamCard;
=======
export default TeamCard;
>>>>>>> origin/frontend/dev-erina
