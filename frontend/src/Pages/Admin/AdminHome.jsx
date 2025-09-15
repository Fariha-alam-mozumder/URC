import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaClock, FaUpload, FaClipboard } from "react-icons/fa";
import StatCard from "../../components/Common/statcard";
import ChartCard from "../../components/Common/ChartCard";
import ReviewerWorkload from "../../components/Common/ReviewerWorkload";
import AdminRecentSubmission from "../../components/Admin/AdminRecentSubmissions";
import SubmissionTrendsChart from "../../components/Admin/SubmissionTrends";
import StatusDistributionChart from "../../components/Admin/StatusDistributionChart";
import axios from "axios";

const AdminHome = () => {
  const [stats, setStats] = useState([
    {
      title: "Total Submissions",
      value: "0",
      icon: <FaCheckCircle className="text-green-500 text-xl" />,
    },
    {
      title: "Pending Reviews",
      value: "0",
      icon: <FaClock className="text-yellow-500 text-xl" />,
    },
    {
      title: "Assigned Papers",
      value: "0",
      icon: <FaUpload className="text-blue-500 text-xl" />,
    },
    {
      title: "Waiting Assignment",
      value: "0",
      icon: <FaClipboard className="text-purple-500 text-xl" />,
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🆕 reviewer workload state
  const [reviewers, setReviewers] = useState([]);

  const BASE_URL = "http://localhost:8000/api";
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchDashboardStats();
    fetchReviewerWorkload(); // fetch reviewers too
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${BASE_URL}/admin/stats`, {
        headers,
        withCredentials: true,
      });

      if (response.data) {
        const {
          totalSubmissions,
          pendingReviews,
          assignedPapers,
          waitingAssignments,
        } = response.data;

        setStats([
          {
            title: "Total Submissions",
            value: totalSubmissions.toString(),
            icon: <FaCheckCircle className="text-green-500 text-xl" />,
          },
          {
            title: "Pending Reviews",
            value: pendingReviews.toString(),
            icon: <FaClock className="text-yellow-500 text-xl" />,
          },
          {
            title: "Assigned Papers",
            value: assignedPapers.toString(),
            icon: <FaUpload className="text-blue-500 text-xl" />,
          },
          {
            title: "Waiting Assignment",
            value: waitingAssignments.toString(),
            icon: <FaClipboard className="text-purple-500 text-xl" />,
          },
        ]);
      }
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError(
        err.response?.data?.error || "Failed to load dashboard statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🆕 fetch reviewer workload
  const fetchReviewerWorkload = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/reviewer-workload`, {
        headers,
        withCredentials: true,
      });

      if (response.data && Array.isArray(response.data.reviewers)) {
        setReviewers(response.data.reviewers);
      }
    } catch (err) {
      console.error("Error fetching reviewer workload:", err);
    }
  };

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-600 text-center">
            <p className="font-semibold mb-2">Error Loading Dashboard</p>
            <p className="mb-4">{error}</p>
            <button
              onClick={fetchDashboardStats}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={loading ? "..." : stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ChartCard title="Submission Trends">
          <SubmissionTrendsChart />
        </ChartCard>
        <ChartCard title="Current Status Distribution">
          <StatusDistributionChart />
        </ChartCard>
      </div>

      {/* Recent submissions + Reviewer workload side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 border">
        <div className="lg:col-span-2">
          <AdminRecentSubmission />
        </div>
        {/* ✅ Pass reviewers */}
        <ReviewerWorkload reviewers={reviewers} />
      </div>
    </div>
  );
};

export default AdminHome;
