import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import MemberList from "../../components/Common/MemberList";
import DocumentList from "../../components/Teacher/TeamManagement/DocumentList";
import Comments from "../../components/Teacher/TeamManagement/Comment";
import TeamCard from "../../components/Common/TeamCard";
import axios from "axios";
import { resolveApiUrl, resolveBackendUrl } from "../../config/api";

const StudentTeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(resolveApiUrl(`/student/teams/${id}`), {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTeam(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch team details");
      } finally {
        setLoading(false);
      }
    };
    fetchTeamDetails();
  }, [id]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoadingDocs(true);
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [proposalsRes, papersRes] = await Promise.all([
          axios.get(resolveApiUrl(`/teams/${id}/proposals`), { headers }),
          axios.get(resolveApiUrl(`/teams/${id}/papers`), { headers }),
        ]);

        const docs = [
          ...proposalsRes.data.data.map((p) => ({
            id: `proposal-${p.proposal_id}`,
            name: p.title,
            type: "Proposal",
            createdAtRaw: p.created_at,
            uploadedAt: new Date(p.created_at).toLocaleDateString("en-GB"),
            sizeBytes: p.file_size || 0,
            href: resolveBackendUrl(p.pdf_path),
            status: p.status,
          })),
          ...papersRes.data.data.map((p) => ({
            id: `paper-${p.paper_id}`,
            name: p.title,
            type: "Paper",
            createdAtRaw: p.created_at,
            uploadedAt: new Date(p.created_at).toLocaleDateString("en-GB"),
            sizeBytes: p.file_size || 0,
            href: resolveBackendUrl(p.pdf_path),
            status: p.status,
          })),
        ];
        docs.sort((a, b) => new Date(b.createdAtRaw) - new Date(a.createdAtRaw));
        setDocuments(docs);
      } catch (e) {
        console.error("Failed to fetch documents:", e);
      } finally {
        setLoadingDocs(false);
      }
    };
    fetchDocuments();
  }, [id]);

  if (loading) return <p>Loading team details...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!team) return <p>No team data found.</p>;

  const formattedDate = new Date(team.created_at).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });

  // Flatten to what <MemberList/> expects
  const flatMembers =
    team.teammember?.map(({ role_in_team, user }) => ({
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role_in_team,
    })) ?? [];

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
        members={flatMembers.length}
        createdBy={`${team.created_by_user.name} • ${team.created_by_user.email}`}
        clickable={false}
      />

      {/* Read-only members */}
      <MemberList members={flatMembers} teamId={team.team_id} canManage={false} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DocumentList canManage={false} documents={documents} loading={loadingDocs} />
        <Comments teamId={id} />
      </div>
    </div>
  );
};

export default StudentTeamDetails;
