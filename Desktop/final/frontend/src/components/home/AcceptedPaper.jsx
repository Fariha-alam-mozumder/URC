import { useState } from "react";

const AcceptedPaper = () => {
  const papers = [
    {
      title: "Deep Learning for Medical Diagnosis",
      authors: "Dr. Sarah Johnson, Dr. Michael Chen",
      department: "Computer Science Department",
      abstract:
        "Novel approaches to medical image analysis using deep neural networks...",
      tags: ["AI", "Medical"],
    },
    {
      title: "Quantum Computing Applications",
      authors: "Dr. Alex Thompson, Dr. Lisa Park",
      department: "Physics Department",
      abstract:
        "Exploring quantum algorithms for optimization problems...",
      tags: ["Quantum", "Computing"],
    },
    {
      title: "Robotics in Healthcare",
      authors: "Dr. Emily Rodriguez, Dr. James Wilson",
      department: "Engineering Department",
      abstract:
        "Development of autonomous robotic systems for surgical assistance...",
      tags: ["Robotics", "Healthcare"],
    },
    {
      title: "Blockchain in Supply Chain",
      authors: "Dr. John Carter, Dr. Alice Green",
      department: "Business Department",
      abstract:
        "Improving transparency and efficiency in supply chains using blockchain...",
      tags: ["Blockchain", "Business"],
    },
    {
      title: "Sustainable Energy Systems",
      authors: "Dr. Mark Taylor, Dr. Linda White",
      department: "Engineering Department",
      abstract:
        "Designing and implementing renewable energy solutions for modern cities...",
      tags: ["Energy", "Sustainability"],
    },
  ];

  const [showAll, setShowAll] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");

  const filteredPapers = papers.filter((paper) => {
    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      paper.department.includes(selectedDepartment);
    const matchesTopic =
      selectedTopic === "All Topics" ||
      paper.tags.includes(selectedTopic);
    return matchesDepartment && matchesTopic;
  });

  const displayedPapers = showAll
    ? filteredPapers
    : filteredPapers.slice(0, 3);

  return (
    <section className="px-4 sm:px-6 md:px-12 py-8 bg-gray-200 min-h-screen flex flex-col">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mt-32 gap-3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Accepted Papers</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            <option>All Departments</option>
            <option>Computer Science and Engineering</option>
            <option> Electrical and electronic Engineering</option>
        
          </select>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            <option>All Topics</option>
            <option>AI</option>
            <option>Medical</option>
            <option>Healthcare</option>
            <option>Quantum</option>
            <option>Computing</option>
            <option>Blockchain</option>
            <option>Business</option>
            <option>Energy</option>
            <option>Sustainability</option>
            <option>Robotics</option>
          </select>
        </div>
      </div>

      {/* Papers Grid */}
      <div className="grid gap-4 grid-cols-1  md:grid-cols-2 lg:grid-cols-3">
        {displayedPapers.map((paper, idx) => (
          <div
            key={idx}
            className="bg-white border rounded-lg md:h-5/5 shadow-sm md:p-12  p-6 space-y-3 flex flex-col h-full"
          >
            <div>
              <h3 className="text-xl font-bold md:mb-2">{paper.title}</h3>
              <p className="text-sm italic text-gray-700">{paper.authors}</p>
              <p className="text-xs italic md:mb-3 font-medium text-gray-600 mt-1">
                {paper.department}
              </p>
            </div>
            <p className="text-sm text-gray-800 flex-grow">{paper.abstract}</p>
            <div className="flex flex-wrap gap-1">
              {paper.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-xs text-gray-800 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button className="bg-gray-800 text-white px-3 md:p-3 py-1 rounded hover:bg-gray-900 text-sm w-full sm:w-auto">
                Read Abstract
              </button>
              <button className="border border-gray-300 px-3 md:p-3 py-1 rounded text-sm hover:bg-gray-100 w-full sm:w-auto">
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Toggle Button */}
      {filteredPapers.length > 3 && (
        <div className="mt-6 flex  justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="border border-gray-300 px-5 py-1.5 text-white bg-gray-800 rounded text-sm hover:bg-gray-700 w-full sm:w-auto"
          >
            {showAll ? "Show Less" : "View All Papers"}
          </button>
        </div>
      )}
    </section>
  );
};

export default AcceptedPaper;
