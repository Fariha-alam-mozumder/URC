// src/components/teacher/MyPapers/PaperCard.jsx
import React from 'react';
import { FaEdit, FaDownload, FaEye } from 'react-icons/fa';

const PaperCard = ({ paper }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
      {/* Top Info */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg mb-1">{paper.title}</h3>
          <p className="text-sm text-gray-500">{paper.team} | {paper.date}</p>
          <p className="text-xs text-gray-400">Last edited by {paper.lastEditor}</p>
        </div>
        <div className="text-xs text-right">
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full mr-2">{paper.status}</span>
          <span className="text-gray-500">{paper.role}</span>
        </div>
      </div>

      {/* Reviewers */}
      {paper.reviewers && paper.reviewers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium">Reviewer(s):</span>
          {paper.reviewers.map((r, i) => (
            <span
              key={i}
              className="bg-gray-100 text-sm px-2 py-1 rounded-full text-gray-700"
            >
              {r}
            </span>
          ))}
        </div>
      )}

      {/* Buttons and Comment */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <button className="flex items-center gap-1 text-sm px-3 py-1 border rounded hover:bg-gray-50">
            <FaEye /> View Details
          </button>
          <button className="flex items-center gap-1 text-sm px-3 py-1 border rounded hover:bg-gray-50">
            <FaEdit /> Edit
          </button>
          <button className="flex items-center gap-1 text-sm px-3 py-1 border rounded hover:bg-gray-50">
            <FaDownload /> Download
          </button>
        </div>
        {paper.comments !== undefined && (
          <span className="text-sm text-gray-500">{paper.comments} Comment{paper.comments !== 1 && 's'}</span>
        )}
      </div>
    </div>
  );
};

export default PaperCard;
