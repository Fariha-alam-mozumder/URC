import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaFileAlt, FaFileInvoice, FaStickyNote } from "react-icons/fa";

const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const statusColors = {
  Active: "bg-green-100 text-green-800",
  Recruiting: "bg-yellow-100 text-yellow-800",
  Inactive: "bg-gray-100 text-gray-600",
};

const categoryColors = {
  "Healthcare AI": "bg-purple-100 text-purple-800",
  "Quantum Computing": "bg-indigo-100 text-indigo-800",
  Biotechnology: "bg-pink-100 text-pink-800",
  Robotics: "bg-red-100 text-red-800",
  Cybersecurity: "bg-yellow-100 text-yellow-800",
  "Data Science": "bg-teal-100 text-teal-800",
  "Virtual Reality": "bg-blue-100 text-blue-800",
};

const TeamCard = ({
  name,
  desc,
  category,
  status,
  members,
  files,
  notes,
  settings,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full transition-transform hover:scale-[1.03] hover:shadow-xl cursor-pointer"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            statusColors[status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {status}
        </span>
      </div>

      <p className="text-gray-700 mb-4 min-h-[56px]">{desc}</p>

      <span
        className={`inline-block mb-4 px-3 py-1 rounded-full text-sm font-semibold ${
          categoryColors[category] || "bg-gray-200 text-gray-700"
        }`}
      >
        {category}
      </span>

      <div className="flex items-center gap-3 mb-4">
        <FaUsers className="text-gray-500" />
        <div className="flex -space-x-2">
          {members.map((m) => (
            <div
              key={m.id}
              title={m.name}
              className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold border-2 border-white shadow"
            >
              {getInitials(m.name)}
            </div>
          ))}
        </div>
        <span className="text-sm text-gray-600 ml-2">
          {members.length} member{members.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex flex-col space-y-1 text-gray-500 text-sm mb-4">
        {files.paper && (
          <div className="flex items-center gap-2">
            <FaFileAlt /> <span>{files.paper}</span>
          </div>
        )}
        {files.proposal && (
          <div className="flex items-center gap-2">
            <FaFileInvoice /> <span>{files.proposal}</span>
          </div>
        )}
        {notes && (
          <div className="flex items-center gap-2">
            <FaStickyNote /> <span>{notes}</span>
          </div>
        )}
      </div>

      <hr className="my-3 border-gray-200" />

      <div className="text-gray-600 text-xs space-y-1 mt-auto">
        <div>
          <strong>Visibility:</strong> {settings.visibility}
        </div>
        <div>
          <strong>Max Members:</strong> {settings.maxMembers}
        </div>
        <div>
          <strong>Allow Applications:</strong> {settings.allowApps ? "Yes" : "No"}
        </div>
      </div>
    </div>
  );
};

const teams = [
  {
    id: "team1",
    name: "AI Research 2025",
    desc: "Exploring ML in healthcare diagnostics and treatment optimization.",
    category: "Healthcare AI",
    status: "Active",
    members: [
      { id: "m1", name: "Alice", role: "Lead" },
      { id: "m2", name: "Bob", role: "Researcher" },
      { id: "m3", name: "Carol", role: "Data Scientist" },
    ],
    files: { paper: "ml_healthcare.pdf", proposal: "proposal_ai.docx" },
    notes: "Focus on diagnostic algorithms.",
    settings: { visibility: "public", maxMembers: 10, allowApps: true },
  },
  {
    id: "team2",
    name: "Quantum Computing Lab",
    desc: "Quantum algorithms and implementations in cryptography.",
    category: "Quantum Computing",
    status: "Recruiting",
    members: [
      { id: "m4", name: "Dave", role: "Lead" },
      { id: "m5", name: "Eve", role: "Researcher" },
    ],
    files: { paper: null, proposal: "quantum_proposal.pdf" },
    notes: "",
    settings: { visibility: "private", maxMembers: 5, allowApps: false },
  },
  {
    id: "team3",
    name: "Biotech Innovation",
    desc: "Biotech for environmental challenges and agriculture.",
    category: "Biotechnology",
    status: "Active",
    members: [
      { id: "m6", name: "Frank", role: "Lead" },
      { id: "m7", name: "Grace", role: "Researcher" },
      { id: "m8", name: "Heidi", role: "Scientist" },
    ],
    files: { paper: "biotech_paper.pdf", proposal: null },
    notes: "Focus on sustainable agriculture.",
    settings: { visibility: "public", maxMembers: 8, allowApps: true },
  },
  {
    id: "team4",
    name: "Robotics Division",
    desc: "Developing autonomous robotic systems.",
    category: "Robotics",
    status: "Active",
    members: [
      { id: "m9", name: "Ivan", role: "Lead" },
      { id: "m10", name: "Judy", role: "Engineer" },
    ],
    files: { paper: "robotics_paper.pdf", proposal: "robotics_proposal.docx" },
    notes: "",
    settings: { visibility: "public", maxMembers: 12, allowApps: true },
  },
  {
    id: "team5",
    name: "Cybersecurity Experts",
    desc: "Researching next-gen security protocols.",
    category: "Cybersecurity",
    status: "Recruiting",
    members: [
      { id: "m11", name: "Mallory", role: "Lead" },
      { id: "m12", name: "Niaj", role: "Analyst" },
    ],
    files: { paper: null, proposal: "security_proposal.pdf" },
    notes: "Focusing on network security.",
    settings: { visibility: "private", maxMembers: 6, allowApps: false },
  },
  {
    id: "team6",
    name: "Data Science Hub",
    desc: "Big data analytics and visualization.",
    category: "Data Science",
    status: "Active",
    members: [
      { id: "m13", name: "Olivia", role: "Lead" },
      { id: "m14", name: "Peggy", role: "Data Analyst" },
      { id: "m15", name: "Quentin", role: "Engineer" },
    ],
    files: { paper: "data_science.pdf", proposal: null },
    notes: "",
    settings: { visibility: "public", maxMembers: 15, allowApps: true },
  },
  {
    id: "team7",
    name: "VR/AR Experience",
    desc: "Immersive tech development.",
    category: "Virtual Reality",
    status: "Active",
    members: [{ id: "m16", name: "Rupert", role: "Developer" }],
    files: { paper: null, proposal: null },
    notes: "",
    settings: { visibility: "public", maxMembers: 7, allowApps: true },
  },
];

const TeamsPage = () => {
  const navigate = useNavigate();
  const [showCount, setShowCount] = useState(3);

  const handleClick = () => {
    setShowCount((prev) => (prev === 3 ? 6 : 3));
  };

  const displayedTeams = teams.slice(0, showCount);

  return (
    <div className="border rounded-lg min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold mb-10 text-gray-900">
        Research Teams
      </h1>
      <div className="w-full max-w-7xl flex flex-wrap gap-8 mb-8 justify-center">
        {displayedTeams.map((team) => (
  <div
    key={team.id}
    className="w-80"
    onClick={() => navigate(`/AdminDashboard/teams/${team.id}`)}
  >
    <TeamCard
      name={team.name}
      desc={team.desc}
      category={team.category}
      status={team.status}
      members={team.members}
      files={team.files}
      notes={team.notes}
      settings={team.settings}
    />
  </div>
))}

      </div>
      <button
        onClick={handleClick}
        className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-transform active:scale-95"
      >
        {showCount === 3 ? "View More" : "Show Less"}
      </button>
    </div>
  );
};

export default TeamsPage;
