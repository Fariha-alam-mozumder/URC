import React, { useState, useEffect } from "react";
import { Eye, Download } from "lucide-react";
import CommonSubmissionTable from "../../components/Common/CommonSubmissionTable";
import FilterBar from "../../components/Common/FilterBar";
import CommonButton from "../../components/Common/CommonButton";
import axios from "axios";

function AdminProposals() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    track: "",
  });
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch proposals from backend
  const fetchProposals = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // JWT token
      const res = await axios.get("http://localhost:8000/api/admin/proposals", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: filters.search,
          status: filters.status,
          track: filters.track,
        },
      });

      if (res.data.success) {
        setSubmissions(res.data.data);
      } else {
        setSubmissions([]);
      }
    } catch (err) {
      console.error("Error fetching proposals:", err);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch proposals whenever filters change
  useEffect(() => {
    fetchProposals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const filteredData = submissions; // backend already filters

  const columns = [
    {
      key: "id",
      label: "Proposal ID",
      className: "font-bold text-blue-600 whitespace-nowrap",
    },
    {
      key: "title",
      label: " Title",
      className: "min-w-[400px] whitespace-nowrap",
    },
    {
      key: "authors",
      label: "Authors",
      className: "min-w-[300px] whitespace-nowrap",
    },
    {
      key: "submittedBy",
      label: "Submitted By",
      className: "min-w-[300px] whitespace-nowrap",
    },
    {
      key: "date",
      label: "Date",
      className: "whitespace-nowrap",
    },
    {
      key: "status",
      label: "Status",
      render: (value) => {
        const colors = {
          "Under Review": "bg-blue-100 text-blue-700",
          Pending: "bg-gray-200 text-gray-700",
          Accepted: "bg-green-100 text-green-700",
          Rejected: "bg-red-100 text-red-700",
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
              colors[value] || "bg-gray-100 text-gray-700"
            }`}
          >
            {value}
          </span>
        );
      },
      className: "whitespace-nowrap",
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
      key: "track",
      label: "Track",
      className: "whitespace-nowrap",
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <button
          onClick={() => alert(`Viewing details for ${row.id}`)}
          className="p-1 rounded hover:bg-gray-100"
          title="View"
        >
          <Eye size={18} />
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
      name: "track",
      type: "select",
      value: filters.track,
      options: [
        { label: "All Tracks", value: "" },
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
      <div className="sticky top-0 p-4 bg-white z-20 pb-4 mb-4 border-b border-gray-200 min-w-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 min-w-0 gap-3 sm:gap-0">
          <h1 className="text-xl sm:text-2xl font-bold truncate w-full sm:w-auto">
            Proposal Management
          </h1>
          <div className="flex flex-wrap shrink-0">
            <CommonButton
              icon={Download}
              label="Export CSV"
              onClick={() => alert("Exporting CSV...")}
              className="min-w-[120px]"
            />
          </div>
        </div>
        <div className="min-w-0">
          <FilterBar filters={filterConfig} onFilterChange={handleFilterChange} />
        </div>
      </div>

      <div className="flex-1 min-w-0 overflow-auto">
        <CommonSubmissionTable
          title={loading ? "Loading..." : "Proposal Submissions"}
          data={filteredData}
          columns={columns}
          scrollableBodyHeight="calc(100vh - 250px)"
        />
      </div>
    </div>
  );
}

export default AdminProposals;
