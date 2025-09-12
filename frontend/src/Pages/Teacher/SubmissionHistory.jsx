// src/pages/Teacher/SubmissionHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import FilterBar from "../../components/Common/FilterBar";
import SubmissionTable from "../../components/Teacher/SubmissionTable";

const API_BASE = "http://localhost:8000"; // adjust if needed

// Recognize P001 / PR001 and map to numeric IDs (1, etc.)
const parseSearchCode = (raw) => {
  if (!raw) return null;
  const s = String(raw).trim().toUpperCase();
  // Matches "P001", "P1", "PR001", "PR1"
  const m = /^(PR|P)0*(\d+)$/.exec(s);
  if (!m) return null;
  const kind = m[1]; // "P" or "PR"
  const idNum = parseInt(m[2], 10);
  if (Number.isNaN(idNum)) return null;
  return { kind, id: idNum, code: s };
};

export default function SubmissionHistory() {
  const [filters, setFilters] = useState([]);
  const [sort, setSort] = useState({ key: "submitted", dir: "desc" });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch filters (domains + status)
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/submissions/filters`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });

        const { domains, statusOptions } = res.data.data;

        setFilters([
          {
            name: "search",
            type: "input",
            inputType: "text",
            placeholder: "Search by title, code (P001, PR001)...",
            value: "",
          },
          {
            name: "time",
            type: "select",
            options: ["All Time", "Last 30 Days", "Last 90 Days", "This Year"],
            value: "All Time",
          },
          {
            name: "status",
            type: "select",
            options: [
              "All Status",
              ...statusOptions.map((s) => {
                const map = {
                  PENDING: "Pending",
                  ACCEPTED: "Accepted",
                  REJECTED: "Rejected",
                  UNDER_REVIEW: "Under Review",
                };
                return map[s] || s;
              }),
            ],
            value: "All Status",
          },
          {
            name: "field",
            type: "select",
            options: ["All Fields", ...domains.map((d) => d.domain_name)],
            value: "All Fields",
            domains: domains,
          },
        ]);
      } catch (err) {
        console.error("Failed to fetch filters:", err);
        setError("Failed to load filter options");
      }
    };

    fetchFilters();
  }, []);

  // Fetch data whenever filters or sort change
  useEffect(() => {
    const fetchData = async () => {
      if (filters.length === 0) return;

      setLoading(true);
      setError(null);

      try {
        const f = Object.fromEntries(
          filters.map(({ name, value }) => [name, value])
        );
        const fieldFilter = filters.find((f) => f.name === "field");
        const domains = fieldFilter?.domains || [];

        const params = new URLSearchParams();

        // For code searches, we'll handle filtering on frontend
        // For text searches, send to backend
        if (f.search?.trim()) {
          const searchTerm = f.search.trim();
          const parsedCode = parseSearchCode(searchTerm);
          
          if (!parsedCode) {
            // Only send regular text searches to backend
            params.append("q", searchTerm);
          }
          // Code searches will be handled by frontend filtering below
        }

        if (f.status && f.status !== "All Status") {
          const statusMap = {
            Pending: "PENDING",
            Accepted: "ACCEPTED",
            Rejected: "REJECTED",
            "Under Review": "UNDER_REVIEW",
          };
          const backendStatus = statusMap[f.status];
          if (backendStatus) params.append("status", backendStatus);
        }

        if (f.field && f.field !== "All Fields") {
          const selectedDomain = domains.find((d) => d.domain_name === f.field);
          if (selectedDomain) params.append("domain_id", selectedDomain.domain_id);
        }

        params.append("sort", sort.key);
        params.append("order", sort.dir);

        const url = `${API_BASE}/api/submissions?${params.toString()}`;

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });

        let results = res.data.data || [];

        // Apply frontend filtering for code searches
        const searchTerm = f.search?.trim();
        if (searchTerm) {
          const parsedCode = parseSearchCode(searchTerm);
          if (parsedCode) {
            // Filter by code: match against the actual database IDs
            results = results.filter(item => {
              // The backend generates codes like P001, P002 for papers and PR001, PR002 for proposals
              // parsedCode.kind is "P" or "PR", parsedCode.id is the numeric ID
              
              if (parsedCode.kind === "P" && item.type === "paper") {
                // For papers, extract the numeric ID from the composite ID "paper-1"
                const numericId = parseInt(item.id.split("-")[1]);
                return numericId === parsedCode.id;
              } else if (parsedCode.kind === "PR" && item.type === "proposal") {
                // For proposals, extract the numeric ID from the composite ID "proposal-1"  
                const numericId = parseInt(item.id.split("-")[1]);
                return numericId === parsedCode.id;
              }
              return false;
            });
          }
        }

        setData(results);
      } catch (err) {
        console.error("Failed to fetch submissions:", err);
        setError(err.response?.data?.message || "Failed to fetch submissions");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, sort]);

  const onFilterChange = (name, value) => {
    setFilters((prev) =>
      prev.map((f) => (f.name === name ? { ...f, value } : f))
    );
  };

  const handleSort = (key) => {
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  };

  if (error) {
    return (
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl md:text-2xl font-bold mb-4">Submission History</h1>
      {filters.length > 0 && (
        <div className="mb-6">
          <FilterBar filters={filters} onFilterChange={onFilterChange} />
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          {loading ? "Loading..." : `${data.length} submissions found`}
        </div>
      </div>
      {loading ? (
        <div className="bg-white rounded-xl shadow border p-8 text-center text-gray-500">
          Loading submissions...
        </div>
      ) : (
        <SubmissionTable items={data} onSort={handleSort} />
      )}
    </div>
  );
}