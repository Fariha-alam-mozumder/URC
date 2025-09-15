import React from "react";
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import TeamDescriptionCard from "../../components/Admin/TeamDescriptionCard";
import TeamMembersCard from "../../components/Admin/TeamMembersCard";
import TeamPapersCard from "../../components/Admin/TeamsPapersCard";

const AdminTeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const team = MOCK_TEAMS.find((t) => t.id === id) || {
    name: "Unknown Team",
    description: "",
    createdBy: "",
    creatorEmail: "",
    members: [],
    acceptedPapers: [],
    rejectedPapers: [],
    pendingPapers: [],
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors cursor-pointer text-gray-700 hover:text-gray-900"
          aria-label="Go back"
        >
          <FaArrowLeft size={20} />
          <span className="font-medium text-lg select-none">

          </span>
        </button>
        <h2 className="text-3xl font-extrabold text-gray-900">{team.name} Overview</h2>
        <div style={{ width: 64 }} />
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Row 1: Team Description spans both columns */}
        <div className="md:col-span-2">
          <TeamDescriptionCard
            description={team.description}
            createdBy={team.createdBy}
            creatorEmail={team.creatorEmail}
            className="h-full"
          />
        </div>

        {/* Row 2: Team Members and Pending Papers */}
        <TeamMembersCard members={team.members} className="h-full" />
        <TeamPapersCard title="Pending Papers" papers={team.pendingPapers} icon={<FaHourglassHalf size={24} className="text-yellow-600" />} className="h-full" />

        {/* Row 3: Accepted Papers and Rejected Papers */}
        <TeamPapersCard title="Accepted Papers" papers={team.acceptedPapers} icon={<FaCheckCircle size={24} className="text-green-600" />} className="h-full" />
        <TeamPapersCard title="Rejected Papers" papers={team.rejectedPapers} icon={<FaTimesCircle size={24} className="text-red-600" />} className="h-full" />
      </div>
    </div>
  );
};

export default AdminTeamDetails;
