// Pages/ReviewerHome.jsx
import React from 'react';
import {
  FaClipboard,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle
} from 'react-icons/fa';

import AssignedPapersTable from '../../components/Reviewer/AssignedPapersTable';
import StatCard from '../../components/Common/statcard';

const ReviewerHome = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Papers" value={24} icon={<FaClipboard />} />
        <StatCard title="Submitted" value={18} icon={<FaCheckCircle />} />
        <StatCard title="Under Review" value={4} icon={<FaClock />} />
        <StatCard title="Pending" value={2} icon={<FaExclamationTriangle />} />
      </div>
      <AssignedPapersTable />
    </div>
  );
};

export default ReviewerHome;
