import React from 'react';
import { FaClipboard, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import StatCard from '../../components/Common/statcard';
// import RecentSubmission from '../../components/Teacher/RecentSubmission';
import TeamActivity from '../../components/Teacher/TeamActivity';
import RecentSubmission from '../../components/Common/RecentSubmission';
const TeacherDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        {/* <p className="text-gray-600">
          Manage your team's paper submissions and track progress
        </p> */}
      </div>

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

      {/* Bottom sections */}
      <div className="flex flex-col lg:flex-row gap-4">
        <RecentSubmission />
        <TeamActivity />
      </div>
    </div>
  );
};
export default TeacherDashboard;
