import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaFileAlt, FaFileInvoice, FaStickyNote } from "react-icons/fa";
import axios from "axios";
import { resolveApiUrl } from "../../config/api";

const getInitials = (name) => name
  .split(" ")
  .map((n) => n[0])
  .join("")
  .toUpperCase();

const statusColors = {
  Active: "bg-green-100 text-green-800",
  Recruiting: "bg-yellow-100 text-yellow-800",
  Inactive: "bg-gray-100 text-gray-600",
  ACTIVE: "bg-green-100 text-green-800",
  RECRUITING: "bg-yellow-100 text-yellow-800", 
  INACTIVE: "bg-gray-100 text-gray-600",
};

const categoryColors = {
  "Healthcare AI": "bg-purple-100 text-purple-800",
  "Quantum Computing": "bg-indigo-100 text-indigo-800",
  "Biotechnology": "bg-pink-100 text-pink-800",
  "Robotics": "bg-red-100 text-red-800",
  "Cybersecurity": "bg-yellow-100 text-yellow-800",
  "Data Science": "bg-teal-100 text-teal-800",
  "Virtual Reality": "bg-blue-100 text-blue-800",
  "Machine Learning": "bg-purple-100 text-purple-800",
  "Web Development": "bg-green-100 text-green-800",
  "Mobile Development": "bg-blue-100 text-blue-800",
  "Uncategorized": "bg-gray-200 text-gray-700",
};

const TeamCard = ({ team, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full transition-transform hover:scale-[1.03] hover:shadow-xl cursor-pointer"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-gray-900">{team.name}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            statusColors[team.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {team.status}
        </span>
      </div>
      
      <p className="text-gray-700 mb-4 min-h-[56px]">
        {team.desc || "No description available"}
      </p>
      
      <span
        className={`inline-block mb-4 px-3 py-1 rounded-full text-sm font-semibold ${
          categoryColors[team.category] || "bg-gray-200 text-gray-700"
        }`}
      >
        {team.category}
      </span>

      <div className="flex items-center gap-3 mb-4">
        <FaUsers className="text-gray-500" />
        <div className="flex -space-x-2">
          {team.firstThreeMembers?.map((member) => (
            <div
              key={member.id}
              title={member.name}
              className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold border-2 border-white shadow"
            >
              {getInitials(member.name)}
            </div>
          ))}
          {team.membersCount > 3 && (
            <div className="w-7 h-7 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs font-semibold border-2 border-white shadow">
              +{team.membersCount - 3}
            </div>
          )}
        </div>
        <span className="text-sm text-gray-600 ml-2">
          {team.membersCount} member{team.membersCount !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex flex-col space-y-1 text-gray-500 text-sm mb-4">
        <div className="flex items-center gap-2">
          <FaFileAlt />
          <span>Papers: {team.paperCount || 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaFileInvoice />
          <span>Proposals: {team.proposalCount || 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaStickyNote />
          <span>Comments: {team.commentCount || 0}</span>
        </div>
      </div>

      <hr className="my-3 border-gray-200" />
      
      <div className="text-gray-600 text-xs space-y-1 mt-auto">
        <div>
          <strong>Created:</strong> {new Date(team.createdAt).toLocaleDateString()}
        </div>
        <div>
          <strong>Team ID:</strong> {team.id}
        </div>
      </div>
    </div>
  );
};

const TeamsPage = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCount, setShowCount] = useState(6);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(resolveApiUrl("/admin/teams"), {
        headers,
        withCredentials: true
      });
      
      if (response.data.success) {
        // Transform the data to match the expected format
        const transformedTeams = response.data.teams.map(team => ({
          ...team,
          paperCount: team.files?.papers?.length || 0,
          proposalCount: team.files?.proposals?.length || 0,
          commentCount: team.files?.comments?.length || 0,
        }));
        setTeams(transformedTeams);
      } else {
        setError('Failed to fetch teams');
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError(err.response?.data?.message || 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const handleTeamClick = (teamId) => {
    navigate(`/admin/teams/${teamId}`);
  };

  const handleToggleView = () => {
    setShowCount((prev) => (prev === 6 ? teams.length : 6));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading teams...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold mb-2">Error Loading Teams</p>
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchTeams}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const displayedTeams = teams.slice(0, showCount);

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold mb-10 text-gray-900">
        Research Teams
      </h1>

      {teams.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="text-xl mb-4">No teams found</p>
          <p>Teams will appear here once they are created</p>
        </div>
      ) : (
        <>
          <div className="w-full max-w-7xl flex flex-wrap gap-8 mb-8 justify-center">
            {displayedTeams.map((team) => (
              <div key={team.id} className="w-80">
                <TeamCard
                  team={team}
                  onClick={() => handleTeamClick(team.id)}
                />
              </div>
            ))}
          </div>

          {teams.length > 6 && (
            <button
              onClick={handleToggleView}
              className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-transform active:scale-95"
            >
              {showCount >= teams.length ? "Show Less" : `View All (${teams.length})`}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default TeamsPage;