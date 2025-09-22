import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { resolveApiUrl } from "../../config/api";
import {
  FaClipboard,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import StatCard from "../../components/Common/StatCard"; // <-- capital S
import TeamActivity from "../../components/Common/TeamActivity";
import RecentSubmission from "../../components/Common/RecentSubmission";

const API_BASE_URL = resolveApiUrl();

/** Normalize status strings coming from DB/enums */
const norm = (s) => (typeof s === "string" ? s.trim().toUpperCase() : "");

/** Count helpers across mixed arrays (papers + proposals) */
function makeCounts(items) {
  const total = items.length;
  let accepted = 0;
  let rejected = 0;

  for (const it of items) {
    const st = norm(it.status);
    if (st === "ACCEPTED") accepted++;
    else if (st === "REJECTED") rejected++;
  }
  return { total, accepted, rejected };
}

export default function TeacherDashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [counts, setCounts] = useState({ total: 0, accepted: 0, rejected: 0 });

  // Optional: prepare an axios instance with auth header
  const client = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true, // if you use httpOnly cookies
    });
    // If you use Bearer tokens stored in localStorage:
    const token = localStorage.getItem("token");
    if (token) instance.defaults.headers.common.Authorization = `Bearer ${token}`;
    return instance;
  }, []);

  useEffect(() => {
    let alive = true;

    async function fetchAll() {
      setLoading(true);
      setErr("");

      try {
        // Fetch in parallel
        const [papersRes, proposalsRes] = await Promise.all([
          client.get("/teacher/my-teams/papers"),
          client.get("/teacher/my-teams/proposals"),
        ]);

        const papers = papersRes?.data?.data ?? [];
        const proposals = proposalsRes?.data?.data ?? [];
        const combined = [...papers, ...proposals];

        const c = makeCounts(combined);
        if (alive) setCounts(c);
      } catch (e) {
        console.error(e);
        if (alive) setErr(e?.response?.data?.message || e.message || "Failed to load");
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        {err && (
          <p className="text-sm text-red-600 mt-1">
            {err}
          </p>
        )}
      </div>

      {/* Stat Cards */}
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
        <RecentSubmission scope="teacher" />
        <TeamActivity />
      </div>
    </div>
  );
}
