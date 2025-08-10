import React, { useState } from 'react';
import { FaClipboard, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import StatCard from '../../components/common/statcard';
// import PendingApplications from '../../components/teacher/TeamManagement/PendingApplication';
// import TeamCard from '../../components/teacher/TeamManagement/TeamCard';
import StatCard from '../../components/Common/statcard';
import TeamCard from '../../components/Common/TeamCard';

const MyTeams = () => {
  const [showAllTeams, setShowAllTeams] = useState(false);
//   const navigate = useNavigate();

  const statData = [
    { title: 'Total Papers', value: 24, icon: <FaClipboard /> },
    { title: 'Submitted', value: 18, icon: <FaCheckCircle /> },
    { title: 'Under Review', value: 4, icon: <FaClock /> },
    { title: 'Pending', value: 2, icon: <FaExclamationTriangle /> },
  ];

  const teamData = [
    {
      id: 1,
      title: 'AI Research 2025',
      created: 'Created Jan 15, 2025',
      description: 'Exploring ML in healthcare diagnostics and treatment optimization.',
      status: 'Active',
      members: 5,
    },
    {
      id: 2,
      title: 'Quantum Computing Lab',
      created: 'Created Dec 8, 2024',
      description: 'Quantum algorithms and implementations in cryptography.',
      status: 'Recruiting',
      members: 3,
    },
    {
      id: 3,
      title: 'Biotech Innovation',
      created: 'Created Nov 22, 2024',
      description: 'Biotech for environmental challenges and agriculture.',
      status: 'Active',
      members: 4,
    },
    {
      id: 4,
      title: 'AI Research 2025',
      created: 'Created Jan 15, 2025',
      description: 'Exploring ML in healthcare diagnostics and treatment optimization.',
      status: 'Active',
      members: 5,
    },
    {
      id: 5,
      title: 'Quantum Computing Lab',
      created: 'Created Dec 8, 2024',
      description: 'Quantum algorithms and implementations in cryptography.',
      status: 'Recruiting',
      members: 3,
    },
  ];

  const visibleTeams = showAllTeams ? teamData : teamData.slice(0, 3);

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

      {/* Team Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {visibleTeams.map((team) => (
          <TeamCard
            key={team.id}
            {...team}
            to={`/student/team/${encodeURIComponent(team.id)}`} // <-- route to student details
          />
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowAllTeams(!showAllTeams)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-full shadow transition duration-200"
        >
          {showAllTeams ? 'Show Less' : 'View All'}
        </button>
      </div>
    </div>
  );
};



export default MyTeams;
