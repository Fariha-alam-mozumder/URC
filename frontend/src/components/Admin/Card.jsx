import React from "react";

const Card = ({ icon, title, children, className = "" }) => (
  <div
    className={`bg-white shadow-md rounded-lg p-6 flex flex-col h-full hover:shadow-lg transition-shadow ${className}`}
  >
    <div className="flex items-center mb-4 space-x-3 text-gray-700">
      {icon}
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <div className="flex-grow">{children}</div>
  </div>
);

export default Card;
