import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,          // Total Teams
  FaClipboard,      // Total Submissions
  FaClock,          // Under Review
  FaCheckCircle,    // Completed
} from "react-icons/fa";
import StatCard from "../../components/Common/StatCard";
import TeamCard from "../../components/Common/TeamCard";
import axios from "axios";
import { resolveApiUrl } from "../../config/api";

const API_BASE = resolveApiUrl();

const TeamManagement = () => {
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [papers, setPapers] = useState([]);
  const [proposals, setProposals] = useState([]);

  const [showAllTeams, setShowAllTeams] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch teams + submissions in parallel
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
        const cfg = { headers, withCredentials: true };

        const [teamsRes, papersRes, proposalsRes] = await Promise.all([
          axios.get(`${API_BASE}/teacher/my-teams`, cfg),
          axios.get(`${API_BASE}/teacher/my-teams/papers`, cfg),
          axios.get(`${API_BASE}/teacher/my-teams/proposals`, cfg),
        ]);

        setTeams(teamsRes.data?.data || []);
        setPapers(papersRes.data?.data || []);
        setProposals(proposalsRes.data?.data || []);
      } catch (err) {
        console.error("TeamManagement fetch error:", err);
        setError(err?.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Compute the 4 metrics
  const stats = useMemo(() => {
    const all = [...papers, ...proposals];

    let underReview = 0;
    let completed = 0;

    for (const item of all) {
      const s = String(item.status || "").toUpperCase();

      // Treat legacy final states as completed for backward compatibility
      const isCompleted = s === "COMPLETED" || s === "ACCEPTED" || s === "REJECTED";
      if (s === "UNDER_REVIEW") underReview++;
      if (isCompleted) completed++;
    }

    return {
      totalTeams: teams.length,
      totalSubmissions: all.length,
      underReview,
      completed,
    };
  }, [teams, papers, proposals]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4">Loading your teams & submissions...</p>
      </div>
    );
  }

  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;

  const visibleTeams = showAllTeams ? teams : teams.slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Team Management</h2>
        <button
          onClick={() => navigate("/teacher/team/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md"
        >
          + Create New Team
        </button>
      </div>

      {/* Stat cards: the 4 you requested */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Teams"
          value={stats.totalTeams}
          icon={<FaUsers className="text-indigo-600 text-xl" />}
        />
        <StatCard
          title="Total Submissions"
          value={stats.totalSubmissions}
          icon={<FaClipboard className="text-blue-600 text-xl" />}
        />
        <StatCard
          title="Under Review"
          value={stats.underReview}
          icon={<FaClock className="text-yellow-500 text-xl" />}
        />
        <StatCard
          title="Review Completed"
          value={stats.completed}
          icon={<FaCheckCircle className="text-green-600 text-xl" />}
        />
      </div>

      {/* Team list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {visibleTeams.length === 0 ? (
          <p>No teams found.</p>
        ) : (
          visibleTeams.map((team) => {
            const formattedDate = team.created_at
              ? new Date(team.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "—";

            return (
              <TeamCard
                key={team.team_id}
                id={team.team_id}
                title={team.team_name ?? "Untitled Team"}
                created={`Created at ${formattedDate}`}
                description={team.team_description ?? ""}
                status={team.status ?? "UNKNOWN"}
                members={team._count?.teammember ?? 0}
                to={`/teacher/team/${team.team_id}`}
              />
            );
          })
        )}
      </div>

      {teams.length > 3 && (
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowAllTeams(!showAllTeams)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-full shadow transition duration-200"
          >
            {showAllTeams ? "Show Less" : "View All"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
