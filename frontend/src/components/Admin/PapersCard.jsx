import React from "react";
import { FaFileAlt, FaTimesCircle } from "react-icons/fa";
import Card from "./Card";

const PapersCard = ({ title, papers, accepted = true }) => (
  <Card icon={accepted ? <FaFileAlt size={24} /> : <FaTimesCircle size={24} />} title={`${title} (${papers.length})`}>
    {papers.length ? (
      <ul className="list-disc list-inside text-gray-700">
        {papers.map((p) => (
          <li key={p.id}>
            {p.title} <span className="text-sm text-gray-400">({p.date})</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No {accepted ? "accepted" : "rejected"} papers available.</p>
    )}
  </Card>
);

export default PapersCard;
