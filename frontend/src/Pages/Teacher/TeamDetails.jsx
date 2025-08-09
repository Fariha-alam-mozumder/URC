import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import MemberList from '../../components/Teacher/TeamManagement/MemberList';
import PendingApplications from '../../components/Teacher/TeamManagement/PendingApplication';
import DocumentList from '../../components/Teacher/TeamManagement/DocumentList';
import Comments from '../../components/Teacher/TeamManagement/Comment';
import TeamCard from '../../components/Teacher/TeamManagement/TeamCard';

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const team = {
    name: decodeURIComponent(id || ''),
    code: 'TR-2025-AI-001',
    department: 'CSE Department - Spring 2025',
    createdBy: 'Dr. Sarah Johnson',
    creatorEmail: 'sarah.johnson@university.edu',
    description:
      'Research team focused on machine learning applications in healthcare diagnostics and predictive analytics.',
    status: 'Active',
    members: 2,
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

      {/* Overview using reusable TeamCard (read-only) */}
      <div className="grid grid-cols-1 gap-6">
        <TeamCard
          title={team.name || 'Untitled Team'}
          created={`Team Code: ${team.code}`}
          description={team.description}
          status={team.status}
          members={team.members}
          createdBy={`${team.createdBy} • ${team.creatorEmail}`}
          clickable={false}
        />
      </div>

      {/* Members & Pending Applications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MemberList />
        <PendingApplications applications={[]} />
      </div>

      {/* Documents & Comments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DocumentList documents={[]} />
        <Comments />
      </div>
    </div>
  );
};
export default TeamDetails;