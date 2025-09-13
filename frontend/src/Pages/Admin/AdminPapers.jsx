import React, { useState, useEffect } from "react";
import { Eye, Download } from "lucide-react";
import CommonSubmissionTable from "../../components/Common/CommonSubmissionTable";
import FilterBar from "../../components/Common/FilterBar";
import CommonButton from "../../components/Common/CommonButton";
import axios from "axios";
import PdfViewerModal from "../../components/Common/PdfViewerModal";


const API_BASE_URL = import.meta.env.APP_URL || "http://localhost:8000/api";

function AdminPapers() {
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
  const [selectedPaper, setSelectedPaper] = useState(null);


  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/admin/papers`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSubmissions(data?.papers || []);
      } catch (err) {
        console.error("Error fetching papers:", err);
        setError("Failed to load papers");
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading papers...</p>
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
      (Array.isArray(row.authors) && row.authors.some(author => author.toLowerCase().includes(q)));
    const matchesStatus = filters.status ? row.status === filters.status : true;
    const matchesTeamName = filters.team_name ? row.team_name === filters.team_name : true;
    return matchesSearch && matchesStatus && matchesTeamName;
  });

  const columns = [
    {
      key: "id",
      label: "Paper ID",
      className: "font-bold text-blue-600 whitespace-nowrap",
    },
    {
      key: "title",
      label: "Paper Title",
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
      )
    },

    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
         <button
          onClick={() => {
            setSelectedPaper(row);
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
      placeholder: "Search papers by title, authors, or ID...",
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

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col h-full min-w-0">
      {/* Sticky topbar + filter */}
      <div className="sticky top-0 p-4 bg-white z-20 pb-4 mb-4 border-b border-gray-200 min-w-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 min-w-0 gap-3 sm:gap-0">
          <h1 className="text-xl sm:text-2xl font-bold truncate w-full sm:w-auto">
            Paper Management
          </h1>
       
        </div>

        <div className="min-w-0">
          <FilterBar
            filters={filterConfig}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Table container with horizontal and vertical scroll */}
      <div className="flex-1 min-w-0 overflow-auto">
        <CommonSubmissionTable
          title="Paper Submissions"
          data={filteredData}
          columns={columns}
          scrollableBodyHeight="calc(100vh - 250px)" // adjust as needed
        />
      </div>
     {selectedPaper && (
  <PdfViewerModal
    open={openPdf}
    onClose={() => setOpenPdf(false)}
    title={selectedPaper.title}
    pdfUrl={
      selectedPaper.pdf_path?.startsWith("http")
        ? selectedPaper.pdf_path
        : `${API_BASE_URL.replace("/api", "")}${selectedPaper.pdf_path?.startsWith("/") ? selectedPaper.pdf_path : "/" + selectedPaper.pdf_path}`
    }
    rawPath={selectedPaper.pdf_path}
  />
)}

    </div>
  );
}

export default AdminPapers;
