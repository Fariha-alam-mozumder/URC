// components/Reviewer/ReviewHistoryPage.jsx
import React from 'react';
import StatCard from '../../components/Common/statcard';
import ChartCard from '../../components/Common/ChartCard';
import FilterBar from '../../components/Common/FilterBar';
import ReviewTable from '../../components/Common/ReviewTable';

import { FaCheckCircle, FaClock, FaUpload, FaClipboard } from 'react-icons/fa';

const stats = [
  { title: 'Total Reviews', value: '247', icon: <FaClipboard className="text-blue-500" /> },
  { title: 'Avg. Review Time (days)', value: '3.5', icon: <FaClock className="text-yellow-500" /> },
  { title: 'Approval Rate', value: '78%', icon: <FaCheckCircle className="text-green-500" /> },
  { title: 'Documents Uploaded', value: '156', icon: <FaUpload className="text-purple-500" /> }
];

const chartData = [1, 2, 3]; // Replace with real chart components later

const tableData = [
  {
    id: 1,
    title: 'AI-Powered Sentiment Analysis for Social Media',
    description: 'Innovative approach to real-time sentiment detection...',
    team: 'Team Alpha',
    date: 'Jan 15, 2025',
    status: 'Approved',
    score: 4.2
  },
  {
    id: 2,
    title: 'Blockchain Implementation in Healthcare',
    description: 'Secure patient data management...',
    team: 'Team Beta',
    date: 'Jan 12, 2025',
    status: 'Needs Revision',
    score: 3.8
  },
  {
    id: 3,
    title: 'IoT Network Security Framework',
    description: 'Security model for IoT devices...',
    team: 'Team Gamma',
    date: 'Jan 10, 2025',
    status: 'Rejected',
    score: 2.5
  }
];

const ReviewHistoryPage = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Monthly Review Activity" />
        <ChartCard title="Review Decision Distribution" />
        
      </div>

      {/* Filters */}
      <FilterBar />

      {/* Table */}
      <ReviewTable data={tableData} />
    </div>
  );
};

export default ReviewHistoryPage;
