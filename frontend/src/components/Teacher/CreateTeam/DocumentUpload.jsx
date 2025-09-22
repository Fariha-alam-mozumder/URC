// src/components/teacher/CreateTeam/DocumentUploader.jsx
import React, { useState } from "react";
import UploadDocModal from "./UploadModal";

const DocumentUploader = ({
  paperFile,
  onPaperChange,
  proposalFile,
  onProposalSubmit,  // match prop name here
  notes,
  onNotesChange,
}) => {
  const [modalKind, setModalKind] = useState(null); // 'paper' | 'proposal'

  const handleSubmitDoc = ({ title, abstract, file, kind }) => {
    console.log("Sending from DocumentUploader:", { title, abstract, file, kind: "proposal" });
    const payload = { title, abstract, fileName: file.name, file };
    console.log("Proposal Upload payload:", payload);

    if (kind === "paper") {
      onPaperChange?.(file);
    } else {
      onProposalSubmit?.({ title, abstract, file, kind });
    }

    // TODO: send `payload` via FormData to your API if needed
  };

  return (
    <section className="bg-white rounded-lg shadow p-5 space-y-4">
      <h3 className="font-semibold">Documents & Resources</h3>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="border rounded p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Upload New Proposal</p>
              <p className="text-xs text-gray-500">
                {proposalFile ? proposalFile.name : "No file selected"}
              </p>
            </div>
            <button
              onClick={() => setModalKind("proposal")}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Upload New
            </button>
          </div>
        </div>
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

export default DocumentUploader;
