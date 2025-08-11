import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import MemberList from '../../components/Common/MemberList';
import PendingApplications from '../../components/Teacher/TeamManagement/PendingApplication';
import DocumentList from '../../components/Teacher/TeamManagement/DocumentList';
import Comments from '../../components/Teacher/TeamManagement/Comment';
import TeamCard from '../../components/Common/TeamCard';
import DocumentUploader from '../../components/Teacher/CreateTeam/DocumentUpload';

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paperFile, setPaperFile] = useState(null);
  const [proposalFile, setProposalFile] = useState(null);
  const [notes, setNotes] = useState('');

  const MOCK_TEAMS = [
    {
      id: 'tr-2025-ai-001',
      name: 'Healthcare ML Lab',
      code: 'TR-2025-AI-001',
      department: 'CSE Department - Spring 2025',
      createdBy: 'Dr. Sarah Johnson',
      creatorEmail: 'sarah.johnson@university.edu',
      description:
        'Research team focused on machine learning applications in healthcare diagnostics and predictive analytics.',
      status: 'Active',
      members: 2,
    }
  ];

  const team = MOCK_TEAMS.find(t => t.id === id) || {
    name: 'Unknown Team',
    code: '',
    department: '',
    createdBy: '',
    creatorEmail: '',
    description: '',
    status: '',
    members: 0,
  };

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
          title={team.name}
          created={`Team Code: ${team.code}`}
          description={team.description}
          status={team.status}
          members={team.members}
          createdBy={`${team.createdBy} • ${team.creatorEmail}`}
          clickable={false}
        />
      </div>

      {/* Documents & Resources Uploader */}
      <div className="grid grid-cols-1 gap-6">
        <DocumentUploader
          paperFile={paperFile}
          onPaperChange={setPaperFile}
          proposalFile={proposalFile}
          onProposalChange={setProposalFile}
          notes={notes}
          onNotesChange={setNotes}
        />
      </div>

      {/* Members & Pending Applications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MemberList canManage />
        <PendingApplications applications={[]} />
      </div>

      {/* Documents & Comments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<DocumentList
  canManage
  documents={[
    { id: 'p1', name: 'Project Proposal.pdf', uploadedAt: 'Jan 15, 2025', sizeBytes: 2_400_000, href: '/files/proposal.pdf' },
    { id: 'p2', name: 'Literature Review.docx', uploadedAt: 'Feb 2, 2025', sizeBytes: 1_800_000, href: '/files/review.docx' },
  ]}
  onUploadClick={() => setUploaderOpen(true)}   // open your DocumentUploader modal/section
  onDelete={(doc) => console.log('delete', doc)}
  onDownload={(doc) => console.log('download', doc)}
/>
        <Comments />
      </div>
    </div>
  );
};



export default TeamDetails;