// src/Pages/Reviewer/AssignedProposalsPage.jsx
import React, { useEffect, useState } from "react";
import { Eye, Download, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CommonSubmissionTable from "../../components/Common/CommonSubmissionTable";
import FilterBar from "../../components/Common/FilterBar";
import CommonButton from "../../components/Common/CommonButton";
import axios from "axios";

const API_BASE_URL = import.meta.env.APP_URL || "http://localhost:8000/api";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

function formatDate(iso) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatDateTime(iso) {
  if (!iso) return { date: "-", time: "-" };
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const time = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date, time };
  } catch {
    return { date: iso, time: "-" };
  }
}

export default function AssignedProposalsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchAssignments = async (
    p = page,
    l = limit,
    status = filters.status
  ) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.append("page", p);
      params.append("limit", l);
      if (status) params.append("status", status);

      const { data } = await axios.get(
        `${API_BASE_URL}/reviewer/assigned-proposals?${params.toString()}`,
        {
          headers: getAuthHeaders(),
        }
      );

      const fetched = data?.data || [];
      setItems(fetched);
      setTotal(data?.pagination?.total ?? 0);
      setTotalPages(data?.pagination?.pages ?? 1);
      setPage(data?.pagination?.page ?? p);
    } catch (err) {
      console.error("Error fetching assigned proposals:", err);
      setError(err?.response?.data?.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments(1, limit, filters.status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, filters.status]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const updateAssignmentStatus = async (assignmentId, status) => {
    try {
      if (
        status === "COMPLETED" &&
        !window.confirm("Mark this assignment as completed?")
      )
        return;
      await axios.patch(
        `${API_BASE_URL}/reviewer/assignments/${assignmentId}/status`,
        { status },
        { headers: getAuthHeaders() }
      );
      fetchAssignments(page, limit, filters.status);
    } catch (err) {
      console.error("Error updating assignment status:", err);
      alert(err?.response?.data?.message || "Failed to update status");
    }
  };

  // Navigate to review page
  const handleReview = (proposalId) => {
    navigate(`/reviewer/review/${proposalId}`);
  };

  const filteredData = items.filter((row) => {
    const q = filters.search.toLowerCase();
    const matchesSearch =
      !q ||
      (row.id && row.id.toLowerCase().includes(q)) ||
      (row.title && row.title.toLowerCase().includes(q)) ||
      (row.authors && row.authors.toLowerCase().includes(q)) ||
      (row.track && row.track.toLowerCase().includes(q));
    const matchesStatus = filters.status
      ? row.assignmentStatus === filters.status
      : true;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: "title",
      label: "Title",
      className: "min-w-[250px]",
      render: (value, row) => {
        return (
          <div>
            <div className="font-medium text-gray-900 leading-tight">
              {value || "-"}
            </div>
            <div className="text-sm italic text-gray-500 mt-1">
              {row.authors || "No authors"}
            </div>
          </div>
        );
      },
    },
    {
      key: "track",
      label: "Track",
      className: "min-w-[150px] text-center",
      render: (value) => (
        <div className="flex justify-center w-full">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {value || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "assignedDate",
      label: "Assign Date",
      className: "whitespace-nowrap text-center",
      render: (v) => (
        <div className="flex justify-center w-full">
          <span>{formatDate(v)}</span>
        </div>
      ),
    },
    {
      key: "due",
      label: "Due Date",
      className: "min-w-[120px] text-center",
      render: (value) => {
        const { date, time } = formatDateTime(value);
        return (
          <div className="flex flex-col items-center text-center w-full">
            <div className="text-gray-900">{date}</div>
            <div className="text-sm text-gray-600 mt-1">{time}</div>
          </div>
        );
      },
    },
    {
      key: "assignmentStatus",
      label: "Status",
      className: "min-w-[120px] whitespace-nowrap text-center",
      render: (value) => {
        const colors = {
          PENDING: "bg-gray-200 text-gray-700",
          IN_PROGRESS: "bg-blue-100 text-blue-700",
          COMPLETED: "bg-green-100 text-green-700",
          OVERDUE: "bg-red-100 text-red-700",
        };

        const displayText = {
          PENDING: "Pending",
          IN_PROGRESS: "In Progress",
          COMPLETED: "Completed",
          OVERDUE: "Overdue",
        };

        return (
          <div className="flex justify-center w-full">
            <span
              className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
                colors[value] || "bg-gray-100 text-gray-700"
              }`}
            >
              {displayText[value] || value || "-"}
            </span>
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex flex-col gap-1 min-w-[120px]">
          {/* First line: View Proposal button */}
          <div className="flex">
            <button
              onClick={() => {
                const fullPdfUrl = row.pdf_path?.startsWith("http")
                  ? row.pdf_path
                  : row.pdf_path
                  ? `${API_BASE}${
                      row.pdf_path?.startsWith("/")
                        ? row.pdf_path
                        : "/" + row.pdf_path
                    }`
                  : `/public/documents/${row.proposalId || row.id}`;
                window.open(fullPdfUrl, "_blank");
              }}
              className="flex items-center gap-1 text-xs border px-2 py-1 rounded hover:bg-gray-100"
              title="View Proposal"
            >
              <Eye size={12} /> View Proposal
            </button>
          </div>

          {/* Second line: Start and Complete buttons */}
          <div className="flex gap-1">
            <button
              onClick={() =>
                updateAssignmentStatus(row.assignmentId, "IN_PROGRESS")
              }
              className="flex items-center gap-1 text-xs border px-2 py-1 rounded hover:bg-blue-100 bg-blue-50 text-blue-700"
              disabled={
                row.assignmentStatus === "IN_PROGRESS" ||
                row.assignmentStatus === "COMPLETED"
              }
              title="Start review"
            >
              Start
            </button>

            <button
              onClick={() =>
                updateAssignmentStatus(row.assignmentId, "COMPLETED")
              }
              className="flex items-center gap-1 text-xs border px-2 py-1 rounded hover:bg-green-100 bg-green-50 text-green-700"
              disabled={row.assignmentStatus === "COMPLETED"}
              title="Complete review"
            >
              Complete
            </button>
          </div>

          {/* Third line: Review Proposal button */}

          <div className="flex">
            {(() => {
              const canReview = row.assignmentStatus === "IN_PROGRESS";
              const btnClasses = `flex items-center gap-1 text-xs border px-2 py-1 rounded ${
                canReview
                  ? "hover:bg-gray-100 bg-gray-50 text-gray-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`;

              return (
                <button
                  onClick={() => {
                    if (!canReview) {
                      alert("Click Start first to begin reviewing.");
                      return;
                    }
                    handleReview(row.id);
                  }}
                  className={btnClasses}
                  disabled={!canReview}
                  title={
                    canReview ? "Review Proposal" : "Start the assignment first"
                  }
                >
                  <FileText size={12} /> Review Proposal
                </button>
              );
            })()}
          </div>
        </div>
      ),
      className: "whitespace-nowrap",
    },
  ];

  const filterConfig = [
    {
      name: "search",
      type: "input",
      placeholder: "Search by title, authors, track, or ID...",
      value: filters.search,
    },
    {
      name: "status",
      type: "select",
      value: filters.status,
      options: [
        { label: "All Statuses", value: "" },
        { label: "Pending", value: "PENDING" },
        { label: "In Progress", value: "IN_PROGRESS" },
        { label: "Completed", value: "COMPLETED" },
        { label: "Overdue", value: "OVERDUE" },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full min-w-0">
      <div className="sticky top-0 p-4 bg-white z-20 pb-4 mb-4 border-b border-gray-200 min-w-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 min-w-0 gap-3 sm:gap-0">
          <h1 className="text-xl sm:text-2xl font-bold truncate w-full sm:w-auto">
            Assigned Proposals
          </h1>
          <div className="flex flex-wrap shrink-0 gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm">Per page:</label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="border rounded px-2 py-1"
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <FilterBar
            filters={filterConfig}
            onFilterChange={(n, v) => handleFilterChange(n, v)}
          />
        </div>
      </div>

      <div className="flex-1 min-w-0 overflow-auto">
        <CommonSubmissionTable
          title="Assigned Proposals"
          data={filteredData}
          columns={columns}
          scrollableBodyHeight="calc(100vh - 250px)"
        />
      </div>

      <div className="flex items-center justify-between p-3 border-t bg-white">
        <div className="text-sm text-gray-600">
          Showing page {page} of {totalPages} — {total} assignment
          {total !== 1 ? "s" : ""}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchAssignments(1, limit)}
            disabled={page === 1}
            className="px-3 py-1 border rounded"
          >
            « First
          </button>
          <button
            onClick={() => fetchAssignments(Math.max(1, page - 1), limit)}
            disabled={page === 1}
            className="px-3 py-1 border rounded"
          >
            ‹ Prev
          </button>
          <button
            onClick={() =>
              fetchAssignments(Math.min(totalPages, page + 1), limit)
            }
            disabled={page === totalPages}
            className="px-3 py-1 border rounded"
          >
            Next ›
          </button>
          <button
            onClick={() => fetchAssignments(totalPages, limit)}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded"
          >
            Last »
          </button>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          Loading...
        </div>
      )}
      {error && <div className="p-3 text-red-600">{error}</div>}
    </div>
  );
}
