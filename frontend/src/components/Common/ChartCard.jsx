// components/Common/ChartCard.jsx
import React from 'react';

const ChartCard = ({ title, children }) => {
  return (
    <div className="bg-white p-4 rounded shadow-sm border">
      <div className="text-sm text-gray-600 font-semibold mb-2">{title}</div>
      <div className="h-48 flex items-center justify-center text-gray-400">
        {children || 'Chart Placeholder'}
      </div>
    </div>
  );
};

export default ChartCard;
