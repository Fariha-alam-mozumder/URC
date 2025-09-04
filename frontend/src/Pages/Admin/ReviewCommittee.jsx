import React, { useState, useEffect } from "react";
import StatCard from "../../components/Common/statCard";
import ReviewerRow from "../../components/Admin/ReviewerRow";
import { Users, CheckCircle, Clock, UserPlus } from "lucide-react";
import CommonButton from "../../components/Common/CommonButton";
import AddReviewerModal from "../../components/Admin/AddReviewerModal";
import axios from "axios";

const ReviewerCommittee = () => {
  const [showModal, setShowModal] = useState(false);
  const [reviewers, setReviewers] = useState([]);
  const [potentialReviewers, setPotentialReviewers] = useState([]);
  const [stats, setStats] = useState({
    totalReviewers: 0,
    activeReviewers: 0,
    completedReviews: 0,
    completionRate: 0,
    avgReviewTime: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL =
    import.meta.env.APP_URL || "http://localhost:8000/api";

  // Fetch reviewers and potential reviewers on mount
  useEffect(() => {
    (async () => {
      try {
        await fetchReviewers();
        await fetchPotentialReviewers();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fetchReviewers = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/reviewers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (data?.reviewers) setReviewers(data.reviewers);
      if (data?.stats) setStats(data.stats);
    } catch (err) {
      console.error("Error fetching reviewers:", err);
      setError("Failed to load reviewers");
    }
  };

  const fetchPotentialReviewers = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/reviewers/potential`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPotentialReviewers(data || []);
    } catch (err) {
      console.error("Error fetching potential reviewers:", err);
      setError("Failed to load potential reviewers");
      setPotentialReviewers([]);
    }
  };

  // Handle sending invitations to multiple reviewers
  const handleSendInvitation = async (selectedIds, customMessage = "") => {
    try {
      setError("");
      const invitationData = { reviewer_ids: selectedIds, custom_message: customMessage };
      await axios.post(`${API_BASE_URL}/reviewers/invite`, invitationData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      alert(`Invitations sent successfully to ${selectedIds.length} reviewer(s)!`);
      setShowModal(false);
      fetchReviewers();
    } catch (err) {
      console.error("Error sending invitations:", err);
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(", ");
        setError(`Validation error: ${errorMessages}`);
      } else {
        setError(err.response?.data?.message || "Failed to send invitations");
      }
    }
  };

  // Handle adding reviewer manually
  const handleAddReviewer = async (teacherId, domainIds = []) => {
    try {
      setError("");
      await axios.post(
        `${API_BASE_URL}/reviewers/add`,
        { teacher_id: teacherId, domain_ids: domainIds },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" } }
      );
      await Promise.all([fetchReviewers(), fetchPotentialReviewers()]);
      setShowModal(false);
    } catch (err) {
      if (err.response?.status === 409) {
        await Promise.all([fetchReviewers(), fetchPotentialReviewers()]);
        setShowModal(false);
        return;
      }
      console.error("Error adding reviewer:", err);
      const msg = err.response?.data?.error || err.response?.data?.message || "Failed to add reviewer";
      setError(msg);
    }
  };

  // Handle reviewer status update
  const handleUpdateReviewerStatus = async (reviewerId, status) => {
    try {
      await axios.put(
        `${API_BASE_URL}/reviewers/${reviewerId}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" } }
      );
      fetchReviewers();
    } catch (err) {
      console.error("Error updating reviewer status:", err);
      setError("Failed to update reviewer status");
    }
  };

  // Handle deleting a reviewer
  const handleDeleteReviewer = async (reviewerId) => {
    if (!window.confirm("Are you sure you want to delete this reviewer?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/reviewers/${reviewerId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Reviewer deleted successfully!");
      fetchReviewers();
    } catch (err) {
      console.error("Error deleting reviewer:", err);
      setError("Failed to delete reviewer");
    }
  };

  // Handle sending mail to a reviewer
  const handleSendMail = async (reviewerId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/reviewers/invite`,
        { reviewer_ids: [reviewerId] },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Email sent!");
    } catch (err) {
      console.error("Error sending mail:", err);
      setError("Failed to send mail");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading reviewer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="mb-6 text-xl sm:text-2xl font-bold truncate w-full sm:w-auto">Review Committee</h1>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
          <button onClick={() => setError("")} className="text-red-800 hover:text-red-900 font-medium text-sm mt-1">Dismiss</button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 mb-4 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title="Total Reviewers" value={stats.totalReviewers?.toString() || "0"} subtitle={`${stats.activeReviewers || 0} active`} icon={<Users className="text-blue-500" size={24} />} />
        <StatCard title="Completed Reviews" value={stats.completedReviews?.toString() || "0"} subtitle={`${stats.completionRate || 0}% completion rate`} icon={<CheckCircle className="text-green-500" size={24} />} />
        <StatCard title="Avg Review Time" value={stats.avgReviewTime ? `${stats.avgReviewTime} days` : "N/A"} subtitle={stats.avgReviewTime ? "Within target" : "No data"} icon={<Clock className="text-yellow-500" size={24} />} />
      </div>

      {/* Review Committee Table */}
      <div className="bg-white p-6 rounded shadow-sm border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2 className="text-lg font-bold">Review Committee Members</h2>
          <CommonButton icon={UserPlus} label="Add Reviewer" onClick={() => setShowModal(true)} className="min-w-[120px]" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3">Reviewer</th>
                <th className="p-3">Expertise</th>
                <th className="p-3">Assigned</th>
                <th className="p-3">Completed</th>
                <th className="p-3">Workload</th>
                <th className="p-3">Avg Time</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviewers.length > 0 ? (
                reviewers.map((reviewer) => (
                  <ReviewerRow
                    key={reviewer.id}
                    {...reviewer}
                    onStatusUpdate={(status) => handleUpdateReviewerStatus(reviewer.id, status)}
                    onDelete={() => handleDeleteReviewer(reviewer.id)}
                    onSendMail={() => handleSendMail(reviewer.id)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-6 text-gray-500">
                    {error ? "Failed to load reviewers data" : "No reviewers found. Click 'Add Reviewer' to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Reviewer Modal */}
      <AddReviewerModal
        show={showModal}
        onClose={() => setShowModal(false)}
        potentialReviewers={potentialReviewers}
        onSendInvitation={handleSendInvitation}
        onAddReviewer={handleAddReviewer}
        error={error}
      />
    </div>
  );
};

export default ReviewerCommittee;
