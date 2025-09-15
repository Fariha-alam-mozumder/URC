// src/components/Reviewer/AssignedPapersTable.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const AssignedPapersTable = ({
  papers = [],
  reviewPathPrefix = "/reviewer/reviewpage",
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Assigned Papers</h2>

      {papers.length === 0 ? (
        <div className="text-gray-600 text-sm">No assignments yet.</div>
      ) : (
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="text-gray-600">
              <th className="py-2">Paper Title</th>
              <th className="py-2">Author</th>
              <th className="py-2">Status</th>
              <th className="py-2">Due Date</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {papers.map((p, i) => (
              <tr key={p.id ?? i} className="border-t">
                <td className="py-2">{p.title ?? "—"}</td>
                <td className="py-2">{p.author ?? "—"}</td>
                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      (p.status ?? "Pending") === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {p.status ?? "Pending"}
                  </span>
                </td>
                <td className="py-2">{p.dueDate ? new Date(p.dueDate).toLocaleDateString() : "—"}</td>
                <td className="py-2">
                  {p.action === "Review" ? (
                    <button
                      onClick={() => navigate(`${reviewPathPrefix.replace(/\/$/, "")}/review/${p.id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      Review
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`${reviewPathPrefix.replace(/\/$/, "")}/view/${p.id}`)}
                      className="text-green-600 hover:underline"
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssignedPapersTable;
