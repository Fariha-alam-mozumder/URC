import React, { useState } from "react";
import { Eye, Download } from "lucide-react";
import CommonSubmissionTable from "../../components/Common/CommonSubmissionTable";
import FilterBar from "../../components/Common/FilterBar";
import CommonButton from "../../components/Common/CommonButton";

function AdminProposals() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    track: "",
  });

  const submissions = [
    {
      id: "P001",
      title: "Machine Learning Applications in Healthcare Diagnostics",
      authors: "Dr. Sarah Johnson, Prof. Michael Chen",
      submittedBy: "sarah.johnson@university.edu",
      date: "2024-01-15",
      status: "Under Review",
      reviewer: "Dr. Williams",
      track: "AI/ML",
    },
    {
      id: "P002",
      title: "Blockchain Technology for Supply Chain Management",
      authors: "Prof. David Smith, Dr. Lisa Wang",
      submittedBy: "david.smith@tech.edu",
      date: "2024-01-18",
      status: "Pending",
      reviewer: "Unassigned",
      track: "Blockchain",
    },
    {
      id: "P003",
      title: "Quantum Computing Algorithms for Optimization",
      authors: "Dr. Robert Brown, Dr. Emily Davis",
      submittedBy: "robert.brown@quantum.edu",
      date: "2024-01-20",
      status: "Accepted",
      reviewer: "Prof. Anderson",
      track: "Quantum",
    },
    {
      id: "P004",
      title: "Cybersecurity Threats in IoT Networks",
      authors: "Prof. Jennifer Miller, Dr. James Wilson",
      submittedBy: "jennifer.miller@security.edu",
      date: "2024-01-22",
      status: "Rejected",
      reviewer: "Dr. Thompson",
      track: "Security",
    },
  ];

  const filteredData = submissions.filter((row) => {
    const q = filters.search.toLowerCase();
    const matchesSearch =
      row.id.toLowerCase().includes(q) ||
      row.title.toLowerCase().includes(q) ||
      row.authors.toLowerCase().includes(q);
    const matchesStatus = filters.status ? row.status === filters.status : true;
    const matchesTrack = filters.track ? row.track === filters.track : true;
    return matchesSearch && matchesStatus && matchesTrack;
  });

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
    <div className="flex p-6 flex-col h-full min-w-0">
      {/* Sticky topbar + filter */}
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

      {/* Table container with horizontal and vertical scroll */}
      <div className="flex-1 min-w-0 overflow-auto">
        <CommonSubmissionTable
          title="Proposal Submissions"
          data={filteredData}
          columns={columns}
          scrollableBodyHeight="calc(100vh - 250px)" // adjust as needed
        />
      </div>
    </div>
  );
}

export default AdminProposals;
