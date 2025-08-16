import React from "react";
import { FaCheckCircle, FaClock, FaUpload, FaClipboard } from "react-icons/fa";
import StatCard from "../../components/Common/StatCard";
import ChartCard from "../../components/Common/ChartCard";
import RecentSubmission from "../../components/Common/RecentSubmission";
import ReviewerWorkload from "../../components/Common/ReviewerWorkload";

const stats = [
  { title: "Total Submissions", value: "12", icon: <FaCheckCircle className="text-green-500 text-xl" /> },
  { title: "Pending Reviews", value: "5", icon: <FaClock className="text-yellow-500 text-xl" /> },
  { title: "Assigned Papers", value: "8", icon: <FaUpload className="text-blue-500 text-xl" /> },
  { title: "Waiting Assignment", value: "15", icon: <FaClipboard className="text-purple-500 text-xl" /> },
];

// mock workload, replace with API data when ready
const reviewerData = [
  { name: "Dr. Sarah Johnson", assigned: 8, completed: 6, avgTimeDays: 4.2, pending: 2 },
  { name: "Prof. Michael Chen", assigned: 6, completed: 5, avgTimeDays: 3.8, pending: 1 },
];

const AdminHome = () => {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <StatCard key={index} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ChartCard title="Submission Trends" />
        <ChartCard title="Current Status Distribution" />
      </div>

      {/* Recent submissions + Reviewer workload side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 border">
        <div className="lg:col-span-2">
          <RecentSubmission />
        </div>
        <ReviewerWorkload reviewers={reviewerData} />
      </div>
    </div>
  );
};

export default AdminHome;
