// components/Common/PdfViewerModal.jsx
import React, { useState } from "react";
import { AlertCircle } from "lucide-react";

const PdfViewerModal = ({ open, onClose, title, pdfUrl, rawPath }) => {
  const [pdfError, setPdfError] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(true);

  const handleIframeLoad = () => {
    console.log("PDF loaded successfully");
    setPdfLoading(false);
  };

  const handleIframeError = () => {
    console.log("PDF failed to load");
    setPdfLoading(false);
    setPdfError(true);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={() => {
        onClose();
        setPdfLoading(true);
        setPdfError(false);
      }}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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
                onClose();
                setPdfLoading(true);
                setPdfError(false);
              }}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* PDF Area */}
        <div className="flex-1 relative">
          {/* Loading */}
          {pdfLoading && !pdfError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <div className="text-gray-600">Loading PDF...</div>
              </div>
            </div>
          )}

          {/* Error */}
          {pdfError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded z-10">
              <div className="text-center">
                <AlertCircle className="mx-auto mb-2 text-red-500" size={48} />
                <p className="text-gray-600 mb-2">Failed to load PDF</p>
                <p className="text-sm text-gray-500 mb-4 break-all">URL: {rawPath}</p>
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
        </div>

        {/* Alternative viewer */}
        {pdfError && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 mb-2">Try alternative PDF viewer:</p>
            <object
              data={rawPath}
              type="application/pdf"
              width="100%"
              height="400px"
              className="border rounded"
            >
              <p className="text-center py-8">
                Your browser doesn't support PDF viewing.
                <a
                  href={rawPath}
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
  );
};

export default PdfViewerModal;
