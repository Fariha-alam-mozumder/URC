import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import MemberList from "../../components/Student/MemberList";
import DocumentList from "../../components/Teacher/TeamManagement/DocumentList";
import Comments from "../../components/Teacher/TeamManagement/Comment";
import TeamCard from "../../components/Common/TeamCard";
import axios from "axios";

const StudentTeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`http://localhost:8000/api/student/teams/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setTeam(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch team details");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [id]);

  if (loading) return <p>Loading team details...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!team) return <p>No team data found.</p>;

  const formattedDate = new Date(team.created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const members = team.teammember?.map(({ role_in_team, user }) => ({
    id: user.user_id,
    name: user.name,
    email: user.email,
    role: role_in_team,
  })) || [];

  const documents = team.proposal?.map((p) => ({
    id: p.proposal_id,
    name: p.title,
    uploadedAt: new Date(p.created_at).toLocaleDateString("en-GB"),
    sizeBytes: p.file_size || 0,
    href: p.pdf_path,
  })) || [];

  const comments = team.teamcomment?.map((c) => ({
    id: c.comment_id,
    text: c.comment,
    createdAt: new Date(c.created_at).toLocaleDateString("en-GB"),
    author: c.user?.name || "Unknown",
  })) || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft />
        </button>
        <h2 className="text-2xl font-bold">Team Overview</h2>
      </div>

      <TeamCard
        title={team.team_name}
        created={`Created at ${formattedDate}`}
        description={team.team_description}
        status={team.status}
        members={members.length}
        createdBy={`${team.created_by_user.name} • ${team.created_by_user.email}`}
        clickable={false}
      />

      <MemberList canManage={false} members={members} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DocumentList canManage={false} documents={documents} />
        <Comments comments={comments} />
      </div>
    </div>
  );
};

export default StudentTeamDetails;
