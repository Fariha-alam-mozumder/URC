// Pages/ReviewerDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { resolveApiUrl } from "../../config/api";
import {
  FaClipboard,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

import AssignedPapersTable from "../../components/Reviewer/AssignedPapersTable";
import StatCard from "../../components/Common/StatCard";

const API_BASE_URL = resolveApiUrl();

export default function ReviewerDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    inProgress: 0,
    pending: 0,
    overdue: 0,
  });
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ✅ useMemo axios client with Authorization header like TeacherDashboard
  const client = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true, // keep if you also use cookies
    });
    const token = localStorage.getItem("token");
    if (token) {
      instance.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    return instance;
  }, []);

  useEffect(() => {
    let alive = true;
    async function fetchAll() {
      setLoading(true);
      setErr("");
      try {
        const [sRes, aRes] = await Promise.all([
          client.get("/reviewer/assignment-stats"),
          client.get("/reviewer/assignments?limit=10"),
        ]);
        if (alive) {
          if (sRes.data?.success) setStats(sRes.data.stats);
          if (aRes.data?.success) setAssignments(aRes.data.assignments || []);
        }
      } catch (e) {
        console.error("Dashboard load failed:", e);
        if (alive) {
          setErr(e?.response?.data?.message || e.message || "Failed to load");
          setStats({ total: 0, submitted: 0, inProgress: 0, pending: 0, overdue: 0 });
          setAssignments([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }
    fetchAll();
    return () => {
      alive = false;
    };
  }, [client]);

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      {err && <p className="text-sm text-red-600">{err}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={loading ? "Loading..." : "Total Papers"}
          value={loading ? "—" : stats.total}
          icon={<FaClipboard className="text-indigo-600 text-xl" />}
        />
        <StatCard
          title={loading ? "Loading..." : "Submitted"}
          value={loading ? "—" : stats.submitted}
          icon={<FaCheckCircle className="text-green-600 text-xl" />}
        />
        <StatCard
          title={loading ? "Loading..." : "In Progress"}
          value={loading ? "—" : stats.inProgress}
          icon={<FaClock className="text-yellow-600 text-xl" />}
        />
        <StatCard
          title={loading ? "Loading..." : "Overdue"}
          value={loading ? "—" : stats.overdue}
          icon={<FaClock className="text-red-600 text-xl" />}
        />
      </div>

      <AssignedPapersTable
        papers={assignments}
        reviewPathPrefix="/reviewer/reviewpage"
      />
    </div>
  );
}
