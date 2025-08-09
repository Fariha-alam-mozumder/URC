import  { useState } from "react";

const fields = [
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Computer Vision",
  "Natural Language Processing",
  "Cybersecurity",
  "Software Engineering",
  "Database Systems",
  "Human-Computer Interaction",
  "Distributed Systems",
  "Blockchain Technology",
  "Internet of Things",
];

function ResearchFields() {
  const [selected, setSelected] = useState([]);

  const toggleField = (field) => {
    setSelected((prev) =>
      prev.includes(field)
        ? prev.filter((f) => f !== field)
        : [...prev, field]
    );
  };

  return (
    <div className="mb-6">
      <p className="font-medium mb-3">Research Fields of Interest(minimum 3 required) *</p>
      
      <input
        type="text"
        placeholder="Search research fields..."
        className="w-full border rounded-md p-2 mb-4"
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {fields.map((field) => (
          <button
            key={field}
            onClick={() => toggleField(field)}
            className={`border rounded-md px-3 py-2 text-sm text-left ${
              selected.includes(field)
                ? "bg-gray-600 text-white border-blue-600"
                : "bg-gray-300 hover:bg-gray-100"
            }`}
          >
            {field}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ResearchFields;
