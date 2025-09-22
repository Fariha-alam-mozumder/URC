// src/components/Teacher/TeamManagement/DocumentList.jsx
import React, { useState } from 'react';
import { FaFileAlt, FaTrash, FaDownload, FaUpload, FaEye, FaFilePdf } from 'react-icons/fa';
import { resolveBackendUrl } from '../../../config/api';

const fmt = (bytes) => {
  if (bytes == null) return '';
  const units = ['B','KB','MB','GB']; 
  let i = 0; 
  let v = bytes;
  while (v >= 1024 && i < units.length - 1) { 
    v /= 1024; 
    i++; 
  }
  return `${v.toFixed(1)} ${units[i]}`;
};

/**
 * Enhanced DocumentList Component
 * Props:
 * - documents: [{ id, name, type, sizeBytes, uploadedAt, uploadedBy, href, status, abstract, domain }]
 * - canManage?: boolean (default true) -> shows Upload & Delete when true
 * - onUploadClick?: () => void
 * - onDelete?: (doc) => void
 * - onDownload?: (doc) => void
 * - loading?: boolean
 */
const DocumentList = ({
  documents = [],
  canManage = true,
  onUploadClick,
  onDelete,
  onDownload,
  loading = false,
}) => {
  const [expandedDoc, setExpandedDoc] = useState(null);

  const handleView = (doc) => {
    if (doc.href) {
      const targetUrl = resolveBackendUrl(doc.href);
      window.open(targetUrl, '_blank');
    } else {
      alert('Document not available for viewing.');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'under_review': return 'text-yellow-600 bg-yellow-100';
      case 'pending': 
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getDocumentIcon = (type) => {
    return type === 'Paper' ? FaFilePdf : FaFileAlt;
  };

  const toggleExpanded = (docId) => {
    setExpandedDoc(expandedDoc === docId ? null : docId);
  };

  if (loading) {
    return (
      <section className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Documents & Resources</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500">Loading documents...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Documents & Resources ({documents.length})</h3>

        {/* {canManage && (
          <button
            onClick={onUploadClick}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <FaUpload /> Upload
          </button>
        )} */}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaFileAlt className="mx-auto text-4xl mb-2 text-gray-300" />
            <p>No documents uploaded yet.</p>
            {canManage && (
              <p className="text-sm mt-1">Click "Upload" to add your first document.</p>
            )}
          </div>
        ) : (
          documents.map((doc) => {
            const IconComponent = getDocumentIcon(doc.type);
            const isExpanded = expandedDoc === doc.id;
            
            return (
              <div
                key={doc.id}
                className="border rounded-lg p-3 hover:shadow-sm transition-shadow"
              >
                {/* Main Document Info */}
                <div className="flex items-start justify-between">
                  <div 
                    className="flex items-start gap-3 flex-1 cursor-pointer"
                    onClick={() => toggleExpanded(doc.id)}
                  >
                    <IconComponent className="text-gray-500 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="font-medium text-sm truncate">{doc.name}</h4>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          {doc.type}
                        </span>
                        {doc.status && (
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(doc.status)}`}>
                            {doc.status.replace('_', ' ').toUpperCase()}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        <div>Uploaded by {doc.uploadedBy} • {doc.uploadedAt}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span>{fmt(doc.sizeBytes)}</span>
                          {doc.domain && (
                            <>
                              <span>•</span>
                              <span className="text-blue-600">{doc.domain}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 ml-3">
                    <button
                      onClick={() => handleView(doc)}
                      className="p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
                      title="View Document"
                      aria-label="View Document"
                    >
                      <FaEye className="text-sm" />
                    </button>

                    {canManage && onDelete && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${doc.name}"?`)) {
                            onDelete(doc);
                          }
                        }}
                        className="p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete"
                        aria-label="Delete"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && doc.abstract && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-sm">
                      <h5 className="font-medium text-gray-700 mb-2">Abstract:</h5>
                      <p className="text-gray-600 leading-relaxed">{doc.abstract}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default DocumentList;