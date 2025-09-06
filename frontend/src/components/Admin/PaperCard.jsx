import React, { useState } from "react";
import { Eye, Bot, PlusCircle, AlertCircle } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

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
  const [pdfError, setPdfError] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(true);

  const pdfUrl = pdf_path?.startsWith("http")
    ? pdf_path
    : `${API_BASE}${pdf_path?.startsWith("/") ? pdf_path : "/" + pdf_path}`;

  const handleViewPdf = () => {
    console.log("Opening PDF with URL:", pdf_path);
    if (pdf_path) {
      setPdfError(false);
      setPdfLoading(true);
      setOpenPdf(true);
    }
  };

  const handleIframeLoad = () => {
    console.log("PDF loaded successfully");
    setPdfLoading(false);
  };

  const handleIframeError = () => {
    console.log("PDF failed to load");
    setPdfLoading(false);
    setPdfError(true);
  };

  return (
    <div className="bg-white p-6 rounded shadow-sm border space-y-4">
      {/* Top row */}
      <div className="flex items-center space-x-2 text-sm">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {id}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-300 text-gray-800">
          {domain}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold">{title}</h3>

      {/* Authors */}
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
        <p className="bg-gray-50 p-3 text-sm text-gray-600 rounded">
          {abstract}
        </p>
      </div>

      {/* Debug info - remove this after fixing */}
      <div className="text-xs text-gray-400 bg-yellow-50 p-2 rounded">
        PDF URL: {pdfUrl || "No file path"}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        {/* View PDF */}
        <button
          onClick={handleViewPdf}
          disabled={!pdf_path}
          className={`flex items-center gap-1 text-sm border px-3 py-1 rounded hover:bg-gray-100 ${
            !pdf_path ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Eye size={16} /> View
        </button>

        {/* Auto Match */}
        {onAutoMatch && (
          <button
            onClick={onAutoMatch}
            className="flex items-center gap-1 text-sm border px-3 py-1 rounded text-indigo-600 hover:bg-indigo-50"
          >
            <Bot size={16} /> Auto Match
          </button>
        )}

        {/* Assign */}
        <button
          onClick={onAssign}
          className="flex items-center gap-1 text-sm bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-900"
        >
          <PlusCircle size={16} /> Assign
        </button>
      </div>

      {/* Enhanced PDF Modal */}
      {openPdf && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => {
            setOpenPdf(false);
            setPdfLoading(true);
            setPdfError(false);
          }}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">PDF Viewer - {title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.open(pdfUrl, "_blank")}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Open in New Tab
                </button>
                <button
                  onClick={() => {
                    setOpenPdf(false);
                    setPdfLoading(true);
                    setPdfError(false);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="flex-1 relative">
              {/* Loading indicator - only show when loading */}
              {pdfLoading && !pdfError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded z-10">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <div className="text-gray-600">Loading PDF...</div>
                  </div>
                </div>
              )}

              {/* Error state */}
              {pdfError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded z-10">
                  <div className="text-center">
                    <AlertCircle
                      className="mx-auto mb-2 text-red-500"
                      size={48}
                    />
                    <p className="text-gray-600 mb-2">Failed to load PDF</p>
                    <p className="text-sm text-gray-500 mb-4 break-all">
                      URL: {pdf_path}
                    </p>
                    <div className="space-y-2">
                      <button
                        onClick={() => window.open(pdfUrl, "_blank")}
                        className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mx-auto"
                      >
                        Open in New Tab
                      </button>
                      <button
                        onClick={() => {
                          setPdfError(false);
                          setPdfLoading(true);
                        }}
                        className="block text-sm text-gray-600 hover:text-gray-800 mx-auto"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* PDF iframe */}
              <iframe
                src={`${pdfUrl}#view=FitH`}
                className="w-full h-full border rounded"
                title="PDF Viewer"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                style={{
                  display: pdfLoading || pdfError ? "none" : "block",
                }}
              />
              <object
                data={pdfUrl}
                type="application/pdf"
                width="100%"
                height="100%"
                style={{ display: pdfLoading || pdfError ? "none" : "block" }}
              />
              <p className="text-sm text-gray-500 mb-4 break-all">
                URL: {pdfUrl}
              </p>
            </div>

            {/* Alternative: Use object tag if iframe fails */}
            {pdfError && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  Try alternative PDF viewer:
                </p>
                <object
                  data={pdf_path}
                  type="application/pdf"
                  width="100%"
                  height="400px"
                  className="border rounded"
                >
                  <p className="text-center py-8">
                    Your browser doesn't support PDF viewing.
                    <a
                      href={pdf_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      Download the PDF instead.
                    </a>
                  </p>
                </object>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaperCard;
