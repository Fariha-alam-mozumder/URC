import React from 'react';

const TeamActivity = () => {
  const activities = [
    { user: 'John Smith', action: 'submitted a new paper', time: '2 hours ago' },
    { user: 'Emma Davis', action: 'updated paper status', time: '4 hours ago' },
    { user: 'Michael Chen', action: 'received reviewer feedback', time: '1 day ago' },
  ];

  return (
    <div className="bg-white rounded-lg p-4 shadow-md flex-1">
      <h3 className="font-bold text-lg mb-4">Team Activity</h3>
      <ul className="space-y-2">
        {activities.map((item, idx) => (
          <li key={idx} className="text-sm text-gray-700">
            <span className="font-medium">{item.user}</span> {item.action}
            <span className="block text-xs text-gray-500">{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamActivity;
