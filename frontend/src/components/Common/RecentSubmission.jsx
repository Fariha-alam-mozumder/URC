import React from 'react';
import { FaRegEye } from 'react-icons/fa';

const RecentSubmission = () => {
  const data = [
    { title: 'Machine Learning in Healthcare', status: 'Under Review', submitted: '2 days ago' },
    { title: 'AI Ethics Framework', status: 'Assigned', submitted: '5 days ago' },
    { title: 'Data Privacy Research', status: 'Pending', submitted: '1 week ago' },
  ];

  return (
    <div className="bg-white rounded-lg p-4 shadow-md flex-1">
      <h3 className="font-bold text-lg mb-4">Recent Submissions</h3>
      <ul className="space-y-2">
        {data.map((item, idx) => (
          <li
            key={idx}
            className="border p-3 rounded-md flex justify-between items-center hover:bg-gray-50"
          >
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-500">Submitted {item.submitted}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                {item.status}
              </span>
              <button
                className="p-2 rounded-md hover:bg-gray-100"
                title="View Submission"
                onClick={() => console.log(`Viewing: ${item.title}`)}
              >
                <FaRegEye className="text-gray-600" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSubmission;
