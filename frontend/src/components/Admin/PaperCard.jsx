import React, { useState } from "react";
import { Eye, Bot, PlusCircle } from "lucide-react";
import PdfViewerModal from "../Common/PdfViewerModal";
import { resolveBackendUrl } from "../../config/api";

const PaperCard = ({
  id,
  title,
  abstract,
  author,
  authors = [],
  submissionDate,
  domain,
  pdf_path,
  onAssign,
  onAutoMatch,
}) => {
  const [openPdf, setOpenPdf] = useState(false);

  const pdfUrl = pdf_path ? resolveBackendUrl(pdf_path) : null;

  const handleViewPdf = () => {
    if (pdf_path) setOpenPdf(true);
  };

  return (
    <div className="bg-white p-6 rounded shadow-sm border space-y-4">
      {/* Info */}
      <div className="flex items-center space-x-2 text-sm">
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {id}
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-300 text-gray-800">
          {domain}
        </span>
      </div>

      <h3 className="text-lg font-semibold">{title}</h3>

      {authors.length > 0 ? (
        <p className="text-sm text-gray-500">
          {authors.map((a, i) => (
            <span key={i}>
              {a.name}
              {i < authors.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      ) : (
        <p className="text-sm text-gray-500">{author}</p>
      )}

      <p className="text-xs text-gray-400">Submitted: {submissionDate}</p>

      {/* Abstract */}
      <div>
        <h4 className="text-sm font-medium">Abstract Preview</h4>
        <p className="bg-gray-50 p-3 text-sm text-gray-600 rounded">{abstract}</p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <button
          onClick={handleViewPdf}
          disabled={!pdf_path}
          className={`flex items-center gap-1 text-sm border px-3 py-1 rounded hover:bg-gray-100 ${
            !pdf_path ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Eye size={16} /> View
        </button>

        {onAutoMatch && (
          <button
            onClick={onAutoMatch}
            className="flex items-center gap-1 text-sm border px-3 py-1 rounded text-indigo-600 hover:bg-indigo-50"
          >
            <Bot size={16} /> Auto Match
          </button>
        )}

        <button
          onClick={onAssign}
          className="flex items-center gap-1 text-sm bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-900"
        >
          <PlusCircle size={16} /> Assign
        </button>
      </div>

      {/* Reusable PDF Modal */}
      <PdfViewerModal
        open={openPdf}
        onClose={() => setOpenPdf(false)}
        title={title}
        pdfUrl={pdfUrl}
        rawPath={pdf_path}
      />
    </div>
  );
};

export default PaperCard;
