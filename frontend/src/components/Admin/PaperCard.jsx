import React from "react";

const PaperCard = ({
  id,
  category,
  title,
  authors,
  submittedDate,
  abstract,
  keywords = [],
  onView,
  onAssign,
}) => {
  return (
    <div className="bg-white p-6 rounded shadow-sm border space-y-4">
      {/* Top row */}
      <div className="flex items-center space-x-2 text-sm">
        <span className="bg-gray-100 px-2 py-1 rounded">{id}</span>
        <span className="bg-gray-100 px-2 py-1 rounded">{category}</span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">{authors}</p>
      <p className="text-xs text-gray-400">Submitted: {submittedDate}</p>

      {/* Abstract */}
      <div>
        <h4 className="text-sm font-medium">Abstract Preview</h4>
        <p className="bg-gray-50 p-3 text-sm text-gray-600 rounded">{abstract}</p>
      </div>

      {/* Keywords */}
      <div>
        <h4 className="text-sm font-medium">Keywords</h4>
        <div className="flex flex-wrap gap-2 mt-1">
          {keywords.map((kw, i) => (
            <span key={i} className="bg-gray-100 px-2 py-1 rounded text-xs">
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          aria-label={`View paper ${id}`}
          onClick={onView}
          className="flex items-center gap-1 text-sm border px-3 py-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          👁 View
        </button>
        <button
          type="button"
          aria-label={`Assign paper ${id}`}
          onClick={onAssign}
          className="flex items-center gap-1 text-sm bg-black text-white px-3 py-1 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          ➕ Assign
        </button>
      </div>
    </div>
  );
};

export default PaperCard;
