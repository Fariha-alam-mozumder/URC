// frontend/src/components/Common/ReviewTable.jsx
import React from 'react';
import { Eye, FileText, Download } from 'lucide-react';
import { resolveBackendUrl } from '../../config/api';

const ReviewTable = ({ data, loading, pagination, onPageChange }) => {
  const handleViewDetails = (reviewId) => {
    // Implement navigation to review details or modal
    console.log('View review details:', reviewId);
    // You could use React Router: navigate(`/reviewer/review/${reviewId}`);
  };

  const handleDownloadAttachment = (attachmentPath) => {
    if (attachmentPath) {
      const downloadUrl = resolveBackendUrl(attachmentPath);
      window.open(downloadUrl, '_blank');
    }
  };

  const getStatusBadge = (status, colorClass) => {
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colorClass || getDefaultColorClass(status)}`}>
        {status}
      </span>
    );
  };

  const getDefaultColorClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-600';
      case 'Needs Revision':
        return 'bg-yellow-100 text-yellow-600';
      case 'Rejected':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const renderPagination = () => {
    if (!pagination || pagination.total_pages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.current_page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.total_pages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-4">
        <button
          onClick={() => onPageChange(pagination.current_page - 1)}
          disabled={pagination.current_page === 1}
          className="px-3 py-2 text-sm bg-white border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 text-sm border rounded-md ${
              page === pagination.current_page
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(pagination.current_page + 1)}
          disabled={pagination.current_page === pagination.total_pages}
          className="px-3 py-2 text-sm bg-white border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    );
  };

  if (loading && data.length === 0) {
    return (
      <div className="bg-white rounded shadow-sm border p-8">
        <div className="text-center text-gray-500">Loading reviews...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded shadow-sm border p-8">
        <div className="text-center text-gray-500">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p>No reviews found</p>
          <p className="text-sm">Try adjusting your search filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow-sm border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3 font-medium text-gray-900">ID</th>
              <th className="p-3 font-medium text-gray-900">Research Title</th>
              <th className="p-3 font-medium text-gray-900">Team</th>
              <th className="p-3 font-medium text-gray-900">Type</th>
              <th className="p-3 font-medium text-gray-900">Date</th>
              <th className="p-3 font-medium text-gray-900">Status</th>
              <th className="p-3 font-medium text-gray-900">Score</th>
              <th className="p-3 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {row.submission_id}
                  </span>
                </td>
                <td className="p-3">
                  <div className="font-medium text-gray-900 mb-1">{row.title}</div>
                  <div className="text-xs text-gray-500 line-clamp-2">{row.description}</div>
                  {row.domain && (
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 mt-1">
                      {row.domain}
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <div className="font-medium text-gray-900">{row.team}</div>
                  {row.submitted_by && (
                    <div className="text-xs text-gray-500">by {row.submitted_by}</div>
                  )}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    row.submission_type === 'Paper' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {row.submission_type}
                  </span>
                </td>
                <td className="p-3 text-gray-600">{row.date}</td>
                <td className="p-3">
                  {getStatusBadge(row.status, row.statusColorClass)}
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">{row.score}</span>
                    <span className="text-gray-400">/5</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewDetails(row.id)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                      title="View Details"
                    >
                      <Eye size={16} />
                      <span className="hidden sm:inline">View</span>
                    </button>
                    {row.attachment_path && (
                      <button
                        onClick={() => handleDownloadAttachment(row.attachment_path)}
                        className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm"
                        title="Download Attachment"
                      >
                        <Download size={16} />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {renderPagination()}

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default ReviewTable;