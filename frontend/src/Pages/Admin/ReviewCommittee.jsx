import React, { useState } from "react";
import StatCard from "../../components/Common/StatCard";
import ReviewerRow from "../../components/Admin/ReviewerRow";
import { Users, CheckCircle, Clock, UserPlus } from "lucide-react";
import CommonButton from "../../components/Common/CommonButton";
import AddReviewerModal from "../../components/Admin/AddReviewerModal";

const potentialReviewers = [
  { id: 1, name: "Alice Johnson", email: "alice.johnson@uni.edu", department: "Computer Science", domain: "Machine Learning" },
  { id: 2, name: "Bob Smith", email: "bob.smith@tech.edu", department: "Electrical Engineering", domain: "Signal Processing" },
  { id: 3, name: "Charlie Lee", email: "charlie.lee@research.org", department: "Physics", domain: "Quantum Computing" },
  { id: 4, name: "Diana King", email: "diana.king@university.edu", department: "Mathematics", domain: "Statistics" },
  // add more as needed
];

const ReviewerCommittee = () => {
  const [showModal, setShowModal] = useState(false);

  const reviewers = [
    {
      name: "Dr. Sarah Williams",
      email: "sarah.williams@university.edu",
      expertise: ["Machine Learning", "AI"],
      assigned: 3,
      completed: 2,
      workload: "3/5",
      avgTime: 4.2,
      status: "Active",
    },
    {
      name: "Prof. Michael Jackson",
      email: "michael.jackson@tech.edu",
      expertise: ["NLP", "Text Mining"],
      assigned: 1,
      completed: 0,
      workload: "1/4",
      avgTime: 6.1,
      status: "Active",
    },
  ];

  // Function to handle invitations from modal
  const handleSendInvitation = (selectedIds) => {
    alert(`Invitations sent to IDs: ${selectedIds.join(", ")}`);
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl sm:text-2xl font-bold truncate w-full sm:w-auto">
        Review Committee
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 mb-4 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Reviewers"
          value="5"
          subtitle="4 active"
          icon={<Users className="text-blue-500" size={24} />}
        />

        <StatCard
          title="Completed Reviews"
          value="7"
          subtitle="70% completion rate"
          icon={<CheckCircle className="text-green-500" size={24} />}
        />

        <StatCard
          title="Avg Review Time"
          value="4.9 days"
          subtitle="Within target"
          icon={<Clock className="text-yellow-500" size={24} />}
        />
      </div>

      {/* Review Committee Table */}
      <div className="bg-white p-6 rounded shadow-sm border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2 className="text-lg font-bold">Review Committee Members</h2>
          <CommonButton
            icon={UserPlus}
            label="Add Reviewer"
            onClick={() => setShowModal(true)}
            className="min-w-[120px]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3">Reviewer</th>
                <th className="p-3">Expertise</th>
                <th className="p-3">Assigned</th>
                <th className="p-3">Completed</th>
                <th className="p-3">Workload</th>
                <th className="p-3">Avg Time</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviewers.map((r, i) => (
                <ReviewerRow key={i} {...r} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Reviewer Modal */}
      <AddReviewerModal
        show={showModal}
        onClose={() => setShowModal(false)}
        potentialReviewers={potentialReviewers}
        onSendInvitation={handleSendInvitation}
      />
    </div>
  );
};

export default ReviewerCommittee;
