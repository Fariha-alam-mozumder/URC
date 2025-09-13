import React, { useState, useEffect, useMemo } from "react";
import PaperCard from "../../components/Common/PaperCard";
import UploadDocModal from "../../components/Teacher/CreateTeam/UploadModal";
import FilterBar from "../../components/Common/FilterBar";
import axios from "axios";

const MyPapers = () => {
  // filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [yearFilter, setYearFilter] = useState("All Years");
  const [sortFilter, setSortFilter] = useState("Latest First");

  // list
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // extract dynamic year list from papers
  const availableYears = useMemo(() => {
    const years = papers.map((p) => new Date(p.date).getFullYear().toString());
    const uniqueYears = Array.from(new Set(years)).sort((a, b) => b - a);
    return ["All Years", ...uniqueYears];
  }, [papers]);

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
    const formatPid = (n) => `P${String(n).padStart(3, "0")}`;
    const fetchPapers = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          "http://localhost:8000/api/teacher/my-teams/papers",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );

        const formatted = res.data.data.map((p) => {
          console.log(`Processing paper: ${p.title}`);
          console.log(`PDF path: "${p.pdf_path}"`);
          console.log(`Download URL: "${p.download_url}"`);

          return {
            id: p.paper_id,
            idTag: formatPid(p.paper_id),
            title: p.title,
            team: p.team?.team_name || "Unknown Team",
            date: new Date(p.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            lastEditor: p.teacher?.user?.name || "Unknown",
            abstract: p.abstract || "",
            domainName: p.team?.domain?.domain_name,
            status: p.status,
            role: "Contributor",
            reviewers: [],
            comments: 0,
            fileUrl: p.download_url,
          };
        });

        console.log("Formatted papers:", formatted);
        setPapers(formatted);
      } catch (err) {
        console.error("❌ Error fetching papers:", err);
        setError(err.response?.data?.message || "Failed to fetch papers");
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  // Apply filters
  const filteredPapers = papers
    .filter((paper) => {
      // search filter
      if (
        searchQuery &&
        !paper.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // status filter (case-insensitive ✅)
      if (
        statusFilter !== "All Status" &&
        paper.status.toLowerCase() !== statusFilter.toLowerCase()
      ) {
        return false;
      }

      // year filter
      if (yearFilter !== "All Years") {
        const paperYear = new Date(paper.date).getFullYear().toString();
        if (paperYear !== yearFilter) {
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

  if (loading){
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4">Loading papers...</p>
      </div>
    );
  }
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
              <PaperCard key={paper.id} paper={paper} role="student" />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default MyPapers;
