import React from "react";
import { FaDownload, FaEye, FaFilePdf, FaFileAlt } from "react-icons/fa";
import Card from "./Card";
import { resolveApiUrl } from "../../config/api";

function TeamPapersCard({ title, papers, icon }) {

  const handleView = async (paper) => {
    try {
      // Construct the view URL based on paper type and id
      let viewUrl = '';
      
      if (paper.type === 'paper') {
        viewUrl = resolveApiUrl(`/papers/${paper.id}/view`);
      } else if (paper.type === 'proposal') {
        viewUrl = resolveApiUrl(`/proposals/${paper.id}/view`);
      } else {
        // Fallback for older data structure
        alert('Unable to determine document type');
        return;
      }
      
      window.open(viewUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error viewing paper:', error);
      alert('Unable to view this document at the moment');
    }
  };

  const handleDownload = async (paper) => {
    try {
      let downloadUrl = '';
      
      if (paper.type === 'paper') {
        downloadUrl = resolveApiUrl(`/papers/${paper.id}/download`);
      } else if (paper.type === 'proposal') {
        downloadUrl = resolveApiUrl(`/proposals/${paper.id}/download`);
      } else {
        alert('Unable to determine document type');
        return;
      }
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = paper.title;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading paper:', error);
      alert('Unable to download this document at the moment');
    }
  };

  const getFileIcon = (paper) => {
    if (paper.type === 'proposal') {
      return <FaFileAlt className="text-blue-500 mr-2" size={16} />;
    }
    return <FaFilePdf className="text-red-500 mr-2" size={16} />;
  };

  const formatTitle = (title) => {
    // Remove file extensions and clean up the title
    return title.replace(/\.(pdf|docx|doc)$/i, '');
  };

  return (
    <Card title={title} icon={icon}>
      <div className="space-y-3">
        {papers.length === 0 && (
          <p className="text-gray-500 italic">No papers found.</p>
        )}
        {papers.map((paper) => (
          <div
            key={`${paper.type || 'unknown'}-${paper.id}`}
            className="flex items-start justify-between border-b pb-3 last:border-none"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-1">
                {getFileIcon(paper)}
                <p className="font-medium text-gray-900 truncate" title={paper.title}>
                  {formatTitle(paper.title)}
                </p>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Submitted: {paper.date}</p>
                {paper.type && (
                  <p className="capitalize">
                    Type: <span className="font-medium">{paper.type}</span>
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex space-x-2 ml-3 flex-shrink-0">
              <button
                onClick={() => handleView(paper)}
                aria-label={`View ${paper.title}`}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="View document"
              >
                <FaEye size={16} />
              </button>
              <button
                onClick={() => handleDownload(paper)}
                aria-label={`Download ${paper.title}`}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                title="Download document"
              >
                <FaDownload size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default TeamPapersCard;