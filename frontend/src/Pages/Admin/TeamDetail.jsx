import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import TeamDescriptionCard from "../../components/Admin/TeamDescriptionCard";
import TeamMembersCard from "../../components/Admin/TeamMembersCard";
import PapersCard from "../../components/Admin/PapersCard";

const MOCK_TEAMS = [
  {
    id: "team1",
    name: "AI Research 2025",
    createdBy: "Dr. Sarah Johnson",
    creatorEmail: "sarah.johnson@university.edu",
    description: "Exploring ML in healthcare diagnostics and treatment optimization.",
    members: [
      { id: "m1", name: "Alice" },
      { id: "m2", name: "Bob" },
      { id: "m3", name: "Carol" },
    ],
    acceptedPapers: [
      { id: "ap1", title: "ML for Healthcare.pdf", date: "2024-12-15" },
      { id: "ap2", title: "Diagnostics Optimization.pdf", date: "2025-01-10" },
    ],
    rejectedPapers: [
      { id: "rp1", title: "Early Draft.pdf", date: "2024-10-01" },
    ],
  },
  {
    id: "team2",
    name: "Quantum Computing Lab",
    createdBy: "Dr. Ethan Lee",
    creatorEmail: "ethan.lee@university.edu",
    description: "Research on quantum algorithms and cryptography applications.",
    members: [
      { id: "m4", name: "Dave" },
      { id: "m5", name: "Eve" },
      { id: "m6", name: "Frank" },
    ],
    acceptedPapers: [
      { id: "ap3", title: "Quantum Cryptography.pdf", date: "2025-02-20" },
    ],
    rejectedPapers: [
      { id: "rp2", title: "Preliminary Results.docx", date: "2024-11-15" },
    ],
  },
  {
    id: "team3",
    name: "Sustainable Energy Project",
    createdBy: "Prof. Maria Gomez",
    creatorEmail: "maria.gomez@university.edu",
    description: "Innovations in renewable energy and storage solutions.",
    members: [
      { id: "m7", name: "Grace" },
      { id: "m8", name: "Hank" },
    ],
    acceptedPapers: [
      { id: "ap4", title: "Solar Panel Efficiency.pdf", date: "2024-09-10" },
      { id: "ap5", title: "Battery Tech Advances.pdf", date: "2024-12-01" },
    ],
    rejectedPapers: [],
  },
  {
    id: "team4",
    name: "Robotics and Automation",
    createdBy: "Dr. Kevin Wu",
    creatorEmail: "kevin.wu@university.edu",
    description: "Developing autonomous systems for manufacturing.",
    members: [
      { id: "m9", name: "Ivy" },
      { id: "m10", name: "Jack" },
      { id: "m11", name: "Kelly" },
      { id: "m12", name: "Leo" },
    ],
    acceptedPapers: [
      { id: "ap6", title: "Automated Assembly Lines.pdf", date: "2025-03-05" },
    ],
    rejectedPapers: [
      { id: "rp3", title: "Robot Kinematics Draft.docx", date: "2025-01-20" },
    ],
  },
  {
    id: "team5",
    name: "Neural Networks Study Group",
    createdBy: "Prof. Sandra Mills",
    creatorEmail: "sandra.mills@university.edu",
    description: "Advanced studies on deep learning architectures.",
    members: [
      { id: "m13", name: "Mona" },
      { id: "m14", name: "Nate" },
    ],
    acceptedPapers: [
      { id: "ap7", title: "CNN Improvements.pdf", date: "2025-04-12" },
    ],
    rejectedPapers: [],
  },
];

const AdminTeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const team = MOCK_TEAMS.find((t) => t.id === id) || {
    name: "Unknown Team",
    description: "",
    createdBy: "",
    creatorEmail: "",
    members: [],
    acceptedPapers: [],
    rejectedPapers: [],
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <button
  onClick={() => navigate(-1)}
  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors cursor-pointer text-gray-700 hover:text-gray-900"
  aria-label="Go back"
>
  <FaArrowLeft size={20} />
  <span className="font-medium text-lg select-none"></span>
</button>
        <h2 className="text-3xl font-extrabold text-gray-900">{team.name} Overview</h2>
        <div style={{ width: 64 }} />
      </div>

      {/* Grid container for cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TeamDescriptionCard
          description={team.description}
          createdBy={team.createdBy}
          creatorEmail={team.creatorEmail}
          className="h-full"
        />

        <TeamMembersCard members={team.members} className="h-full" />

        <PapersCard title="Accepted Papers" papers={team.acceptedPapers} accepted className="h-full" />

        <PapersCard title="Rejected Papers" papers={team.rejectedPapers} accepted={false} className="h-full" />
      </div>
    </div>
  );
};

export default AdminTeamDetails;