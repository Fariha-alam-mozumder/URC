import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import MemberList from '../../components/Common/MemberList';
import DocumentList from '../../components/Teacher/TeamManagement/DocumentList';
import Comments from '../../components/Teacher/TeamManagement/Comment';
import TeamCard from '../../components/Common/TeamCard';

const MOCK_TEAMS = [
  {
    id: 1,
    title: 'AI Research 2025',
    created: 'Created Jan 15, 2025',
    description: 'Exploring ML in healthcare diagnostics and treatment optimization.',
    status: 'Active',
    members: 5,
    createdBy: 'Prof. A • a@uni.edu',
  },
  {
    id: 2,
    title: 'Quantum Computing Lab',
    created: 'Created Dec 8, 2024',
    description: 'Quantum algorithms and implementations in cryptography.',
    status: 'Recruiting',
    members: 3,
    createdBy: 'Prof. B • b@uni.edu',
  },
  {
    id: 3,
    title: 'Biotech Innovation',
    created: 'Created Nov 22, 2024',
    description: 'Biotech for environmental challenges and agriculture.',
    status: 'Active',
    members: 4,
    createdBy: 'Prof. C • c@uni.edu',
  },
  {
    id: 4,
    title: 'AI Research 2025',
    created: 'Created Jan 15, 2025',
    description: 'Exploring ML in healthcare diagnostics and treatment optimization.',
    status: 'Active',
    members: 5,
    createdBy: 'Prof. A • a@uni.edu',
  },
  {
    id: 5,
    title: 'Quantum Computing Lab',
    created: 'Created Dec 8, 2024',
    description: 'Quantum algorithms and implementations in cryptography.',
    status: 'Recruiting',
    members: 3,
    createdBy: 'Prof. B • b@uni.edu',
  },
];

const StudentTeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find team by id so we show its title, not the raw id
  const team =
    MOCK_TEAMS.find((t) => String(t.id) === String(id)) || {
      title: 'Unknown Team',
      created: '',
      description: '',
      status: '',
      members: 0,
      createdBy: '',
    };

  return (
    <div className="p-6 space-y-6">
      {/* Back + Title */}
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

      {/* Read-only overview card */}
      <div className="grid grid-cols-1 gap-6">
        <TeamCard
          title={team.title}
          created={team.created}
          description={team.description}
          status={team.status}
          members={team.members}
          createdBy={team.createdBy}
          clickable={false}
        />
      </div>

      {/* Members (read-only: no Add Member) */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <MemberList canManage={false} />
      </div>

      {/* Resources & Comments (read-only sections) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <DocumentList
  canManage={false}
  documents={[
    { id: 'p1', name: 'Project Proposal.pdf', uploadedAt: 'Jan 15, 2025', sizeBytes: 2_400_000, href: '/files/proposal.pdf' },
    { id: 'p2', name: 'Literature Review.docx', uploadedAt: 'Feb 2, 2025', sizeBytes: 1_800_000, href: '/files/review.docx' },
  ]}
/>
        <Comments />
      </div>
    </div>
  );
};

export default StudentTeamDetails;
