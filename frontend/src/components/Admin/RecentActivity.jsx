import React from 'react';

const activities = [
  { message: 'Paper "AI in Healthcare" submitted for review', time: '2 hours ago' },
  { message: 'Review completed for "Machine Learning Trends"', time: '4 hours ago' },
  { message: 'New reviewer added to Program Committee', time: '1 day ago' },
];

const RecentActivity = () => {
  return (
    <div className="bg-white p-6 rounded shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <ul className="space-y-4">
        {activities.map((activity, index) => (
          <li key={index} className="flex space-x-3 items-start">
            <span className="w-2 h-2 mt-2 rounded-full bg-gray-400"></span>
            <div>
              <p className="text-sm font-medium text-gray-800">{activity.message}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
