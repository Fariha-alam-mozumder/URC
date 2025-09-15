// frontend/src/Pages/Reviewer/ReviewHistoryPage.jsx
import React, { useState, useEffect } from "react";
import StatCard from "../../components/Common/StatCard";
//import ChartCard from "../../components/Common/ChartCard";
import FilterBar from "../../components/Common/FilterBar";
import ReviewTable from "../../components/Common/ReviewTable";
import PdfViewerModal from "../../components/Common/PdfViewerModal"; 
import { FaCheckCircle, FaClock, FaUpload, FaClipboard } from "react-icons/fa";
import axios from "axios";

const API_BASE_URL = import.meta.env.APP_URL || "http://localhost:8000/api";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const ReviewHistoryPage = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "All Status",
    sort: "latest",
  });

  const [stats, setStats] = useState({
    totalReviews: "0",
    avgReviewTime: "0",
    approvalRate: "0%",
    documentsUploaded: "0",
  });

  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState({
    monthlyData: [],
    decisionDistribution: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    per_page: 50,
  });

  
  const [pdfUrl, setPdfUrl] = useState(null);

  // Fetch review history
  useEffect(() => {
    const fetchReviewHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const queryParams = new URLSearchParams({
          search: filters.search,
          status: filters.status === "All Status" ? "" : filters.status,
          sort: filters.sort,
          page: String(pagination.current_page),
          limit: String(pagination.per_page),
        });

        const { data } = await axios.get(
          `${API_BASE_URL}/reviewer/review-history?${queryParams.toString()}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        if (data.success) {
          setTableData(data.reviews || []);
          setPagination((prev) => ({
            ...prev,
            current_page: data.pagination?.current_page ?? prev.current_page,
            per_page: data.pagination?.per_page ?? prev.per_page,
            total_count: data.pagination?.total_count ?? prev.total_count,
            total_pages: data.pagination?.total_pages ?? prev.total_pages,
          }));
        } else {
          setError(data.message || "Failed to fetch review history");
        }
      } catch (err) {
        console.error("Error fetching review history:", err);
        setError("Failed to load review history");
      } finally {
        setLoading(false);
      }
    };

    fetchReviewHistory();
  }, [filters, pagination.current_page, pagination.per_page]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/reviewer/stats/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (data.success) {
          setStats(data.stats);
          setChartData({
            monthlyData: data.monthlyData || [],
            decisionDistribution: data.decisionDistribution || [],
          });
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };

  const handleViewPdf = (row) => {
    const fullPdfUrl = row.pdf_path?.startsWith("http")
      ? row.pdf_path
      : row.pdf_path
      ? `${API_BASE}${row.pdf_path?.startsWith("/") ? row.pdf_path : "/" + row.pdf_path}`
      : `/public/documents/${row.proposalId || row.id}`;

    setPdfUrl(fullPdfUrl); 
  };

  const filterConfig = [
    {
      type: "input",
      name: "search",
      placeholder: "Search by title or team",
      value: filters.search,
    },
    {
      type: "select",
      name: "status",
      options: ["All Status", "Approved", "Needs Revision", "Rejected", "Under Review"],
      value: filters.status,
    },
    
  ];

  const statsWithIcons = [
    {
      title: "Total Reviews",
      value: stats.totalReviews,
      icon: <FaClipboard className="text-blue-500" />,
    },
    // {
    //   title: "Avg. Review Time (days)",
    //   value: stats.avgReviewTime,
    //   icon: <FaClock className="text-yellow-500" />,
    // },
    // {
    //   title: "Approval Rate",
    //   value: stats.approvalRate,
    //   icon: <FaCheckCircle className="text-green-500" />,
    // },
   
  ];

  if (loading && tableData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading review history...</p>
      </div>
    );
  }

  if (error && tableData.length === 0) {
    return (
      <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Review History</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsWithIcons.map((stat, i) => (
          <StatCard key={i} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

     
      {/* Filters */}
      <FilterBar filters={filterConfig} onFilterChange={handleFilterChange} />

      {/* Table */}
      <ReviewTable
        data={tableData}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, current_page: page }))}
        onViewPdf={handleViewPdf}
      />

      {/* Pagination info */}
      {pagination.total_count > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Showing {(pagination.current_page - 1) * pagination.per_page + 1} to{" "}
          {Math.min(pagination.current_page * pagination.per_page, pagination.total_count)} of{" "}
          {pagination.total_count} reviews
        </div>
      )}

      {/* Pdf Viewer Modal (opens new tab automatically) */}
      {pdfUrl && <PdfViewerModal pdfUrl={pdfUrl} />}
    </div>
  );
};

export default ReviewHistoryPage;