// src/pages/Teacher/SubmissionHistory.jsx
import React, { useMemo, useState } from "react";
import { FaEye, FaRegCopy } from "react-icons/fa";
import FilterBar from "../../components/Common/FilterBar";
import CommonSubmissionTable, { StatusPill, Badge } from "../../components/Common/CommonSubmissionTable";

const RAW = [
  { id: 1, code: "P-2024-001", title: "Advanced Machine Learning Techniques in Medical Imaging", authors: 3, field: "AI & Healthcare", submitted: "Aug 15, 2024", status: "Under Review", updated: "Aug 18, 2024" },
  { id: 2, code: "P-2024-002", title: "Blockchain Applications in Supply Chain Security", authors: 2, field: "Blockchain Technology", submitted: "Jul 22, 2024", status: "Accepted", updated: "Aug 10, 2024" },
  { id: 3, code: "P-2024-003", title: "Quantum Computing Algorithms for Optimization Problems", authors: 3, field: "Quantum Computing", submitted: "Jun 30, 2024", status: "Needs Revision", updated: "Jul 25, 2024" },
  { id: 4, code: "P-2024-004", title: "Sustainable Energy Systems for Smart Cities", authors: 3, field: "Sustainability", submitted: "May 15, 2024", status: "Rejected", updated: "Jun 20, 2024" },
  { id: 5, code: "P-2024-005", title: "Natural Language Processing in Educational Technology", authors: 2, field: "AI & Education", submitted: "Apr 20, 2024", status: "Submitted", updated: "Apr 20, 2024" },
  { id: 6, code: "P-2024-006", title: "Cybersecurity Frameworks for IoT Networks", authors: 3, field: "Cybersecurity", submitted: "Mar 10, 2024", status: "Accepted", updated: "Apr 15, 2024" },
  { id: 7, code: "P-2024-007", title: "Data Mining Techniques for Social Media Analysis", authors: 2, field: "Data Science", submitted: "Feb 28, 2024", status: "Under Review", updated: "Aug 5, 2024" },
  { id: 8, code: "P-2024-008", title: "Reinforcement Learning in Autonomous Vehicle Navigation", authors: 3, field: "AI & Robotics", submitted: "Jan 15, 2024", status: "Needs Revision", updated: "Mar 20, 2024" },
];

// robust date parse for strings like "Aug 15, 2024"
const parseDate = (s) => {
  const d = new Date(s);
  if (!isNaN(d)) return d;
  const [mon, dayWithComma, year] = s.split(" ");
  const months = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
  return new Date(parseInt(year, 10), months[mon], parseInt(dayWithComma, 10));
};

export default function SubmissionHistory() {
  // column definitions matching the screenshot
  const columns = [
    {
      key: "title",
      label: "Paper Title",
      sortable: false, // keep sorting off for the composite cell; you can enable if you prefer
      render: (_v, row) => (
        <div className="flex flex-col">
          <div className="font-medium text-gray-800">{row.title}</div>
          <div className="text-xs text-gray-500">{row.code} • {row.authors} {row.authors > 1 ? "authors" : "author"}</div>
        </div>
      ),
    },
    {
      key: "field",
      label: "Field of Research",
      sortable: true,
      render: (v) => <Badge>{v}</Badge>,
    },
    {
      key: "submitted",
      label: "Submitted Date",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (v) => (
        <StatusPill
          status={v}
          classes={{
            Submitted: "bg-blue-100 text-blue-700",
            "Under Review": "bg-yellow-100 text-yellow-700",
            Accepted: "bg-green-100 text-green-700",
            "Needs Revision": "bg-gray-200 text-gray-700",
            Rejected: "bg-red-100 text-red-700",
          }}
        />
      ),
    },
  ];

  // filters
  const [filters, setFilters] = useState([
    { name: "search", type: "input", inputType: "text", placeholder: "Search by title or team member...", value: "" },
    { name: "time", type: "select", options: ["All Time", "Last 30 Days", "Last 90 Days", "This Year"], value: "All Time" },
    { name: "status", type: "select", options: ["All Status", "Submitted", "Under Review", "Accepted", "Needs Revision", "Rejected"], value: "All Status" },
    { name: "field", type: "select", options: ["All Fields", "AI & Healthcare", "Blockchain Technology", "Quantum Computing", "Sustainability", "AI & Education", "Cybersecurity", "Data Science", "AI & Robotics"], value: "All Fields" },
  ]);

  const [sort, setSort] = useState({ key: "submitted", dir: "desc" });

  const onFilterChange = (name, value) => {
    setFilters((prev) => prev.map((f) => (f.name === name ? { ...f, value } : f)));
  };

  // filtering + sorting
  const data = useMemo(() => {
    let rows = [...RAW];
    const f = Object.fromEntries(filters.map(({ name, value }) => [name, value]));

    if (f.search?.trim()) {
      const q = f.search.toLowerCase();
      rows = rows.filter((x) => x.title.toLowerCase().includes(q) || x.code.toLowerCase().includes(q));
    }
    if (f.status !== "All Status") rows = rows.filter((x) => x.status === f.status);
    if (f.field !== "All Fields") rows = rows.filter((x) => x.field === f.field);

    const now = new Date();
    if (f.time === "Last 30 Days") {
      const from = new Date(now); from.setDate(now.getDate() - 30);
      rows = rows.filter((x) => parseDate(x.submitted) >= from);
    } else if (f.time === "Last 90 Days") {
      const from = new Date(now); from.setDate(now.getDate() - 90);
      rows = rows.filter((x) => parseDate(x.submitted) >= from);
    } else if (f.time === "This Year") {
      const y = new Date(now.getFullYear(), 0, 1);
      rows = rows.filter((x) => parseDate(x.submitted) >= y);
    }

    // sort by selected key (submitted, field, status)
    const { key, dir } = sort;
    rows.sort((a, b) => {
      let va = a[key], vb = b[key];
      if (key === "submitted") {
        va = parseDate(va).getTime();
        vb = parseDate(vb).getTime();
      } else {
        va = String(va).toLowerCase();
        vb = String(vb).toLowerCase();
      }
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return dir === "asc" ? cmp : -cmp;
    });

    return rows;
  }, [filters, sort]);

  const handleSort = (key) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  };

  // actions column (eye + copy)
  const actions = (row) => (
    <div className="flex items-center justify-end gap-3">
      <button
        onClick={() => console.log("View:", row.code)}
        className="p-2 rounded-md hover:bg-gray-100"
        title="View"
        aria-label="View"
      >
        <FaEye />
      </button>
      <button
        onClick={() => navigator.clipboard?.writeText?.(row.code)}
        className="p-2 rounded-md hover:bg-gray-100"
        title="Copy Paper Code"
        aria-label="Copy"
      >
        <FaRegCopy />
      </button>
    </div>
  );

  // simple CSV export for current filtered rows
  const handleExport = () => {
    const cols = ["code", "title", "authors", "field", "submitted", "status", "updated"];
    const header = cols.join(",");
    const lines = data.map((r) =>
      cols.map((c) => `"${String(r[c] ?? "").replace(/"/g, '""')}"`).join(",")
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
    <div className="p-6 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-2">Submission History</h1>

      {/* Filters */}
      <FilterBar filters={filters} onFilterChange={onFilterChange} />

      {/* Table header strip with Export aligned right (outside the common table) */}
      <div className="flex items-center justify-between mt-4 mb-2">
        <div className="text-sm text-gray-500"></div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md bg-white hover:bg-gray-50"
        >
          Export
        </button>
      </div>

      {/* Table */}
      <CommonSubmissionTable
        title={`Papers`}
        data={data}
        columns={columns}
        sort={sort}
        onSort={handleSort}
        actions={actions}
      />
    </div>
  );
}
