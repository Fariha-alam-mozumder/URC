import React, { useState, useEffect } from "react";
import PaperCard from "../../components/Common/PaperCard";
import FilterBar from "../../components/Common/FilterBar";
import axios from "axios";
import { resolveApiUrl, resolveBackendUrl } from "../../config/api";

const StudentMyPapers = () => {
  // filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [yearFilter, setYearFilter] = useState("All Years");
  const [sortFilter, setSortFilter] = useState("Latest First");

  // list
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filters = [
    {
      type: "input",
      name: "search",
      placeholder: "Search papers by title...",
      value: searchQuery,
    },
    {
      type: "select",
      name: "status",
      options: ["All Status", "Accepted", "Rejected", "Pending", "Under Review"],
      value: statusFilter,
    },
    {
      type: "select",
      name: "year",
      options: ["All Years", "2025", "2024"],
      value: yearFilter,
    },
    {
      type: "select",
      name: "sort",
      options: ["Latest First", "Oldest First"],
      value: sortFilter,
    },
  ];

  const handleFilterChange = (filterName, value) => {
    switch (filterName) {
      case "search":
        setSearchQuery(value);
        break;
      case "status":
        setStatusFilter(value);
        break;
      case "year":
        setYearFilter(value);
        break;
      case "sort":
        setSortFilter(value);
        break;
      default:
        console.warn("Unknown filter:", filterName);
    }
  };

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          resolveApiUrl("/student/my-teams/papers"),
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            withCredentials: true,
          }
        );

        const formatted = (res.data.data || []).map((p) => ({
          id: p.paper_id,
          title: p.title,
          team: p.team?.team_name || "Unknown Team",
          // keep a display date but also raw for reliable filter/sort
          _createdAt: p.created_at,
          date: new Date(p.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          lastEditor: p.teacher?.user?.name || "Unknown",
          status: (p.status || "").toUpperCase(), // PENDING | UNDER_REVIEW | COMPLETED
          aggregatedDecision: (p.aggregated_decision || "").toUpperCase(), // ACCEPT | REJECT | MINOR_REVISIONS | MAJOR_REVISIONS | ""
          reviewers: [],
          comments: 0,
          fileUrl: p.download_url ? resolveBackendUrl(p.download_url) : null,
          domainName: p.team?.domain?.domain_name || null,
        }));

        setPapers(formatted);
      } catch (err) {
        console.error("Error fetching papers:", err);
        setError(err.response?.data?.message || "Failed to fetch papers");
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  const filteredPapers = papers
    .filter((paper) => {
      // search by title
      if (
        searchQuery &&
        !paper.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // status filter:
      // - Accepted / Rejected => aggregatedDecision
      // - Pending / Under Review => paper.status
      const dec = paper.aggregatedDecision; // ACCEPT | REJECT | MINOR_REVISIONS | MAJOR_REVISIONS | ""
      const st = paper.status; // PENDING | UNDER_REVIEW | COMPLETED

      if (statusFilter === "Accepted") return dec === "ACCEPT";
      if (statusFilter === "Rejected") return dec === "REJECT";
      if (statusFilter === "Pending") return st === "PENDING";
      if (statusFilter === "Under Review") return st === "UNDER_REVIEW";

      return true; // All Status
    })
    .filter((paper) => {
      // year filter
      if (yearFilter === "All Years") return true;
      const y = new Date(paper._createdAt).getFullYear().toString();
      return y === yearFilter;
    })
    .sort((a, b) => {
      const da = new Date(a._createdAt).getTime();
      const db = new Date(b._createdAt).getTime();
      return sortFilter === "Latest First" ? db - da : da - db;
    });

  if (loading) return <p className="p-6">Loading papers...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Papers</h2>
      </div>

      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      <div className="space-y-4">
        {filteredPapers.length === 0 ? (
          searchQuery ||
          statusFilter !== "All Status" ||
          yearFilter !== "All Years" ? (
            <p>No papers match your current filters.</p>
          ) : (
            <p>No papers found.</p>
          )
        ) : (
          <>
            <p className="text-sm text-gray-600">
              Showing {filteredPapers.length} of {papers.length} papers
            </p>
            {filteredPapers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentMyPapers;
