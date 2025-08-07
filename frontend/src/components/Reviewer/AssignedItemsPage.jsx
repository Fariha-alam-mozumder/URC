// components/AssignedItemsPage.jsx
import { Link } from 'react-router-dom';
import { FaDownload, FaEye, FaPen } from 'react-icons/fa';

const AssignedItemsPage = ({ title, description, items, reviewPathPrefix }) => {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div></div>
      </div>

      <p className="text-gray-600 mb-6">{description}</p>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow">
            <div className="text-sm text-gray-500 mb-1">ID: {item.id}</div>
            <h3 className="text-lg font-semibold mb-4">{item.title}</h3>

            {/* Buttons */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700">
                  <FaEye /> View
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100">
                  <FaDownload /> Download
                </button>
              </div>

              <Link to={`${reviewPathPrefix}${item.id}`}>
                <button className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 mt-2">
                  <FaPen /> Review
                </button>
              </Link>
            </div>

            {/* Due Date */}
            <div className="text-xs text-gray-900 mt-4 text-right">
              📅 Due: {item.due}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignedItemsPage;
