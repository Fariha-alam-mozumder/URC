// components/Teacher/TeamManagement/PendingApplication.jsx
import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaCheck, FaTimes, FaEnvelope, FaIdBadge, FaTags } from 'react-icons/fa';
import axios from 'axios';

const PendingApplications = ({ teamId, onApplicationProcessed }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    if (teamId) {
      fetchApplications();
    }
  }, [teamId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8000/api/teams/${teamId}/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data.data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplication = async (applicationId, action) => {
    try {
      setProcessing(prev => ({ ...prev, [applicationId]: true }));
      const token = localStorage.getItem("token");
      
      await axios.patch(`http://localhost:8000/api/applications/${applicationId}`, {
        status: action.toUpperCase()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove processed application from list
      setApplications(prev => prev.filter(app => app.application_id !== applicationId));
      
      if (onApplicationProcessed) {
        onApplicationProcessed(action);
      }
    } catch (err) {
      console.error(`Error ${action}ing application:`, err);
      alert(`Failed to ${action} application. Please try again.`);
    } finally {
      setProcessing(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  const DomainTags = ({ domains, matchingDomains }) => {
    if (!domains || domains.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {domains.map((domain, index) => {
          const isMatching = matchingDomains && matchingDomains.includes(domain);
          return (
            <span
              key={index}
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isMatching
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
              title={isMatching ? 'Matching domain with creator' : 'Student domain'}
            >
              {domain}
            </span>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded shadow h-full flex flex-col">
        <h3 className="text-lg font-semibold mb-4">Pending Applications</h3>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4">
        Pending Applications ({applications.length})
      </h3>

      <div className="flex-1 overflow-y-auto">
        {applications.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No pending applications.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div 
                key={app.application_id} 
                className="p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <FaUserCircle className="text-2xl text-gray-500 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-medium">{app.student.user.name}</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Student
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                      <FaEnvelope className="text-xs flex-shrink-0" />
                      <span className="truncate">{app.student.user.email}</span>
                    </div>
                    
                    {app.student.roll_number && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        <FaIdBadge className="text-xs flex-shrink-0" />
                        <span>Roll: {app.student.roll_number}</span>
                      </div>
                    )}

                    <DomainTags 
                      domains={app.student.user.domains || []} 
                      matchingDomains={app.student.user.matchingDomains || []}
                    />

                    {app.student.user.matchingDomains && app.student.user.matchingDomains.length > 0 && (
                      <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <FaTags className="text-xs flex-shrink-0" />
                        <span>
                          {app.student.user.matchingDomains.length} matching domain{app.student.user.matchingDomains.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 mt-2">
                      Applied: {new Date(app.applied_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleApplication(app.application_id, 'approve')}
                    disabled={processing[app.application_id]}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaCheck /> {processing[app.application_id] ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleApplication(app.application_id, 'reject')}
                    disabled={processing[app.application_id]}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaTimes /> {processing[app.application_id] ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingApplications;