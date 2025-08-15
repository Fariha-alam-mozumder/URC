import React from "react";
import { FaDownload, FaEye } from "react-icons/fa";
import Card from "./Card";

function TeamPapersCard({ title, papers, icon }) {
  return (
    <Card title={title} icon={icon}>
      <ul className="space-y-3">
        {papers.length === 0 && (
          <p className="text-gray-500 italic">No papers found.</p>
        )}
        {papers.map((paper) => (
          <li
            key={paper.id}
            className="flex items-center justify-between border-b pb-2 last:border-none"
          >
            <div>
              <p className="font-medium text-gray-900">{paper.title}</p>
              <p className="text-sm text-gray-600">Submitted: {paper.date}</p>
            </div>
            <div className="flex space-x-4 text-black">
              <a
                href={`#view/${paper.id}`} // Replace with actual view URL
                aria-label={`View ${paper.title}`}
                className="hover:text-gray-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaEye size={18} />
              </a>
              <a
                href={`#download/${paper.id}`} // Replace with actual download URL
                aria-label={`Download ${paper.title}`}
                className="hover:text-blue-800"
                download
              >
                <FaDownload size={18} />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default TeamPapersCard;
