// components/Common/ReviewTable.jsx
import React from 'react';

const ReviewTable = ({ data }) => {
  return (
    <div className="bg-white rounded shadow-sm border">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-3">Research Title</th>
            <th className="p-3">Team</th>
            <th className="p-3">Date</th>
            <th className="p-3">Status</th>
            <th className="p-3">Score</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="p-3">
                <div className="font-medium">{row.title}</div>
                <div className="text-xs text-gray-500">{row.description}</div>
              </td>
              <td className="p-3">{row.team}</td>
              <td className="p-3">{row.date}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-xs font-medium
                  ${row.status === 'Approved' ? 'bg-green-100 text-green-600' :
                    row.status === 'Needs Revision' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'}`}>
                  {row.status}
                </span>
              </td>
              <td className="p-3">{row.score}/5</td>
              <td className="p-3 text-blue-600 hover:underline cursor-pointer">View</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewTable;
