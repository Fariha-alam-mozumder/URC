import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
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

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/api/teacher/teams/${Number(id)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTeam(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load team data");
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  // Fetch documents (proposals and papers)
  const fetchDocuments = async () => {
    if (!id) return;
    
    try {
      setLoadingDocs(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch both proposals and papers concurrently
      const [proposalsRes, papersRes] = await Promise.all([
        axios.get(`http://localhost:8000/api/teams/${id}/proposals`, { headers }),
        axios.get(`http://localhost:8000/api/teams/${id}/papers`, { headers })
      ]);

      // Combine and format documents
      const allDocs = [
        ...proposalsRes.data.data.map(p => ({
          id: `proposal-${p.proposal_id}`,
          name: p.title,
          type: 'Proposal',
          uploadedAt: new Date(p.created_at).toLocaleDateString(),
          uploadedBy: p.teacher?.user?.name || 'Unknown',
          sizeBytes: p.file_size,
          href: p.pdf_path,
          status: p.status,
          abstract: p.abstract,
          domain: p.domain?.domain_name,
        })),
        ...papersRes.data.data.map(p => ({
          id: `paper-${p.paper_id}`,
          name: p.title,
          type: 'Paper',
          uploadedAt: new Date(p.created_at).toLocaleDateString(),
          uploadedBy: p.teacher?.user?.name || 'Unknown',
          sizeBytes: p.file_size,
          href: p.pdf_path,
          status: p.status,
          abstract: p.abstract,
          domain: p.domain?.domain_name,
        }))
      ];

      // Sort by upload date (newest first)
      allDocs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
      
      setDocuments(allDocs);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [id]);

  // Handle successful upload
  const handleUploadSuccess = (type, data) => {
    console.log(`${type} uploaded successfully:`, data);
    // Refresh documents list
    fetchDocuments();
  };

  // Handle document download
  const handleDownload = (doc) => {
    if (doc.href) {
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = `http://localhost:8000${doc.href}`;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle document delete (you'll need to implement delete endpoints)
  const handleDelete = async (doc) => {
    if (!confirm(`Are you sure you want to delete "${doc.name}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const [type, docId] = doc.id.split('-');
      
      if (type === 'proposal') {
        await axios.delete(`http://localhost:8000/api/proposals/${docId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.delete(`http://localhost:8000/api/papers/${docId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      // Refresh documents list
      fetchDocuments();
    } catch (err) {
      console.error("Failed to delete document:", err);
      alert("Failed to delete document. Please try again.");
    }
  };

  if (loading) return <p>Loading team details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!team) return <p>Team not found</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Title + Back */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          aria-label="Go back"
        >
          <FaArrowLeft />
        </button>
        <h2 className="text-2xl font-bold">Team Overview</h2>
      </div>

      {/* Overview */}
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

      {/* Documents & Resources Uploader */}
      <div className="grid grid-cols-1 gap-6">
        <PaperUploader 
          teamId={id}
          onUploadSuccess={handleUploadSuccess}
        />
      </div>

      {/* Members & Pending Applications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MemberList members={team.teammembers} canManage />
        <PendingApplications applications={[]} />
      </div>

      {/* Documents & Comments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DocumentList
          canManage
          documents={documents}
          loading={loadingDocs}
          onUploadClick={() => console.log("Open uploader")}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
        <Comments />
      </div>
    </div>
  );
};

export default TeamDetails;