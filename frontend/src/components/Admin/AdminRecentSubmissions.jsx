// components/Admin/AdminRecentSubmission.jsx-------new file by ekra
import React, { useEffect, useRef, useState } from "react";
import { FaRegEye, FaFilter } from "react-icons/fa";
import axios from "axios";

const AdminRecentSubmission = ({ limit = 10 }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: '', // '', 'PAPER', or 'PROPOSAL'
    startDate: '',
    endDate: '',
    teamId: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const didFetch = useRef(false);

  const BASE = "http://localhost:8000";
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchSubmissions = async (queryFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (queryFilters.type) params.append('type', queryFilters.type);
      if (queryFilters.startDate) params.append('startDate', queryFilters.startDate);
      if (queryFilters.endDate) params.append('endDate', queryFilters.endDate);
      if (queryFilters.teamId) params.append('teamId', queryFilters.teamId);

      const response = await axios.get(
        `${BASE}/api/admin/recent-submissions?${params.toString()}`, 
        { headers, withCredentials: true }
      );

      if (response.data.success) {
        // Transform the data to unified format
        const transformedSubmissions = response.data.submissions.map(submission => ({
          id: submission.submissionType === 'PAPER' ? submission.paper_id : submission.proposal_id,
          title: submission.title,
          team: submission.team?.team_name || "Unknown Team",
          teacher: submission.teacher?.user?.name || "Unknown Teacher",
          created_at: submission.created_at,
          status: submission.status,
          type: submission.submissionType.toLowerCase(), // 'paper' or 'proposal'
          download_url: submission.pdf_path ? `${BASE}/${submission.pdf_path}` : null,
          hasReview: submission.review && submission.review.length > 0,
          reviewerAssigned: submission.reviewerassignment && submission.reviewerassignment.length > 0
        })).slice(0, limit);

        setSubmissions(transformedSubmissions);
      }
    } catch (err) {
      console.error("Error fetching admin recent submissions:", err);
      setError(err.response?.data?.error || "Failed to load recent submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    fetchSubmissions();
  }, []);

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const applyFilters = () => {
    fetchSubmissions(filters);
  };

  const resetFilters = () => {
    const emptyFilters = {
      type: '',
      startDate: '',
      endDate: '',
      teamId: ''
    };
    setFilters(emptyFilters);
    fetchSubmissions(emptyFilters);
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const then = new Date(dateString);
    const diff = Math.max(0, now - then);
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return mins <= 1 ? "1 minute ago" : `${mins} minutes ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs === 1 ? "1 hour ago" : `${hrs} hours ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return days === 1 ? "1 day ago" : `${days} days ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    const months = Math.floor(days / 30);
    return months <= 1 ? "1 month ago" : `${months} months ago`;
  };

  const toDisplayStatus = (s) => {
    const map = {
      PENDING: "PENDING",
      UNDER_REVIEW: "UNDER REVIEW",
      ACCEPTED: "ACCEPTED",
      REJECTED: "REJECTED",
    };
    return map[s] || s;
  };

  const statusClass = (displayStatus) => {
    switch (displayStatus) {
      case "UNDER REVIEW":
        return "bg-blue-100 text-blue-700";
      case "ACCEPTED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleView = async (submission) => {
    if (!submission.download_url) {
      alert("No PDF file available for this submission");
      return;
    }
    try {
      const head = await fetch(submission.download_url, { method: "HEAD", headers });
      if (head.ok) window.open(submission.download_url, "_blank");
      else if (head.status === 429)
        alert("Too many requests. Try again shortly.");
      else window.open(submission.download_url, "_blank");
    } catch {
      window.open(submission.download_url, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <p className="text-red-600">Error: {error}</p>
        <button 
          onClick={() => fetchSubmissions(filters)}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      {/* Header with Filter Toggle */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Recent Submissions</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          <FaFilter />
          Filters
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-4 p-3 bg-gray-50 rounded border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="PAPER">Papers Only</option>
              <option value="PROPOSAL">Proposals Only</option>
            </select>
            
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              placeholder="Start Date"
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              placeholder="End Date"
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <input
              type="number"
              value={filters.teamId}
              onChange={(e) => handleFilterChange('teamId', e.target.value)}
              placeholder="Team ID"
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No submissions found
        </div>
      ) : (
        <div className="space-y-2">
          {submissions.map((submission) => {
            const displayStatus = toDisplayStatus(submission.status);
            const timeAgo = getTimeAgo(submission.created_at);
            
            return (
              <div
                key={`${submission.type}-${submission.id}`}
                className="border p-3 rounded-md hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium mb-1" title={submission.title}>
                      {submission.title.length > 50
                        ? `${submission.title.slice(0, 50)}...`
                        : submission.title}
                    </p>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="capitalize font-medium">{submission.type}</span> • 
                        Team: {submission.team} • 
                        Teacher: {submission.teacher}
                      </p>
                      <p>
                        Submitted: {timeAgo}
                        {submission.reviewerAssigned && <span className=" ml-2 text-blue-600">• Reviewer Assigned</span>}
                        {submission.hasReview && <span className=" ml-2 text-green-600">• Reviewed</span>}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 ml-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${statusClass(displayStatus)}`}
                    >
                      {displayStatus}
                    </span>
                    <button
                      className="p-2 rounded-md hover:bg-gray-100 flex-shrink-0"
                      title={`View ${submission.title}`}
                      onClick={() => handleView(submission)}
                    >
                      <FaRegEye className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminRecentSubmission;