import React from "react";
import { FaSort, FaRegEye, FaRegCopy, FaDownload } from "react-icons/fa";

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

// Map ReviewDecision -> display label
const formatStatus = (status) => {
  if (!status) return "—";
  const map = {
    ACCEPT: "Accepted",
    REJECT: "Rejected",
    MINOR_REVISIONS: "Minor Revisions",
    MAJOR_REVISIONS: "Major Revisions",
  };
  const key = String(status).toUpperCase();
  return map[key] || status;
};

const formatAuthors = (count) => {
  if (!count || count === 0) return "0 Authors";
  if (count === 1) return "1 Author";
  return `${count} Authors`;
};

// Status color classes for aggregated decisions
const getStatusColor = (status) => {
  const label = formatStatus(status);
  const colors = {
    "Accepted": "bg-green-100 text-green-700 border-green-200",
    "Rejected": "bg-red-100 text-red-700 border-red-200",
    "Minor Revisions": "bg-orange-100 text-orange-700 border-orange-200",
    "Major Revisions": "bg-purple-100 text-purple-700 border-purple-200",
    "—": "bg-gray-100 text-gray-700 border-gray-200",
  };
  return colors[label] || "bg-gray-100 text-gray-700 border-gray-200";
};

const SubmissionTable = ({ items = [], onSort }) => {
  // CSV Export
  const exportToCSV = () => {
    if (items.length === 0) {
      alert("No data to export");
      return;
    }

    const cols = ["Code", "Type", "Title", "Authors", "Field", "Submitted Date", "Status"];

    const header = cols.join(",");
    const lines = items.map((r) =>
      [
        r.code,
        r.type,
        r.title,
        formatAuthors(r.authors),
        r.field,
        formatDate(r.submitted),
        formatStatus(r.status),
      ]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(",")
    );

    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "submissions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 md:px-4 py-3 border-b bg-gray-50">
        <div className="font-semibold text-gray-900 text-sm md:text-base">
          Submissions ({items.length})
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-1 md:gap-2 text-xs md:text-sm border px-2 md:px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
        >
          <FaDownload className="text-xs md:text-sm" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>

      {/* Desktop and Tablet Table View */}
      <div className="hidden md:block">
        {/* Table Header */}
        <div className="grid grid-cols-12 px-3 md:px-4 py-3 text-xs text-gray-500 border-b bg-gray-50">
          <div className="col-span-6 lg:col-span-5">
            <button
              onClick={() => onSort("title")}
              className="flex items-center gap-1 font-semibold text-xs md:text-sm text-gray-700 hover:text-gray-900"
            >
              Title
              <FaSort className="opacity-60 text-xs" />
            </button>
          </div>
          <div className="col-span-2 text-center">
            <button
              onClick={() => onSort("field")}
              className="flex items-center justify-center gap-1 font-semibold text-xs md:text-sm text-gray-700 hover:text-gray-900 w-full"
            >
              Field
              <FaSort className="opacity-60 text-xs" />
            </button>
          </div>
          <div className="col-span-2 text-center">
            <button
              onClick={() => onSort("submitted")}
              className="flex items-center justify-center gap-1 font-semibold text-xs md:text-sm text-gray-700 hover:text-gray-900 w-full"
            >
              Submitted
              <FaSort className="opacity-60 text-xs" />
            </button>
          </div>
          <div className="col-span-2 lg:col-span-2 text-center">
            <button
              onClick={() => onSort("status")}
              className="flex items-center justify-center gap-1 font-semibold text-xs md:text-sm text-gray-700 hover:text-gray-900 w-full"
            >
              Status
              <FaSort className="opacity-60 text-xs" />
            </button>
          </div>
          <div className="hidden lg:block lg:col-span-1 text-center text-xs md:text-sm font-semibold text-gray-700">
            Actions
          </div>
        </div>

        {/* Table Body */}
        {items.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">No submissions found</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 items-center px-3 md:px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                {/* Title + Code + Authors */}
                <div className="col-span-6 lg:col-span-5">
                  <div className="text-xs md:text-sm font-medium text-gray-900 mb-1 leading-tight">
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.code} • {formatAuthors(item.authors)}
                  </div>
                </div>

                {/* Field Badge - Centered */}
                <div className="col-span-2 flex justify-center px-1">
                  <span className="inline-flex items-center px-1.5 md:px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200 truncate max-w-full">
                    {item.field}
                  </span>
                </div>

                {/* Submitted Date - Centered */}
                <div className="col-span-2 text-xs md:text-sm text-gray-700 text-center px-1">
                  {formatDate(item.submitted)}
                </div>

                {/* Status - Centered (aggregated decision) */}
                <div className="col-span-2 lg:col-span-2 flex justify-center px-1">
                  <span
                    className={`inline-flex items-center px-1.5 md:px-2 py-1 rounded-full text-xs font-semibold border truncate max-w-full ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {formatStatus(item.status)}
                  </span>
                </div>

                {/* Actions - Centered (Desktop only) */}
                <div className="hidden lg:flex lg:col-span-1 justify-center">
                  <div className="flex items-center gap-1">
                    <button
                      className="p-1.5 md:p-2 rounded-md hover:bg-gray-100 transition-colors"
                      title="Copy ID"
                      onClick={() => {
                        if (navigator.clipboard && item.code) {
                          navigator.clipboard.writeText(item.code);
                        }
                      }}
                    >
                      <FaRegCopy className="text-gray-600 text-sm" />
                    </button>
                    {item.download_url && (
                      <a
                        href={item.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 md:p-2 rounded-md hover:bg-gray-100 transition-colors"
                        title="Download PDF"
                      >
                        <FaDownload className="text-gray-600 text-sm" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {items.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">No submissions found</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                {/* Title */}
                <div className="font-medium text-gray-900 mb-2 text-sm leading-tight">
                  {item.title}
                </div>

                {/* Code and Authors */}
                <div className="text-xs text-gray-500 mb-3">
                  {item.code} • {formatAuthors(item.authors)}
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Field</div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                      {item.field}
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Submitted</div>
                    <div className="text-sm text-gray-700">{formatDate(item.submitted)}</div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex-1 text-center">
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {formatStatus(item.status)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                      title="Copy ID"
                      onClick={() => {
                        if (navigator.clipboard && item.code) {
                          navigator.clipboard.writeText(item.code);
                        }
                      }}
                    >
                      <FaRegCopy className="text-gray-600 text-sm" />
                    </button>
                    {item.download_url && (
                      <a
                        href={item.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                        title="Download PDF"
                      >
                        <FaDownload className="text-gray-600 text-sm" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionTable;
