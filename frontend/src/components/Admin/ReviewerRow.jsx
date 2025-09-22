import React from "react";
import { FaTrashAlt, FaEnvelope } from "react-icons/fa";

const ReviewerRow = ({
  id,
  name,
  email,
  department,
  designation,
  expertise,
  assigned,
  completed,
  workload,
  avgTime,
  status,
  onDelete,
  onSendMail,
  onStatusUpdate,
}) => {
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    if (newStatus !== status) {
      onStatusUpdate(newStatus);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-700';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3">
        <div>
          <div className="font-medium text-gray-900">{name || 'N/A'}</div>
          <div className="text-xs text-gray-500">{email || 'N/A'}</div>
          <div className="text-xs text-gray-400">{department || 'N/A'} • {designation || 'N/A'}</div>
        </div>
      </td>
      <td className="p-3">
        <div className="flex flex-wrap gap-1">
          {expertise && expertise.length > 0 ? (
            expertise.map((skill, i) => (
              <span 
                key={i} 
                className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400 italic">No expertise listed</span>
          )}
        </div>
      </td>
      <td className="p-3 text-center">
        <span className="font-medium">{assigned || 0}</span>
      </td>
      <td className="p-3 text-center">
        <span className="font-medium">{completed || 0}</span>
      </td>
      <td className="p-3 text-center">
        <div className="flex items-center justify-center">
          <span className="font-medium mr-2">{workload || 0}%</span>
          <div className="w-12 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                (workload || 0) > 80 
                  ? 'bg-red-500' 
                  : (workload || 0) > 60 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(workload || 0, 100)}%` }}
            ></div>
          </div>
        </div>
      </td>
      <td className="p-3 text-center">
        <span className="font-medium">
          {avgTime !== null && avgTime !== undefined ? `${avgTime} days` : 'N/A'}
        </span>
      </td>
      <td className="p-3">
        <select
          value={status || 'PENDING'}
          onChange={handleStatusChange}
          className={`px-2 py-1 rounded text-xs border-none outline-none cursor-pointer ${getStatusColor(status)}`}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="PENDING">Pending</option>
        </select>
      </td>
      <td className="p-3">
        <div className="flex items-center space-x-2">
          {/* Send Mail button */}
          <button
            title="Send Invitation Email"
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded transition-colors"
            onClick={() => onSendMail(id)}
          >
            <FaEnvelope size={16} />
          </button>

          {/* Delete button */}
          <button
            title="Remove Reviewer"
            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
            onClick={() => onDelete(id)}
          >
            <FaTrashAlt size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ReviewerRow;