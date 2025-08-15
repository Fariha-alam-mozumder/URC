import React from "react";
import { FaTrashAlt,FaEnvelope } from "react-icons/fa";

const ReviewerRow = ({ avatar, name, email, expertise, assigned, completed, workload, avgTime, status }) => {
  return (
    <tr className="border-b">
      <td className="flex items-center space-x-3 p-3">
        
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-gray-500">{email}</div>
        </div>
      </td>
      <td className="p-3">
        <div className="flex flex-wrap gap-1">
          {expertise.map((skill, i) => (
            <span key={i} className="bg-gray-100 text-xs px-2 py-1 rounded">{skill}</span>
          ))}
        </div>
      </td>
      <td className="p-3 text-center align-middle">{assigned}</td>
      <td className="p-3 text-center align-middle">{completed}</td>
      <td className="p-3 text-center align-middle">{workload}</td>
      <td className="p-3">{avgTime} days</td>
      <td className="p-3">
        <span className={`px-2 py-1 rounded text-xs ${status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {status}
        </span>
      </td>
      <td className=" p-3 space-x-4">
       <button title="Delete" style={{ color: "red" }}>
  <FaTrashAlt size={20} />
</button>
      <button title="Mail">
  <FaEnvelope size={20} />
</button>
      </td>
    </tr>
  );
};

export default ReviewerRow;
