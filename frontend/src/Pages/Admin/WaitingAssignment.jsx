import React, { useState } from "react";
import StatCard from "../../components/Common/StatCard";
import PaperCard from "../../components/Admin/PaperCard";
import AddReviewerModal from "../../components/Admin/AddReviewerModal";
import { Users, ClipboardList, CheckCircle } from "lucide-react";

const WaitingAssignment = () => {
  const [showModal, setShowModal] = useState(false);

  const potentialReviewers = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      department: "Computer Science",
      domain: ["AI", "Machine Learning", "Data Science"],
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      department: "Physics",
      domain: ["Quantum Computing", "Optics"],
    },
    {
      id: 3,
      name: "Charlie Green",
      email: "charlie@example.com",
      department: "Engineering",
      domain: ["Blockchain", "IoT", "Cybersecurity"],
    },
  ];

  const papers = [
    {
      id: "P011",
      category: "Education Tech",
      title: "Augmented Reality in Education: A Comprehensive Study",
      authors: "Dr. Patricia Moore, Prof. Robert Lee",
      submittedDate: "2024-02-03",
      abstract:
        "This paper explores the implementation of augmented reality technologies in educational environments...",
      keywords: ["Augmented Reality", "Education", "Technology Integration"],
    },
    {
      id: "P012",
      category: "Health Tech",
      title: "AI-driven Diagnostics: Revolutionizing Patient Care",
      authors: "Dr. Emily Watson, Dr. John Carter",
      submittedDate: "2024-02-05",
      abstract:
        "A study on how AI algorithms improve diagnostic accuracy and reduce errors in clinical practice...",
      keywords: ["Artificial Intelligence", "Healthcare", "Diagnostics"],
    },
  ];

  const handleAssignClick = () => {
    setShowModal(true);
  };

  const handleAssignReviewers = (ids) => {
    console.log("Assigned reviewers:", ids);
    setShowModal(false);
  };

  return (
    <div className="max-w-full p-6">
      <h2 className="text-2xl font-bold">Waiting Assignment</h2>

      {/* Top Stat Cards */}
      <div className="grid mt-4 mb-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          title="Awaiting Assignment"
          value="3"
          subtitle="New this week"
          icon={<ClipboardList className="text-yellow-500" size={24} />}
        />
        <StatCard
          title="Available Reviewers"
          value="12"
          subtitle="Ready for assignment"
          icon={<Users className="text-blue-500" size={24} />}
        />
        <StatCard
          title="Auto-Match Available"
          value="2"
          subtitle="High confidence matches"
          icon={<CheckCircle className="text-green-500" size={24} />}
        />
      </div>

      {/* Papers Awaiting Assignment */}
      <div className="border border-box p-3">
        <h2 className="text-lg font-bold mb-4">Papers Awaiting Assignment</h2>
        <div className="space-y-4">
          {papers.map((paper, index) => (
            <PaperCard
              key={index}
              {...paper}
              onAssign={handleAssignClick}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <AddReviewerModal
  show={showModal}
  onClose={() => setShowModal(false)}
  potentialReviewers={potentialReviewers}
  onSendInvitation={handleAssignReviewers}
  buttonLabel="Send Assignment Invitation"
  title="Assign Reviewer"
/>
    </div>
  );
};

export default WaitingAssignment;
