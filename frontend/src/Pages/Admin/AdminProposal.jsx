import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import CommonSubmissionTable from "../../components/Common/CommonSubmissionTable";
import FilterBar from "../../components/Common/FilterBar";
import axios from "axios";
import PdfViewerModal from "../../components/Common/PdfViewerModal";

const API_BASE_URL = import.meta.env.APP_URL || "http://localhost:8000/api";

function AdminProposals() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    team_name: "",
  });

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // modal state
  const [openPdf, setOpenPdf] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/admin/proposals`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSubmissions(data?.proposals || []);
      } catch (err) {
        console.error("Error fetching proposals:", err);
        setError("Failed to load proposals");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading proposals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded">
        {error}
      </div>
    );
  }

  const filteredData = submissions.filter((row) => {
    const q = filters.search.toLowerCase();
    const matchesSearch =
      row.id.toLowerCase().includes(q) ||
      row.title.toLowerCase().includes(q) ||
      (row.team_name && row.team_name.toLowerCase().includes(q)) ||
      (row.domain_name && row.domain_name.toLowerCase().includes(q)) ||
      (Array.isArray(row.authors) &&
        row.authors.some((author) => author.toLowerCase().includes(q)));
    const matchesStatus = filters.status ? row.status === filters.status : true;
    const matchesTeamName = filters.team_name ? row.team_name === filters.team_name : true;
    return matchesSearch && matchesStatus && matchesTeamName;
  });

  const columns = [
    {
      key: "id",
      label: "Proposal ID",
      className: "font-bold text-blue-600 whitespace-nowrap",
    },
    {
      key: "title",
      label: "Proposal Title",
      className: "min-w-[200px] whitespace-nowrap",
    },
    {
      key: "authors",
      label: "Authors",
      className: "min-w-[300px] whitespace-nowrap",
    },
    {
      key: "submittedBy",
      label: "Submitted By",
      className: "min-w-[100px] whitespace-nowrap",
    },
    {
      key: "date",
      label: "Date",
      className: "whitespace-nowrap",
    },
    {
      key: "status",
      label: "Status",
      className: "min-w-[100px] whitespace-nowrap",
      render: (value) => {
        const formatStatus = (status) =>
          status
            ? status
                .toLowerCase()
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())
            : "Pending";

        const formatted = formatStatus(value);

        const colors = {
          "Under Review": "bg-blue-100 text-blue-700",
          Pending: "bg-gray-200 text-gray-700",
          Accepted: "bg-green-100 text-green-700",
          Rejected: "bg-red-100 text-red-700",
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
              colors[formatted] || "bg-gray-100 text-gray-700"
            }`}
          >
            {formatted}
          </span>
        );
      },
    },
    {
      key: "reviewer",
      label: "Reviewer",
      render: (value) =>
        value === "Unassigned" ? (
          <span className="text-orange-500">{value}</span>
        ) : (
          value
        ),
      className: "whitespace-nowrap",
    },
    {
      key: "team",
      label: "Team",
      className: "min-w-[200px] text-center",
      render: (_, row) => (
        <div className="flex flex-col items-center text-center w-full">
          <div className="font-medium text-gray-900">{row.team_name || "-"}</div>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs italic font-small bg-blue-100 text-blue-800 mt-1">
            {row.domain_name || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <button
          onClick={() => {
            setSelectedProposal(row);
            setOpenPdf(true);
          }}
          className="flex items-center gap-1 text-sm border px-3 py-1 rounded hover:bg-gray-100"
          title="View"
        >
          <Eye size={16} /> View
        </button>
      ),
      className: "whitespace-nowrap",
    },
  ];

  const filterConfig = [
    {
      name: "search",
      type: "input",
      placeholder: "Search proposals by title, authors, or ID...",
      value: filters.search,
    },
    {
      name: "status",
      type: "select",
      value: filters.status,
      options: [
        { label: "All Statuses", value: "" },
        { label: "Under Review", value: "Under Review" },
        { label: "Pending", value: "Pending" },
        { label: "Accepted", value: "Accepted" },
        { label: "Rejected", value: "Rejected" },
      ],
    },
    {
      name: "Team Name",
      type: "select",
      value: filters.team_name,
      options: [
        { label: "All Teams", value: "" },
        { label: "AI/ML", value: "AI/ML" },
        { label: "Blockchain", value: "Blockchain" },
        { label: "Quantum", value: "Quantum" },
        { label: "Security", value: "Security" },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full min-w-0">
      {/* Sticky topbar + filter */}
      <div className="sticky top-0 p-4 bg-white z-20 pb-4 mb-4 border-b border-gray-200 min-w-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 min-w-0 gap-3 sm:gap-0">
          <h1 className="text-xl sm:text-2xl font-bold truncate w-full sm:w-auto">
            Proposal Management
          </h1>
        </div>

        <div className="min-w-0">
          <FilterBar
            filters={filterConfig}
            onFilterChange={(name, value) =>
              setFilters((prev) => ({ ...prev, [name]: value }))
            }
          />
        </div>
      </div>

      {/* Table container with horizontal and vertical scroll */}
      <div className="flex-1 min-w-0 overflow-auto">
        <CommonSubmissionTable
          title="Proposal Submissions"
          data={filteredData}
          columns={columns}
          scrollableBodyHeight="calc(100vh - 250px)"
        />
      </div>

      {/* PDF Modal */}
      {selectedProposal && (
        <PdfViewerModal
          open={openPdf}
          onClose={() => setOpenPdf(false)}
          title={selectedProposal.title}
          pdfUrl={
            selectedProposal.pdf_path?.startsWith("http")
              ? selectedProposal.pdf_path
              : `${API_BASE_URL.replace("/api", "")}${
                  selectedProposal.pdf_path?.startsWith("/")
                    ? selectedProposal.pdf_path
                    : "/" + selectedProposal.pdf_path
                }`
          }
          rawPath={selectedProposal.pdf_path}
        />
      )}
    </div>
  );
}

export default AdminProposals;