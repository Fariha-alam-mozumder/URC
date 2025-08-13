// src/components/Teacher/TeamManagement/PaperUpload.jsx
import React, { useState } from "react";
import { FaFilePdf, FaCheckCircle } from "react-icons/fa";
import UploadDocModal from "../CreateTeam/UploadModal";
import axios from "axios";

const PaperUploader = ({ teamId, onUploadSuccess }) => {
  const [modalKind, setModalKind] = useState(null); // 'paper' | 'proposal'
  const [uploadStatus, setUploadStatus] = useState({});

  const handleSubmitDoc = async ({ title, abstract, file, kind }) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("abstract", abstract);
      formData.append("team_id", teamId);
      
      // Append file with the correct field name
      if (kind === "paper") {
        formData.append("paper", file);
      } else {
        formData.append("proposal", file);
      }

      const endpoint = kind === "paper" 
        ? "http://localhost:8000/api/papers/upload"
        : "http://localhost:8000/api/proposals/upload";

      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(`${kind} uploaded successfully:`, response.data);
      
      // Set upload success status
      setUploadStatus(prev => ({
        ...prev,
        [kind]: { success: true, fileName: file.name, timestamp: new Date() }
      }));

      // Call parent callback if provided
      if (onUploadSuccess) {
        onUploadSuccess(kind, response.data.data);
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUploadStatus(prev => ({
          ...prev,
          [kind]: null
        }));
      }, 3000);

    } catch (error) {
      console.error(`${kind} upload error:`, error);
      
      // Set error status
      setUploadStatus(prev => ({
        ...prev,
        [kind]: { 
          error: true, 
          message: error.response?.data?.error || `Failed to upload ${kind}` 
        }
      }));

      // Clear error message after 5 seconds
      setTimeout(() => {
        setUploadStatus(prev => ({
          ...prev,
          [kind]: null
        }));
      }, 5000);

      throw error; // Re-throw to let modal handle it
    }
  };

  const StatusMessage = ({ kind }) => {
    const status = uploadStatus[kind];
    if (!status) return null;

    if (status.success) {
      return (
        <div className="flex items-center gap-2 text-green-600 text-xs mt-1">
          <FaCheckCircle />
          <span>Successfully uploaded: {status.fileName}</span>
        </div>
      );
    }

    if (status.error) {
      return (
        <div className="text-red-600 text-xs mt-1">
          {status.message}
        </div>
      );
    }

    return null;
  };

  return (
    <section className="bg-white rounded-lg shadow p-5 space-y-4">
      <h3 className="font-semibold text-lg">Documents & Resources</h3>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Proposal Upload */}
        <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <FaFilePdf className="text-red-500" />
                <p className="text-sm font-medium">Upload New Proposal</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                PDF format, max 100MB
              </p>
              <StatusMessage kind="proposal" />
            </div>
            <button
              onClick={() => setModalKind("proposal")}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload
            </button>
          </div>
        </div>

        {/* Paper Upload */}
        <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <FaFilePdf className="text-red-500" />
                <p className="text-sm font-medium">Upload New Paper</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                PDF format, max 100MB
              </p>
              <StatusMessage kind="paper" />
            </div>
            <button
              onClick={() => setModalKind("paper")}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload
            </button>
          </div>
        </div>
      </div>

      {/* Upload Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-800 mb-1">Upload Guidelines:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Only PDF files are accepted</li>
          <li>• Maximum file size: 100MB</li>
          <li>• Title must be at least 5 characters long</li>
          <li>• Abstract is optional but recommended</li>
        </ul>
      </div>

      {/* Modal */}
      <UploadDocModal
        open={!!modalKind}
        kind={modalKind || "paper"}
        onClose={() => setModalKind(null)}
        onSubmit={handleSubmitDoc}
      />
    </section>
  );
};

export default PaperUploader;