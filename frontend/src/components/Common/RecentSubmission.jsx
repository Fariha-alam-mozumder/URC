import React, { useState, useEffect } from 'react';
import { FaRegEye } from 'react-icons/fa';
import axios from 'axios';

const RecentSubmission = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch papers from API
  useEffect(() => {
    const fetchRecentPapers = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get("http://localhost:8000/api/student/my-teams/papers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });

        // Get only the 3 most recent papers for dashboard
        const recentPapers = res.data.data.slice(0, 3);
        setPapers(recentPapers);
      } catch (err) {
        console.error("Error fetching recent papers:", err);
        setError("Failed to load recent submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPapers();
  }, []);

  // Helper function to calculate time ago
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const paperDate = new Date(dateString);
    const diffTime = Math.abs(now - paperDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) {
      const weeks = Math.ceil(diffDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    }
    const months = Math.ceil(diffDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  };

  // Map database status to display status
  const getDisplayStatus = (dbStatus) => {
    const statusMap = {
      'PENDING': 'Pending',
      'UNDER_REVIEW': 'Under Review', 
      'ACCEPTED': 'Accepted',
      'REJECTED': 'Rejected'
    };
    return statusMap[dbStatus] || dbStatus;
  };

  // Map status to color styles
  const getStatusClass = (status) => {
    switch (status) {
      case 'Under Review':
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-700';
      case 'Accepted':
      case 'ACCEPTED':
        return 'bg-green-100 text-green-700';
      case 'Assigned':
        return 'bg-green-100 text-green-700';
      case 'Rejected':
      case 'REJECTED':
        return 'bg-red-100 text-red-700';
      case 'Submitted':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
      case 'PENDING':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

   const handleViewSubmission = async (paper) => {
    console.log(`Viewing paper: ${paper.title}`);
    
    if (!paper.download_url) {
      alert('No PDF file available for this paper');
      return;
    }

    try {
      // Test if the file is accessible before opening
      const response = await fetch(paper.download_url, { 
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        }
      });

      if (response.ok) {
        // File is accessible, open it
        window.open(paper.download_url, '_blank');
      } else if (response.status === 429) {
        alert('Too many requests. Please wait a moment and try again.');
      } else {
        alert('Unable to access the PDF file. Please try again later.');
      }
    } catch (error) {
      console.error('Error accessing PDF:', error);
      // Fallback: try to open anyway
      window.open(paper.download_url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-md flex-1">
        <h3 className="font-bold text-lg mb-4">Recent Submissions</h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading recent submissions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-md flex-1">
        <h3 className="font-bold text-lg mb-4">Recent Submissions</h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-md flex-1">
      <h3 className="font-bold text-lg mb-4">Recent Submissions</h3>
      
      {papers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No recent submissions found</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {papers.map((paper) => {
            const displayStatus = getDisplayStatus(paper.status);
            const timeAgo = getTimeAgo(paper.created_at);
            
            return (
              <li
                key={paper.paper_id}
                className="border p-3 rounded-md flex justify-between items-center hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium" title={paper.title}>
                    {/* Truncate long titles for dashboard */}
                    {paper.title.length > 40 
                      ? `${paper.title.substring(0, 40)}...` 
                      : paper.title
                    }
                  </p>
                  <p className="text-sm text-gray-500">
                    Submitted {timeAgo} • {paper.team?.team_name}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(displayStatus)}`}>
                    {displayStatus}
                  </span>
                  <button
                    className="p-2 rounded-md hover:bg-gray-100"
                    title={`View ${paper.title}`}
                    onClick={() => handleViewSubmission(paper)}
                  >
                    <FaRegEye className="text-gray-600" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      
      {/* Show link to view all papers if there are submissions */}
      {/* {papers.length > 0 && (
        <div className="mt-4 text-center">
          <button 
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            onClick={() => {
              // Navigate to full papers page
              // navigate('/student/papers');
              console.log('Navigate to all papers');
            }}
          >
            View all submissions →
          </button>
        </div>
      )} */}
    </div>
  );
};

export default RecentSubmission;