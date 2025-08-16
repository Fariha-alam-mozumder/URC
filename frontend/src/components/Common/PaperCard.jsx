// src/components/Common/PaperCard.jsx
import React from 'react';
import { FaEdit, FaDownload, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

/**
 * Props:
 * - paper: {
 *     id, title, team, date, lastEditor, status, role,
 *     reviewers?: string[], comments?: number,
 *     fileUrl?: string // for download
 *   }
 * - role?: 'teacher' | 'student'                // controls default permissions & routing
 * - basePath?: string                           // optional: override (e.g. '/teacher' or '/student')
 * - canEdit?: boolean                           // optional: override edit permission
 * - onView?:   (paper) => void                  // optional custom handlers
 * - onEdit?:   (paper) => void
 * - onDownload?: (paper) => void
 */
const PaperCard = ({
  paper,
  role = 'teacher',
  basePath,
  canEdit,
  onView,
  onEdit,
  onDownload,
}) => {
  const navigate = useNavigate();

  // infer defaults
  const resolvedBasePath = basePath || (role === 'student' ? '/student' : '/teacher');
  const allowEdit = typeof canEdit === 'boolean' ? canEdit : role === 'teacher';

  const handleView = () => {
    if (onView) return onView(paper);
    navigate(`${resolvedBasePath}/papers/${encodeURIComponent(paper.id)}`);
  };

  const handleEdit = () => {
    if (!allowEdit) return;
    if (onEdit) return onEdit(paper);
    navigate(`${resolvedBasePath}/papers/${encodeURIComponent(paper.id)}/edit`);
  };

  const handleDownload = (e) => {
    if (onDownload) {
      e.preventDefault();
      return onDownload(paper);
    }
    // default: if fileUrl exists, let the <a> element handle it
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
      {/* Top Info */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg mb-1">{paper.title}</h3>
          <p className="text-sm text-gray-500">
            {paper.team} | {paper.date}
          </p>
          <p className="text-xs text-gray-400">Last edited by {paper.lastEditor}</p>
        </div>
        <div className="text-xs text-right">
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full mr-2">
            {paper.status}
          </span>
          <span className="text-gray-500">{paper.role}</span>
        </div>
      </div>

      {/* Reviewers */}
      {!!paper.reviewers?.length && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium">Reviewer(s):</span>
          {paper.reviewers.map((r, i) => (
            <span key={i} className="bg-gray-100 text-sm px-2 py-1 rounded-full text-gray-700">
              {r}
            </span>
          ))}
        </div>
      )}

      {/* Actions + comments */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {/* View */}
          <button
            onClick={handleView}
            className="flex items-center gap-1 text-sm px-3 py-1 border rounded hover:bg-gray-50"
          >
            <FaEye /> View Details
          </button>

          {/* Edit (teacher only unless canEdit passed true) */}
          {allowEdit && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-1 text-sm px-3 py-1 border rounded hover:bg-gray-50"
            >
              <FaEdit /> Edit
            </button>
          )}

          {/* Download (everyone). If fileUrl exists we use <a download>, else onDownload handles it */}
          {paper.fileUrl ? (
            <a
              href={paper.fileUrl}
              download
              onClick={handleDownload}
              className="flex items-center gap-1 text-sm px-3 py-1 border rounded hover:bg-gray-50"
            >
              <FaDownload /> Download
            </a>
          ) : (
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 text-sm px-3 py-1 border rounded hover:bg-gray-50"
              title="Download"
            >
              <FaDownload /> Download
            </button>
          )}
        </div>

        {paper.comments !== undefined && (
          <span className="text-sm text-gray-500">
            {paper.comments} Comment{paper.comments !== 1 && 's'}
          </span>
        )}
      </div>
    </div>
  );
};

export default PaperCard;
