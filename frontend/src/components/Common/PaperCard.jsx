// src/components/Common/PaperCard.jsx
import React, { useState } from "react";
import { FaDownload, FaClipboard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DECISION_LABELS = {
  ACCEPT: "Accepted",
  REJECT: "Rejected",
  MINOR_REVISIONS: "Minor Revisions",
  MAJOR_REVISIONS: "Major Revisions",
};

const STATUS_LABELS = {
  PENDING: "Pending",
  UNDER_REVIEW: "Under Review",
  COMPLETED: "Completed",
};

function getBadge(aggregatedDecision, status) {
  // Prefer the aggregated decision badge if available
  const d = (aggregatedDecision || "").toUpperCase();
  const s = (status || "").toUpperCase();

  if (d) {
    switch (d) {
      case "ACCEPT":
        return { text: DECISION_LABELS[d], classes: "bg-green-100 text-green-700 border-green-200" };
      case "REJECT":
        return { text: DECISION_LABELS[d], classes: "bg-red-100 text-red-700 border-red-200" };
      case "MINOR_REVISIONS":
        return { text: DECISION_LABELS[d], classes: "bg-yellow-100 text-yellow-700 border-yellow-200" };
      case "MAJOR_REVISIONS":
        return { text: DECISION_LABELS[d], classes: "bg-orange-100 text-orange-700 border-orange-200" };
      default:
        return { text: d, classes: "bg-gray-100 text-gray-700 border-gray-200" };
    }
  }

  // Fallback to workflow status if no aggregate decision yet
  switch (s) {
    case "PENDING":
      return { text: STATUS_LABELS[s], classes: "bg-yellow-100 text-yellow-700 border-yellow-200" };
    case "UNDER_REVIEW":
      return { text: STATUS_LABELS[s], classes: "bg-blue-100 text-blue-700 border-blue-200" };
    case "COMPLETED":
      return { text: STATUS_LABELS[s], classes: "bg-gray-100 text-gray-700 border-gray-200" };
    default:
      return { text: "Unknown", classes: "bg-gray-100 text-gray-700 border-gray-200" };
  }
}

const PaperCard = ({ paper, onView, onDownload }) => {
  const navigate = useNavigate();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const badge = getBadge(paper.aggregatedDecision, paper.status);

  const handleDownload = async (e) => {
    e.preventDefault();
    if (onDownload) return onDownload(paper);

    if (!paper.fileUrl) {
      alert("No file available for download");
      return;
    }

    try {
      const link = document.createElement("a");
      link.href = paper.fileUrl;
      link.download = `${paper.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      alert(`Failed to download: ${error.message}`);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
        {/* Top Info */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            {/* Badges row (optional) */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {paper.idTag && (
                <span className="px-2 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 font-mono border border-indigo-200">
                  {paper.idTag}
                </span>
              )}
              {paper.domainName && (
                <span className="px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-800 border border-gray-200">
                  {paper.domainName}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-bold text-lg leading-snug mb-1">{paper.title}</h3>

            {/* Meta */}
            <p className="text-sm text-gray-500">
              {paper.team} | {paper.date}
            </p>
            <p className="text-xs text-gray-400">Uploaded by {paper.lastEditor}</p>

            {/* Abstract */}
            {paper.abstract && (
              <div className="mt-3 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-3 shadow-sm">
                <h4 className="font-semibold mb-1">Abstract</h4>
                <p className="text-sm leading-relaxed text-gray-700">{paper.abstract}</p>
              </div>
            )}
          </div>

          {/* Status/Decision pill (top-right) */}
          <div className="text-xs text-right shrink-0">
            <span className={`inline-block px-2 py-1 rounded-full text-sm border ${badge.classes}`}>
              {badge.text}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {paper.fileUrl ? (
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 text-sm px-3 py-1 border rounded hover:bg-gray-50"
                title={`Download ${paper.title}`}
              >
                <FaDownload /> Download
              </button>
            ) : (
              <span className="flex items-center gap-1 text-sm px-3 py-1 border rounded bg-gray-100 text-gray-500">
                <FaDownload /> No File
              </span>
            )}
          </div>
        </div>
      </div>

    
    </>
  );
};

export default PaperCard;
