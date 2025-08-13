import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaClipboard,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
// import { useNavigate } from 'react-router-dom';
// import StatCard from '../../components/common/statcard';
// import PendingApplications from '../../components/teacher/TeamManagement/PendingApplication';
// import TeamCard from '../../components/teacher/TeamManagement/TeamCard';
import StatCard from "../../components/Common/statcard";
import TeamCard from "../../components/Common/TeamCard";

const MyTeams = () => {
  const [teams, setTeams] = useState([]);
  const [showAllTeams, setShowAllTeams] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const statData = [
    { title: "Total Papers", value: 24, icon: <FaClipboard /> },
    { title: "Submitted", value: 18, icon: <FaCheckCircle /> },
    { title: "Under Review", value: 4, icon: <FaClock /> },
    { title: "Pending", value: 2, icon: <FaExclamationTriangle /> },
  ];
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:8000/api/student/my-teams", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log("Teams fetched:", response.data.data);
        setTeams(response.data.data || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch teams");
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const visibleTeams = showAllTeams ? teams : teams.slice(0, 3);

  if (loading) return <p>Loading teams...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">My Teams</h2>
      </div>

      {/* Stat Cards
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div> */}
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Papers"
          value={24}
          icon={<FaClipboard className="text-green-500 text-xl" />}
        />
        <StatCard
          title="Submitted"
          value={18}
          icon={<FaCheckCircle className="text-blue-500 text-xl" />}
        />
        <StatCard
          title="Under Review"
          value={4}
          icon={<FaClock className="text-yellow-500 text-xl" />}
        />
        <StatCard
          title="Pending"
          value={2}
          icon={<FaExclamationTriangle className="text-purple-500 text-xl" />}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {visibleTeams.length === 0 ? (
          <p>No teams found.</p>
        ) : (
          visibleTeams.map((team) => {
            const formattedDate = new Date(team.created_at).toLocaleDateString(
              "en-GB",
              { day: "2-digit", month: "short", year: "numeric" }
            );
            return (
              <TeamCard
                key={team.team_id}
                id={team.team_id}
                title={team.team_name}
                created={`Created at ${formattedDate}`}
                description={team.team_description}
                status={team.status}
                members={team._count?.teammember ?? 0}
                to={`/student/team/${encodeURIComponent(team.team_id)}`}
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

export default MyTeams;
