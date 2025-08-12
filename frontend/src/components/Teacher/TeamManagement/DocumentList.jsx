// src/components/Teacher/TeamManagement/DocumentList.jsx
import React from 'react';
import { FaFileAlt, FaTrash, FaDownload, FaUpload } from 'react-icons/fa';

const fmt = (bytes) => {
  if (bytes == null) return '';
  const units = ['B','KB','MB','GB']; let i = 0; let v = bytes;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(1)} ${units[i]}`;
};

/**
 * Props:
 * - documents: [{ id, name, sizeBytes, uploadedAt (string|Date), href? }]
 * - canManage?: boolean (default true) -> shows Upload & Delete when true
 * - onUploadClick?: () => void
 * - onDelete?: (doc) => void
 * - onDownload?: (doc) => void   // optional; falls back to <a href>
 */
const DocumentList = ({
  documents = [],
  canManage = true,
  onUploadClick,
  onDelete,
  onDownload,
}) => {
  const handleDownload = (doc) => {
    if (onDownload) return onDownload(doc);
    // default: if a href exists, trigger a download
    if (doc.href) {
      const a = document.createElement('a');
      a.href = doc.href;
      a.download = doc.name || 'file';
      a.click();
    } else {
      console.log('Download requested for:', doc);
    }
  };

  return (
    <section className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Resources</h3>

        {canManage && (
          <button
            onClick={onUploadClick}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            <FaUpload /> Upload
          </button>
        )}
      </div>

      <div className="space-y-3">
        {documents.length === 0 && (
          <div className="text-sm text-gray-500">No documents yet.</div>
        )}

        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between border rounded-lg px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <FaFileAlt className="text-gray-500" />
              <div>
                <div className="font-medium text-sm">{doc.name}</div>
                <div className="text-xs text-gray-500">
                  Uploaded {doc.uploadedAt} • {fmt(doc.sizeBytes)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDownload(doc)}
                className="p-2 rounded hover:bg-gray-100"
                title="Download"
                aria-label="Download"
              >
                <FaDownload />
              </button>

              {canManage && (
                <button
                  onClick={() => onDelete?.(doc)}
                  className="p-2 rounded hover:bg-gray-100 text-red-600"
                  title="Delete"
                  aria-label="Delete"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DocumentList;
