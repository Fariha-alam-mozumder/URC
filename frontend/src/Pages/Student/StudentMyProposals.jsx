import React, { useRef, useState, useEffect } from "react";
import PaperCard from "../../components/Common/PaperCard";
import FilterBar from "../../components/Common/FilterBar";
import axios from "axios";

const StudentMyProposals = () => {
  // filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  //const [roleFilter, setRoleFilter] = useState("All Roles");
  const [yearFilter, setYearFilter] = useState("All Years");
  const [sortFilter, setSortFilter] = useState("Latest First");

  // list
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filters = [
    { 
      type: "input", 
      name: "search", 
      placeholder: "Search proposals by title...",
      value: searchQuery  // Add current value
    },
    {
      type: "select",
      name: "status",
      options: ["All Status", "Accepted", "Rejected", "Pending","Under Review"],
      value: statusFilter  // Add current value
    },
    // {
    //   type: "select",
    //   name: "role",
    //   options: ["All Roles", "Mentor", "Lead Author", "Reviewer"],
    //   value: roleFilter  // Add current value
    // },
    { 
      type: "select", 
      name: "year", 
      options: ["All Years", "2025", "2024"],
      value: yearFilter  // Add current value
    },
    { 
      type: "select", 
      name: "sort", 
      options: ["Latest First", "Oldest First"],
      value: sortFilter  // Add current value
    },
  ];

  // FIXED: Create a proper function that handles filter changes
  const handleFilterChange = (filterName, value) => {
    console.log(`Filter ${filterName} changed to:`, value);
    
    switch(filterName) {
      case 'search':
        setSearchQuery(value);
        break;
      case 'status':
        setStatusFilter(value);
        break;
      // case 'role':
      //   setRoleFilter(value);
      //   break;
      case 'year':
        setYearFilter(value);
        break;
      case 'sort':
        setSortFilter(value);
        break;
      default:
        console.warn('Unknown filter:', filterName);
    }
  };

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          "http://localhost:8000/api/student/my-teams/proposals",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );

        const formatted = res.data.data.map((p) => {
          console.log(` Processing proposals: ${p.title}`);
          console.log(` PDF path: "${p.pdf_path}"`);
          console.log(` Download URL: "${p.download_url}"`);

          return {
            id: p.proposal_id,
            title: p.title,
            team: p.team?.team_name || "Unknown Team",
            date: new Date(p.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            lastEditor: p.teacher?.user?.name || "Unknown",
            status: p.status,
            role: "Contributor",
            reviewers: [],
            comments: 0,
            fileUrl: p.download_url,
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

  // ENHANCED: Apply all filters, not just search
  const filteredProposals = proposals.filter((proposal) => {
    // Search filter
    if (searchQuery && !proposal.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
  
    // Status filter
    if (statusFilter !== "All Status" && proposal.status !== statusFilter.toUpperCase()) {
      return false;
    }
    
    // Role filter (you might need to adjust this based on your data structure)
    // if (roleFilter !== "All Roles" && proposal.role !== roleFilter) {
    //   return false;
    // }
    
    // Year filter
    if (yearFilter !== "All Years") {
      const proposalYear = new Date(proposal.date).getFullYear().toString();
      if (proposalYear !== yearFilter) {
        return false;
      }
    }
    
    return true;
  }).sort((a, b) => {
    // Sort filter
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    if (sortFilter === "Latest First") {
      return dateB - dateA;
    } else if (sortFilter === "Oldest First") {
      return dateA - dateB;
    }
    
    return 0;
  });

  if (loading) return <p className="p-6">Loading proposals...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Proposals</h2>
      </div>

      {/* FIXED: Pass the function, not the object */}
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      <div className="space-y-4">
        {filteredProposals.length === 0 ? (
          searchQuery || statusFilter !== "All Status" || yearFilter !== "All Years" ? (
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
              <PaperCard key={proposal.id} paper={proposal} role="student" />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentMyProposals;