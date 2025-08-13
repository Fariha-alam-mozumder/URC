// src/components/Common/PaperCard.jsx
import React from "react";
import { FaEdit, FaDownload, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PaperCard = ({
  paper,
  role = "teacher",
  basePath,
  canEdit,
  onView,
  onEdit,
  onDownload,
}) => {
  const navigate = useNavigate();

  const resolvedBasePath =
    basePath || (role === "student" ? "/student" : "/teacher");
  const allowEdit = typeof canEdit === "boolean" ? canEdit : role === "teacher";

  const handleView = () => {
    if (onView) return onView(paper);
    navigate(`${resolvedBasePath}/papers/${encodeURIComponent(paper.id)}`);
  };

  const handleEdit = () => {
    if (!allowEdit) return;
    if (onEdit) return onEdit(paper);
    navigate(`${resolvedBasePath}/papers/${encodeURIComponent(paper.id)}/edit`);
  };

  const handleDownload = async (e) => {
    e.preventDefault();

    if (onDownload) {
      return onDownload(paper);
    }

    console.log("Download attempt for paper:", paper.title);
    console.log("File URL:", paper.fileUrl);

    if (!paper.fileUrl) {
      alert("No file available for download");
      return;
    }

    try {
      // FIXED: Simple download approach that works with static files
      // Create a temporary link and click it
      const link = document.createElement("a");
      link.href = paper.fileUrl;
      link.download = `${paper.title.replace(/[^a-z0-9]/gi, "_")}.pdf`; // Clean filename
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      // Append to body, click, then remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("Download initiated");
    } catch (error) {
      console.error("Download failed:", error);
      alert(`Failed to download: ${error.message}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
      {/* Top Info */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg mb-1">{paper.title}</h3>
          <p className="text-sm text-gray-500">
            {paper.team} | {paper.date}
          </p>
          <p className="text-xs text-gray-400">
            Uploaded by {paper.lastEditor}
          </p>
        </div>
        <div className="text-xs text-right">
          <span
            className={`px-2 py-1 rounded-full mr-2 ${
              paper.status === "ACCEPTED"
                ? "bg-green-100 text-green-700"
                : paper.status === "REJECTED"
                ? "bg-red-100 text-red-700"
                : paper.status === "PENDING"
                ? "bg-yellow-100 text-yellow-700"
                : paper.status === "UNDER-REVIEW"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {paper.status}
          </span>

          <span className="text-gray-500">{paper.role}</span>
        </div>
      </div>

      {/* Reviewers */}
      {!!paper.reviewers?.length && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium">Reviewer(s):</span>
          {paper.reviewers.map((r, i) => (
            <span
              key={i}
              className="bg-gray-100 text-sm px-2 py-1 rounded-full text-gray-700"
            >
              {r}
            </span>
          ))}
        </div>
      )}

      {/* Actions + comments */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {/* View */}
          <button
            onClick={handleView}
            className="flex items-center gap-1 text-sm px-3 py-1 border rounded hover:bg-gray-50"
          >
            <FaEye /> View Details
          </button>

          {/* Edit */}
          {allowEdit && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-1 text-sm px-3 py-1 border rounded hover:bg-gray-50"
            >
              <FaEdit /> Edit
            </button>
          )}

          {/* Download */}
          {paper.fileUrl && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 text-sm px-3 py-1 border rounded hover:bg-gray-50"
              title={`Download ${paper.title}`}
            >
              <FaDownload /> Download
            </button>
          )}
          
          {/* Show message if no file */}
          {!paper.fileUrl && (
            <span className="flex items-center gap-1 text-sm px-3 py-1 border rounded bg-gray-100 text-gray-500">
              <FaDownload /> No File
            </span>
          )}
        </div>

        {paper.comments !== undefined && (
          <span className="text-sm text-gray-500">
            {paper.comments} Comment{paper.comments !== 1 && "s"}
          </span>
        )}
      </div>
    </div>
  );
};

export default PaperCard;
