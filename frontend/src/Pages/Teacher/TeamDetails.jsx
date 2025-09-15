import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaEdit, FaCog } from "react-icons/fa";
import MemberList from "../../components/Common/MemberList";
import PendingApplications from "../../components/Teacher/TeamManagement/PendingApplication";
import DocumentList from "../../components/Teacher/TeamManagement/DocumentList";
import Comments from "../../components/Teacher/TeamManagement/Comment";
import TeamCard from "../../components/Common/TeamCard";
import PaperUploader from "../../components/Teacher/TeamManagement/PaperUpload";

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, [id, refreshKey]);

  useEffect(() => {
    fetchDocuments();
  }, [id, refreshKey]);

  const refetchTeam = () => setRefreshKey((prev) => prev + 1);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/teacher/teams/${Number(id)}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setTeam(response.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    if (!id) return;
    try {
      setLoadingDocs(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [proposalsRes, papersRes] = await Promise.all([
        axios.get(`http://localhost:8000/api/teams/${id}/proposals`, {
          headers,
        }),
        axios.get(`http://localhost:8000/api/teams/${id}/papers`, { headers }),
      ]);

      const allDocs = [
        ...proposalsRes.data.data.map((p) => ({
          id: `proposal-${p.proposal_id}`,
          name: p.title,
          type: "Proposal",
          createdAtRaw: p.created_at,
          uploadedAt: new Date(p.created_at).toLocaleDateString(),
          uploadedBy: p.teacher?.user?.name || "Unknown",
          sizeBytes: p.file_size,
          href: p.pdf_path,
          status: p.status,
          abstract: p.abstract,
          // domain: p.team?.domain?.domain_name, // if you included team.domain in API
        })),
        ...papersRes.data.data.map((p) => ({
          id: `paper-${p.paper_id}`,
          name: p.title,
          type: "Paper",
          createdAtRaw: p.created_at,
          uploadedAt: new Date(p.created_at).toLocaleDateString(),
          uploadedBy: p.teacher?.user?.name || "Unknown",
          sizeBytes: p.file_size,
          href: p.pdf_path,
          status: p.status,
          abstract: p.abstract,
          // domain: p.team?.domain?.domain_name,
        })),
      ];

      allDocs.sort(
        (a, b) => new Date(b.createdAtRaw) - new Date(a.createdAtRaw)
      );
      setDocuments(allDocs);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleUploadSuccess = () => refetchTeam();

  const handleMemberAdded = () => refetchTeam();

  const handleApplicationProcessed = () => refetchTeam();

  const handleDownload = (doc) => {
    if (!doc?.href) return;
    const link = document.createElement("a");
    link.href = `http://localhost:8000/${doc.href}`;
    link.download = doc.name || "document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (doc) => {
    if (!confirm(`Are you sure you want to delete "${doc.name}"?`)) return;
    try {
      const token = localStorage.getItem("token");
      const [type, docId] = doc.id.split("-");
      const headers = { Authorization: `Bearer ${token}` };

      if (type === "proposal") {
        await axios.delete(`http://localhost:8000/api/proposals/${docId}`, {
          headers,
        });
      } else {
        await axios.delete(`http://localhost:8000/api/papers/${docId}`, {
          headers,
        });
      }
      refetchTeam();
    } catch (err) {
      console.error("Failed to delete document:", err);
      alert("Failed to delete document. Please try again.");
    }
  };

  const handleStatusChange = async (e) => {
    const next = String(e.target.value || "").toUpperCase();
    if (!["ACTIVE", "RECRUITING", "INACTIVE"].includes(next)) return;
    try {
      setUpdatingStatus(true);
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:8000/api/teacher/teams/${Number(id)}/status`,
        { status: next },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // optimistic update
      setTeam((prev) => (prev ? { ...prev, status: next } : prev));
    } catch (err) {
      console.error("Failed to update status:", err);
      alert(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to update team status"
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'recruiting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) return <p>Loading team details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!team) return <p>Team not found</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Enhanced Header with Status Control */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-800"
                aria-label="Go back"
              >
                <FaArrowLeft />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Team Overview</h1>
                <p className="text-gray-600 mt-1">Manage team settings and monitor progress</p>
              </div>
            </div>

            {/* Professional Status Control */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCog className="text-gray-400" />
                <span className="font-medium">Team Status:</span>
              </div>
              <div className="relative">
                <select
                  id="team-status"
                  value={team.status || "RECRUITING"}
                  onChange={handleStatusChange}
                  disabled={updatingStatus}
                  className={`appearance-none border-0 px-4 py-2 pr-10 text-sm font-semibold rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${getStatusColor(team.status)}`}
                >
                  <option value="ACTIVE"> Active</option>
                  <option value="RECRUITING"> Recruiting</option>
                  <option value="INACTIVE"> Inactive</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  {updatingStatus ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Card */}
        <div className="grid grid-cols-1 gap-6">
          <TeamCard
            title={team.title}
            created={`Team Code: ${team.id}`}
            description={team.description}
            status={team.status}
            members={team.members}
            createdBy={`${team.createdBy} • ${team.creatorEmail || ""}`}
            clickable={false}
          />
        </div>

        {/* Teachers can upload */}
        <div className="grid grid-cols-1 gap-6">
          <PaperUploader teamId={id} onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="h-80 overflow-hidden">
              <MemberList
                members={team.teammembers}
                teamId={team.id}
                canManage={true}
                onMemberAdded={handleMemberAdded}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="h-80 overflow-hidden">
              <PendingApplications
                teamId={id}
                onApplicationProcessed={handleApplicationProcessed}
              />
            </div>
          </div>
        </div>

        {/* Documents and Comments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="h-96 overflow-hidden">
              <DocumentList
                canManage={true}
                documents={documents}
                loading={loadingDocs}
                onUploadClick={() => {}}
                onDelete={handleDelete}
                onDownload={handleDownload}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="h-96 overflow-hidden">
              <Comments teamId={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;