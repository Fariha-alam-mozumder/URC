import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import StatCard from "../../components/Common/statCard";
import PaperCard from "../../components/Admin/PaperCard";
import AddReviewerModal from "../../components/Admin/AddReviewerModal";
import {
  Users,
  ClipboardList,
  CheckCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const WaitingAssignment = () => {
  const [showModal, setShowModal] = useState(false);
  const [potentialReviewers, setPotentialReviewers] = useState([]);
  const [papers, setPapers] = useState([]);
  const [stats, setStats] = useState({
    awaitingAssignment: 0,
    availableReviewers: 0,
    autoMatchAvailable: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPaper, setSelectedPaper] = useState(null);

  const { token } = useContext(AuthContext) || {};

  const getAuthHeaders = () => {
    const authToken = token || localStorage.getItem("token");
    return authToken ? { Authorization: `Bearer ${authToken}` } : {};
  };

  const fetchWaitingAssignments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:8000/api/assignments/waiting",
        { headers: getAuthHeaders() }
      );

      if (res.data) {
        const { waitingItems = [], stats: responseStats = {} } = res.data;

        setPapers(waitingItems);
        setStats({
          awaitingAssignment:
            responseStats.awaitingAssignment || waitingItems.length,
          availableReviewers: responseStats.availableReviewers || 0,
          autoMatchAvailable: responseStats.autoMatchAvailable || 0,
        });
        setError("");
      } else {
        setPapers([]);
      }
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const message =
          err.response.data?.message ||
          err.response.data?.error ||
          "Server error";

        if (status === 401) setError("Authentication required. Please login again.");
        else if (status === 403) setError("Access denied. Admin permissions required.");
        else if (status === 404) setError("API endpoint not found. Please check server configuration.");
        else setError(`Server error (${status}): ${message}`);
      } else if (err.request) {
        setError("Cannot connect to server. Please ensure the backend is running on http://localhost:8000");
      } else {
        setError(`Request failed: ${err.message}`);
      }

      setPapers([]);
      setStats({ awaitingAssignment: 0, availableReviewers: 0, autoMatchAvailable: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableReviewers = async (domainId = null, itemType = null, itemId = null) => {
    try {
      const params = {};
      if (domainId) params.domain_id = domainId;
      if (itemType) params.item_type = itemType;
      if (itemId) params.item_id = itemId;

      const res = await axios.get(
        "http://localhost:8000/api/assignments/reviewers",
        { headers: getAuthHeaders(), params }
      );

      if (Array.isArray(res.data)) {
        setPotentialReviewers(res.data);
      } else if (res.data.success && Array.isArray(res.data.data)) {
        setPotentialReviewers(res.data.data);
      } else {
        setPotentialReviewers([]);
      }
    } catch {
      setPotentialReviewers([]);
      // non-fatal; keep page usable
    }
  };

  useEffect(() => {
    fetchWaitingAssignments();
  }, []);

  const handleAssignClick = async (paper) => {
    setSelectedPaper(paper);
    await fetchAvailableReviewers(paper.domain_id, paper.type, paper.actual_id);
    setShowModal(true);
  };

  const handleAssignReviewers = async (reviewerIds) => {
    try {
      if (!selectedPaper || !reviewerIds.length) {
        alert("Please select at least one reviewer");
        return;
      }

      const payload = {
        assignments: [
          {
            item_id: selectedPaper.actual_id,
            item_type: selectedPaper.type === "paper" ? "paper" : "proposal",
            reviewer_ids: reviewerIds,
          },
        ],
      };

      const res = await axios.post(
        "http://localhost:8000/api/assignments/assign",
        payload,
        { headers: getAuthHeaders() }
      );

      const { success, results, message } = res.data || {};
      if (success) {
        setPapers((prev) => prev.filter((p) => p.id !== selectedPaper.id));
        setStats((prev) => ({
          ...prev,
          awaitingAssignment: Math.max(0, prev.awaitingAssignment - 1),
        }));
        setShowModal(false);
        setSelectedPaper(null);

        const msg =
          res.data.message ||
          `Successfully assigned ${reviewerIds.length} reviewers!`;
        alert(msg);
      } else {
        const failMsg =
          message ||
          results?.map((r) => `${r.item_id}: ${r.message}`).join("\n") ||
          "Assignment failed";
        alert(failMsg);
      }
    } catch (err) {
      let errorMessage = "Failed to assign reviewers. Please try again.";
      if (err.response?.data?.message) errorMessage = err.response.data.message;
      else if (err.response?.data?.error) errorMessage = err.response.data.error;
      alert(errorMessage);
    }
  };

  const handleAutoMatch = async (paper) => {
    try {
      const payload = {
        item_id: paper.actual_id,
        item_type: paper.type === "paper" ? "paper" : "proposal",
      };

      const res = await axios.post(
        "http://localhost:8000/api/assignments/auto-match",
        payload,
        { headers: getAuthHeaders() }
      );

      if (res.data) {
        if (res.data.recommendations) {
          const recommendedNames = res.data.recommendations
            .map((r) => r.name)
            .join(", ");
          const confirmMessage = `Found ${res.data.recommendations.length} recommended reviewers:\n${recommendedNames}\n\nAssign them automatically?`;

          if (confirm(confirmMessage)) {
            const reviewerIds = res.data.recommendations.map((r) => r.id);
            await handleAssignReviewers(reviewerIds);
          }
        } else {
          setPapers((prev) => prev.filter((p) => p.id !== paper.id));
          setStats((prev) => ({
            ...prev,
            awaitingAssignment: Math.max(0, prev.awaitingAssignment - 1),
            autoMatchAvailable: Math.max(0, prev.autoMatchAvailable - 1),
          }));
          const msg = res.data.message || "Auto-assignment completed successfully!";
          alert(msg);
        }
      }
    } catch (err) {
      let errorMessage = "Auto-assignment failed. Please try manual assignment.";
      if (err.response?.data?.message) errorMessage = err.response.data.message;
      else if (err.response?.data?.error) errorMessage = err.response.data.error;
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="max-w-full">
        <h2 className="text-2xl font-bold mb-4">Waiting Assignment</h2>
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center gap-2 text-lg text-gray-600">
            <RefreshCw className="animate-spin" size={20} />
            Loading assignments...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Waiting Assignment</h2>
        <button
          onClick={fetchWaitingAssignments}
          className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
          disabled={loading}
        >
          <RefreshCw className={loading ? "animate-spin" : ""} size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">Error loading assignments</div>
              <div className="text-sm mt-1">{error}</div>
              <button
                onClick={fetchWaitingAssignments}
                className="mt-2 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition-colors"
                disabled={loading}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid mt-4 mb-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          title="Awaiting Assignment"
          value={stats.awaitingAssignment.toString()}
          subtitle="Papers & proposals pending review"
          icon={<ClipboardList className="text-yellow-500" size={24} />}
        />
        <StatCard
          title="Available Reviewers"
          value={stats.availableReviewers.toString()}
          subtitle="Ready for assignment"
          icon={<Users className="text-blue-500" size={24} />}
        />
        <StatCard
          title="Auto-Match Available"
          value={stats.autoMatchAvailable.toString()}
          subtitle="High confidence matches"
          icon={<CheckCircle className="text-green-500" size={24} />}
        />
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {papers.length === 0 && !error
              ? "No Items Awaiting Assignment"
              : "Items Awaiting Assignment"}
          </h3>
          {papers.length > 0 && (
            <span className="text-sm text-gray-500">
              {papers.length} item{papers.length !== 1 ? "s" : ""} found
            </span>
          )}
        </div>

        {papers.length === 0 && !error ? (
          <div className="text-center py-12 text-gray-500">
            <ClipboardList size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">All caught up!</p>
            <p className="text-sm">
              No papers or proposals are awaiting assignment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {papers.map((paper) => (
              <PaperCard
                key={paper.id}
                {...paper}
                onAssign={() => handleAssignClick(paper)}
                onAutoMatch={() => handleAutoMatch(paper)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Assign Reviewer Modal */}
      <AddReviewerModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedPaper(null);
        }}
        potentialReviewers={potentialReviewers}
        onSubmit={handleAssignReviewers} 
        buttonLabel="Assign Selected Reviewers"
        title={`Assign Reviewers • ${selectedPaper?.title || "Unknown"}`}
      />
    </div>
  );
};

export default WaitingAssignment;
