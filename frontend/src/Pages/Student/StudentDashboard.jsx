// src/pages/Student/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  FaClipboard,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import StatCard from "../../components/Common/StatCard";
import RecentSubmission from "../../components/Common/RecentSubmission";
import axios from "axios";
import { resolveApiUrl } from "../../config/api";

const API_BASE = resolveApiUrl();

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ total: 0, accepted: 0, rejected: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
    const cfg = { headers, withCredentials: true };

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const [papersRes, proposalsRes] = await Promise.all([
          axios.get(`${API_BASE}/student/my-teams/papers`, cfg),
          axios.get(`${API_BASE}/student/my-teams/proposals`, cfg),
        ]);

        const papers = papersRes.data?.data || [];
        const proposals = proposalsRes.data?.data || [];
        const all = [...papers, ...proposals];

        const norm = (v) => String(v || "").toUpperCase();
        const accepted = all.filter((x) => norm(x.aggregated_decision) === "ACCEPT").length;
        const rejected = all.filter((x) => norm(x.aggregated_decision) === "REJECT").length;

        setCounts({
          total: all.length,
          accepted,
          rejected,
        });
      } catch (err) {
        console.error("StudentDashboard fetch error:", err);
        setError(err?.response?.data?.message || "Failed to load dashboard");
        setCounts({ total: 0, accepted: 0, rejected: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </div>

      {/* Stat Cards (like teacher) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title={loading ? "Loading..." : "Total Submission"}
          value={loading ? "—" : counts.total}
          icon={<FaClipboard className="text-indigo-600 text-xl" />}
        />
        <StatCard
          title={loading ? "Loading..." : "Accepted"}
          value={loading ? "—" : counts.accepted}
          icon={<FaCheckCircle className="text-green-600 text-xl" />}
        />
        <StatCard
          title={loading ? "Loading..." : "Rejected"}
          value={loading ? "—" : counts.rejected}
          icon={<FaTimesCircle className="text-red-600 text-xl" />}
        />
      </div>

      {/* Bottom sections */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* IMPORTANT: use student scope so it hits student endpoints */}
        <RecentSubmission scope="student" />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
    </div>
  );
};

export default StudentDashboard;
