import React from "react";
import StatCard from "../../components/Common/StatCard";
import PaperCard from "../../components/Admin/PaperCard";
import { Users, ClipboardList, CheckCircle } from "lucide-react";

const WaitingAssignment = () => {
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
    {
      id: "P013",
      category: "Blockchain",
      title: "Blockchain for Secure Supply Chains",
      authors: "Prof. Henry Adams, Dr. Lisa Nguyen",
      submittedDate: "2024-02-06",
      abstract:
        "Exploring the use of blockchain technology to enhance transparency and security in supply chain management...",
      keywords: ["Blockchain", "Supply Chain", "Security"],
    },
    {
      id: "P014",
      category: "Quantum Computing",
      title: "Quantum Algorithms for Optimization Problems",
      authors: "Dr. Steven Patel, Prof. Maria Garcia",
      submittedDate: "2024-02-08",
      abstract:
        "An overview of novel quantum algorithms and their application to complex optimization challenges...",
      keywords: ["Quantum Computing", "Algorithms", "Optimization"],
    },
  ];

  return (
    <div className=" max-w-full">
        
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
      <div className="border border-box p-3 ">

      {/* Papers Awaiting Assignment */}
      <div>
        <h2 className="text-lg font-bold mb-4">Papers Awaiting Assignment</h2>
        <div className="space-y-4">
          {papers.map((paper, index) => (
            <PaperCard key={index} {...paper} />
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default WaitingAssignment;
