// components/Common/ChartCard.jsx
import React from "react";

const ChartCard = ({ title, children }) => {
  return (
    <div className="bg-white p-4 rounded shadow-sm border flex flex-col items-center">
      <div className="text-sm text-gray-600 font-semibold mb-2">{title}</div>
      <div className="flex items-center justify-center w-full">
        {children || "Chart Placeholder"}
      </div>
    </div>
  );
};

export default ChartCard;
