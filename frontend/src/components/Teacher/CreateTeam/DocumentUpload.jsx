// src/components/teacher/CreateTeam/DocumentUploader.jsx
import React, { useState } from "react";
import UploadDocModal from "./UploadModal";

const DocumentUploader = ({
  paperFile, onPaperChange,
  proposalFile, onProposalChange,
  notes, onNotesChange,
}) => {
  const [modalKind, setModalKind] = useState(null); // 'paper' | 'proposal'

  const handleSubmitDoc = ({ title, abstract, file, kind }) => {
    const payload = { title, abstract, fileName: file.name, file };
    console.log("Upload payload:", payload);

    if (kind === "paper") {
      onPaperChange?.(file);
    } else {
      onProposalChange?.(file);
    }
    // TODO: send `payload` via FormData to your API if needed
  };

  return (
    <section className="bg-white rounded-lg shadow p-5 space-y-4">
      <h3 className="font-semibold">Documents</h3>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="border rounded p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Upload new paper</p>
              <p className="text-xs text-gray-500">
                {paperFile ? paperFile.name : "No file selected"}
              </p>
            </div>
            <button
              onClick={() => setModalKind("paper")}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Upload New
            </button>
          </div>
        </div>

        <div className="border rounded p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Upload new proposal</p>
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

      {/* <div>
        <label className="text-sm font-medium">Research materials / notes</label>
        <textarea
          className="mt-1 w-full border rounded px-3 py-2 min-h-[96px]"
          value={notes}
          onChange={(e) => onNotesChange?.(e.target.value)}
        />
      </div> */}

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
