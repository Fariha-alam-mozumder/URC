import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import CommonSubmissionTable from "../../components/Common/CommonSubmissionTable";
import FilterBar from "../../components/Common/FilterBar";
import axios from "axios";
import PdfViewerModal from "../../components/Common/PdfViewerModal";

const API_BASE_URL = import.meta.env.APP_URL || "http://localhost:8000/api";

function AdminPapers() {
  const [filters, setFilters] = useState({
    search: "",
    status: "", // Item state (Under Review, Accepted, Rejected, Major/Minor Review)
    assignment_status: "", // Admin rollup (PENDING, IN_PROGRESS, COMPLETED, OVERDUE)
    department_name: "", // Submitting teacher's department
  });

  const [submissions, setSubmissions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // modal state
  const [openPdf, setOpenPdf] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);

  // Fetch papers
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

  // Fetch department options
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/admin/departments`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        // Expecting data like: { success: true, departments: [{department_id, department_name}] }
        const opts = (data?.departments || [])
          .filter((d) => d?.department_name)
          .map((d) => ({ label: d.department_name, value: d.department_name }));
        setDepartments([{ label: "All Departments", value: "" }, ...opts]);
      } catch (err) {
        console.error("Error fetching departments:", err);
        setDepartments([{ label: "All Departments", value: "" }]);
      }
    };
    fetchDepartments();
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

    // search across a few fields
    const matchesSearch =
      (row.id || "").toLowerCase().includes(q) ||
      (row.title || "").toLowerCase().includes(q) ||
      (row.team_name || "").toLowerCase().includes(q) ||
      (row.domain_name || "").toLowerCase().includes(q) ||
      (Array.isArray(row.authors)
        ? row.authors.some((a) => (a || "").toLowerCase().includes(q))
        : (row.authors || "").toLowerCase().includes(q)) ||
      (row.department_name || "").toLowerCase().includes(q);

    // Status now comes pretty-printed from API:
    // "Accepted" | "Rejected" | "Major Review" | "Minor Review" | "Under Review"
    const itemState = row.status || "Under Review";

    // filter: Item State
    const matchesItemState = filters.status ? itemState === filters.status : true;

    // filter: Admin rollup (PENDING, IN_PROGRESS, COMPLETED, OVERDUE)
    const matchesAssignment = filters.assignment_status
      ? row.admin_assignment_status === filters.assignment_status
      : true;

    // filter: Department name (string match)
    const matchesDepartment = filters.department_name
      ? (row.department_name || "") === filters.department_name
      : true;

    return (
      matchesSearch &&
      matchesItemState &&
      matchesAssignment &&
      matchesDepartment
    );
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
      key: "department_name",
      label: "Department",
      className: "min-w-[160px] whitespace-nowrap",
      render: (v) => v || "-",
    },
    {
      key: "date",
      label: "Date",
      className: "whitespace-nowrap",
    },
    {
      key: "status",
      label: "Paper Status",
      className: "min-w-[120px] whitespace-nowrap",
      render: (v) => {
        const pretty = v || "Under Review";

        const colors = {
          "Major Review": "bg-blue-100 text-blue-700",
          "Minor Review": "bg-yellow-100 text-yellow-700",
          Accepted: "bg-green-100 text-green-700",
          Rejected: "bg-red-100 text-red-700",
          "Under Review": "bg-gray-100 text-gray-700",
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
              colors[pretty] || "bg-gray-100 text-gray-700"
            }`}
          >
            {pretty}
          </span>
        );
      },
    },
    {
      key: "admin_assignment_status",
      label: "Assignment Status",
      className: "min-w-[140px] whitespace-nowrap",
      render: (value) => {
        const pretty = (value || "PENDING")
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase());

        const colors = {
          Pending: "bg-yellow-100 text-yellow-700",
          "In Progress": "bg-blue-100 text-blue-700",
          Completed: "bg-green-100 text-green-700",
          Overdue: "bg-red-100 text-red-700",
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
              colors[pretty] || "bg-gray-100 text-gray-700"
            }`}
          >
            {pretty}
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
          <div className="font-medium text-gray-900">
            {row.team_name || "-"}
          </div>
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
      placeholder:
        "Search papers by title, authors, ID, domain, or department...",
      value: filters.search,
    },
    // assignment status (admin rollup)
    {
      name: "assignment_status",
      type: "select",
      value: filters.assignment_status,
      options: [
        { label: "All Assignment Statuses", value: "" },
        { label: "Pending", value: "PENDING" },
        { label: "In Progress", value: "IN_PROGRESS" },
        { label: "Completed", value: "COMPLETED" },
        { label: "Overdue", value: "OVERDUE" },
      ],
    },
    // Item state filter (based on aggregated_decision pretty value)
    {
      name: "status",
      type: "select",
      value: filters.status,
      options: [
        { label: "All Statuses", value: "" },
        { label: "Under Review", value: "Under Review" },
        { label: "Major Review", value: "Major Review" },
        { label: "Minor Review", value: "Minor Review" },
        { label: "Accepted", value: "Accepted" },
        { label: "Rejected", value: "Rejected" },
      ],
    },
    // Department (fetched from DB)
    {
      name: "department_name",
      label: "Department",
      type: "select",
      value: filters.department_name,
      options: departments.length
        ? departments
        : [{ label: "All Departments", value: "" }],
    },
  ];

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col h-full min-w-0 p-6">
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

      {/* Table */}
      <div className="flex-1 min-w-0 overflow-auto">
        <CommonSubmissionTable
          title="Paper Submissions"
          data={filteredData}
          columns={columns}
          scrollableBodyHeight="calc(100vh - 250px)"
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
              : `${API_BASE_URL.replace("/api", "")}${
                  selectedPaper.pdf_path?.startsWith("/")
                    ? selectedPaper.pdf_path
                    : "/" + selectedPaper.pdf_path
                }`
          }
          rawPath={selectedPaper.pdf_path}
        />
      )}
    </div>
  );
}

export default AdminPapers;
