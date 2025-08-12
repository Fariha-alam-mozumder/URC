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
import RecentActivity from '../../components/Admin/RecentActivity';

const AdminHome = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <StatCard title="Total Papers" value="248" icon={<FaFileAlt className="text-xl" />} />
            <StatCard title="Pending Review" value="42" icon={<FaClock className="text-xl" />} />
            <StatCard title="Accepted" value="156" icon={<FaCheckCircle className="text-xl" />} />
            <StatCard title="Review Team" value="18" icon={<FaUsers className="text-xl" />} />
      </div>
      <RecentActivity />
    </div>
  );
};

export default AdminHome;
