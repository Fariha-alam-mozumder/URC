import React, { useState } from "react";
import { Eye, Bot, PlusCircle } from "lucide-react";

const PaperCard = ({
  id,
  title,
  abstract,
  author,
  submissionDate,
  domain,
  file_path,
  onAssign,
  onAutoMatch,
}) => {
  const [openPdf, setOpenPdf] = useState(false);

  return (
    <div className="bg-white p-6 rounded shadow-sm border space-y-4">
      {/* Top row */}
      <div className="flex items-center space-x-2 text-sm">
        <span className="bg-gray-100 px-2 py-1 rounded">{id}</span>
        <span className="bg-gray-100 px-2 py-1 rounded">{domain}</span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">{author}</p>
      <p className="text-xs text-gray-400">Submitted: {submissionDate}</p>

      {/* Abstract */}
      <div>
        <h4 className="text-sm font-medium">Abstract Preview</h4>
        <p className="bg-gray-50 p-3 text-sm text-gray-600 rounded">
          {abstract}
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        {/* View PDF */}
        <button
          onClick={() => file_path && setOpenPdf(true)}
          disabled={!file_path}
          className={`flex items-center gap-1 text-sm border px-3 py-1 rounded hover:bg-gray-100 ${
            !file_path ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Eye size={16} /> View
        </button>

        {/* Auto Match */}
        {onAutoMatch && (
          <button
            onClick={onAutoMatch}
            className="flex items-center gap-1 text-sm border px-3 py-1 rounded text-indigo-600 hover:bg-indigo-50"
          >
            <Bot size={16} /> Auto Match
          </button>
        )}

        {/* Assign */}
        <button
          onClick={onAssign}
          className="flex items-center gap-1 text-sm bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
        >
          <PlusCircle size={16} /> Assign
        </button>
      </div>

      {/* PDF Modal */}
      {openPdf && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setOpenPdf(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={file_path}
              className="flex-1 w-full border rounded"
              title="PDF Viewer"
            />
            <button
              onClick={() => setOpenPdf(false)}
              className="mt-4 bg-black text-white px-4 py-2 rounded self-end hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaperCard;
