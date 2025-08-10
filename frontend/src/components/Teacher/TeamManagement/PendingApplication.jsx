// components/teacher/PendingApplications.jsx
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const PendingApplications = ({ applications = [] }) => {
  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Pending Applications</h3>
        <button className="text-blue-600 text-sm hover:underline">View all</button>
      </div>

      {applications.length === 0 ? (
        <p className="text-gray-500">No pending applications.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app, index) => (
            <div
              key={index}
              className="flex items-start justify-between bg-gray-50 p-3 rounded border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <FaUserCircle className="text-2xl mt-1 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">{app.name}</p>
                  <p className="text-sm text-gray-500">
                    Wants to join <span className="font-medium text-gray-700">{app.team}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Applied {app.timeAgo}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button className="px-3 py-1 text-sm rounded bg-green-500 text-white hover:bg-green-600">
                  Approve
                </button>
                <button className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingApplications;
