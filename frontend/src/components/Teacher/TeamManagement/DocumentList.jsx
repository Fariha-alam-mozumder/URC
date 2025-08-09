// components/teacher/TeamManagement/DocumentList.jsx
import React, { useState } from 'react';
import { FaFileAlt, FaDownload, FaTrash } from 'react-icons/fa';

const DocumentList = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Project Proposal.pdf',
      size: '2.4 MB',
      uploadedAt: 'Jan 15, 2025',
    },
    {
      id: 2,
      name: 'Literature Review.docx',
      size: '1.8 MB',
      uploadedAt: 'Feb 2, 2025',
    },
    {
      id: 3,
      name: 'Progress Presentation.pptx',
      size: '5.2 MB',
      uploadedAt: 'Feb 8, 2025',
    },
  ]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadedDoc = {
      id: Date.now(),
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setDocuments([uploadedDoc, ...documents]);
  };

  const handleDownload = (docName) => {
    alert(`Downloading ${docName}...`);
  };

  const handleDelete = (id) => {
    const updatedDocs = documents.filter((doc) => doc.id !== id);
    setDocuments(updatedDocs);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Documents & Resources</h3>
        <label className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded cursor-pointer">
          Upload
          <input
            type="file"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {documents.length === 0 ? (
        <p className="text-gray-500">No documents uploaded.</p>
      ) : (
        <ul className="space-y-3">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded border"
            >
              <div className="flex items-center gap-2">
                <FaFileAlt className="text-gray-500" />
                <div>
                  <p className="font-medium text-sm">{doc.name}</p>
                  <p className="text-xs text-gray-400">
                    Uploaded {doc.uploadedAt} • {doc.size}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => handleDownload(doc.name)}
                >
                  <FaDownload />
                </button>
                <button
                  className="text-sm text-red-600 hover:underline"
                  onClick={() => handleDelete(doc.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DocumentList;
