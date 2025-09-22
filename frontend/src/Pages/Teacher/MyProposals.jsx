import React, { useState, useEffect, useMemo } from "react";
import PaperCard from "../../components/Common/PaperCard";
import UploadDocModal from "../../components/Teacher/CreateTeam/UploadModal";
import FilterBar from "../../components/Common/FilterBar";
import axios from "axios";
import { resolveApiUrl, resolveBackendUrl } from "../../config/api";

const MyProposals = () => {
  // filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [yearFilter, setYearFilter] = useState("All Years");
  const [sortFilter, setSortFilter] = useState("Latest First");

  // list
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // extract dynamic year list from proposals
  const availableYears = useMemo(() => {
    const years = proposals.map((p) =>
      new Date(p.date).getFullYear().toString()
    );
    const uniqueYears = Array.from(new Set(years)).sort((a, b) => b - a);
    return ["All Years", ...uniqueYears];
  }, [proposals]);

  const filters = [
    {
      type: "input",
      name: "search",
      placeholder: "Search proposals by title...",
      value: searchQuery,
    },
    {
      type: "select",
      name: "status",
      options: [
        "All Status",
        "Accepted",
        "Rejected",
        "Pending",
        "Under Review",
      ],
      value: statusFilter,
    },
    {
      type: "select",
      name: "year",
      options: availableYears,
      value: yearFilter,
    },
    {
      type: "select",
      name: "sort",
      options: ["Latest First", "Oldest First"],
      value: sortFilter,
    },
  ];

  // handle filter changes
  const handleFilterChange = (filterName, value) => {
    console.log(`Filter ${filterName} changed to:`, value);

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
    const formatPid = (n) => `PR${String(n).padStart(3, "0")}`;
    const fetchProposals = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          resolveApiUrl("/teacher/my-teams/proposals"),
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );

        const formatted = res.data.data.map((p) => {
          console.log(`Processing proposal: ${p.title}`);
          console.log(`PDF path: "${p.pdf_path}"`);
          console.log(`Download URL: "${p.download_url}"`);

          return {
            id: p.proposal_id,
            idTag: formatPid(p.proposal_id),
            title: p.title,
            team: p.team?.team_name || "Unknown Team",
            date: new Date(p.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            lastEditor: p.teacher?.user?.name || "Unknown",
            abstract: p.abstract || "",
            domainName: p.team?.domain?.domain_name || null,
            status: p.status,
            role: "Contributor",
            reviewers: [],
            comments: 0,
            fileUrl: p.download_url ? resolveBackendUrl(p.download_url) : null,
          };
        });

        console.log("Formatted proposals:", formatted);
        setProposals(formatted);
      } catch (err) {
        console.error("❌ Error fetching proposals:", err);
        setError(err.response?.data?.message || "Failed to fetch proposals");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  const normalizeStatus = (s) =>
    (s || "").toLowerCase().replace(/_/g, " ").trim();

  // Apply filters
  const filteredProposals = proposals
    .filter((proposal) => {
      // search filter
      if (
        searchQuery &&
        !proposal.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // status filter (case-insensitive ✅)
      if (
        statusFilter !== "All Status" &&
        normalizeStatus(proposal.status) !== normalizeStatus(statusFilter)
      ) {
        return false;
      }

      // year filter
      if (yearFilter !== "All Years") {
        const proposalYear = new Date(proposal.date).getFullYear().toString();
        if (proposalYear !== yearFilter) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (sortFilter === "Latest First") return dateB - dateA;
      if (sortFilter === "Oldest First") return dateA - dateB;
      return 0;
    });

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4">Loading proposals...</p>
      </div>
    );
  }
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Proposals</h2>
      </div>
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      <div className="space-y-4">
        {filteredProposals.length === 0 ? (
          searchQuery ||
          statusFilter !== "All Status" ||
          yearFilter !== "All Years" ? (
            <p>No proposals match your current filters.</p>
          ) : (
            <p>No proposals found.</p>
          )
        ) : (
          <>
            <p className="text-sm text-gray-600">
              Showing {filteredProposals.length} of {proposals.length} proposals
            </p>
            {filteredProposals.map((proposal) => (
              <PaperCard key={proposal.id} paper={proposal} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default MyProposals;
