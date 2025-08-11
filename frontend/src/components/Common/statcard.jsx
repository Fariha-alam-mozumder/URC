import React from 'react';

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="flex items-center space-x-4 bg-white p-6 rounded shadow-sm border">
      <div className="bg-gray-100 p-3 rounded">{icon}</div>
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  );
};

export default StatCard;