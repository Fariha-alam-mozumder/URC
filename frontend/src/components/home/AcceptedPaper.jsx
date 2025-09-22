import { useState, useEffect } from "react";
import axios from "axios";
import { resolveApiUrl } from "../../config/api";
import { useNavigate } from "react-router-dom";

const AbstractModal = ({ isOpen, onClose, paper, onDownload }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform animate-slideIn">
        <div className="max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-start">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 pr-4 leading-tight">
              {paper?.title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl font-light min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              ×
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <p className="text-sm sm:text-base text-gray-700">
                <span className="font-semibold text-gray-900">Authors:</span>
                <span className="italic ml-2">{paper?.authors}</span>
              </p>
              <p className="text-sm sm:text-base text-gray-700">
                <span className="font-semibold text-gray-900">Department:</span>
                <span className="ml-2 text-blue-600 font-medium">
                  {paper?.department}
                </span>
              </p>

              {paper?.tags && paper.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {paper.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                Abstract
              </h3>
              <p className="text-gray-800 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                {paper?.abstract || "No abstract available."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700 hover:border-gray-400"
              >
                Close
              </button>
              {paper?.has_pdf && (
                <button
                  onClick={() => onDownload?.(paper)}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-center transform hover:scale-105 active:scale-95"
                >
                  Download PDF
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AcceptedPaper = ({
  user = null,
  token = null,
  onNavigateToLogin = () => {},
}) => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [departments, setDepartments] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const navigate = useNavigate();
  const goToSignup = () => navigate("/signup");
  // Fetch filters (departments and topics) from API with axios
  useEffect(() => {
    const controller = new AbortController();

    const fetchFilters = async () => {
      try {
        const url = resolveApiUrl("/public/filters");
        const { data } = await axios.get(url, { signal: controller.signal });
        if (data?.success) {
          setDepartments([
            { department_id: 0, department_name: "All Departments" },
            ...(data.departments || []),
          ]);
          setTopics([
            { domain_id: 0, domain_name: "All Topics" },
            ...(data.domains || []),
          ]);
        } else {
          throw new Error(data?.message || "Failed to fetch filters");
        }
      } catch (e) {
        if (axios.isCancel(e) || e.name === "CanceledError") return;
        console.error("Failed to fetch filters:", e);
        setDepartments([
          { department_id: 0, department_name: "All Departments" },
        ]);
        setTopics([{ domain_id: 0, domain_name: "All Topics" }]);
      }
    };

    fetchFilters();
    return () => controller.abort();
  }, []);

  // Fetch papers from API with axios when filters ready/changed
  useEffect(() => {
    if (departments.length === 0 || topics.length === 0) return;

    const controller = new AbortController();

    const fetchPapers = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {};
        if (selectedDepartment && selectedDepartment !== "All Departments") {
          const dept = departments.find(
            (d) => d.department_name === selectedDepartment
          );
          if (dept && dept.department_id !== 0)
            params.department_id = String(dept.department_id);
        }
        if (selectedTopic && selectedTopic !== "All Topics") {
          const topic = topics.find((t) => t.domain_name === selectedTopic);
          if (topic && topic.domain_id !== 0)
            params.domain_id = String(topic.domain_id);
        }

        const url = resolveApiUrl("/public/accepted-papers");
        const { data } = await axios.get(url, {
          params,
          signal: controller.signal,
        });

        if (data?.success) {
          setPapers(data.papers || []);
        } else {
          throw new Error(data?.message || "Failed to fetch papers");
        }
      } catch (e) {
        if (axios.isCancel(e) || e.name === "CanceledError") return;
        console.error("Failed to fetch accepted papers:", e);
        if (e.response) {
          setError(
            e.response.data?.message ||
              `Request failed with status ${e.response.status}`
          );
        } else if (e.request) {
          setError("Cannot connect to the server. Please try again later.");
        } else {
          setError(e.message || "An unexpected error occurred.");
        }
        setPapers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
    return () => controller.abort();
  }, [selectedDepartment, selectedTopic, departments, topics]);

  const handleReadAbstract = (paper) => {
    if (!user || !token) {
      onNavigateToLogin();
      return;
    }
    setSelectedPaper(paper);
    setShowModal(true);
  };

  // CHANGED: protected download via API, no direct href to server file
  const handleDownloadPdf = async (paper) => {
    if (!user || !token) {
      onNavigateToLogin();
      return;
    }
    if (!paper?.id || !paper?.has_pdf) {
      alert("PDF not available for this paper.");
      return;
    }

    try {
      setDownloadingId(paper.id);
      const url = resolveApiUrl(`/papers/${paper.id}/download`);
      const resp = await axios.get(url, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });
      const blobUrl = URL.createObjectURL(
        new Blob([resp.data], { type: "application/pdf" })
      );
      window.open(blobUrl, "_blank", "noopener,noreferrer");
      // Clean up later
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
    } catch (e) {
      console.error(e);
      alert("Unable to download this PDF right now.");
    } finally {
      setDownloadingId(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPaper(null);
  };

  if (loading) {
    return (
      <section className="px-4 sm:px-6 lg:px-12 xl:px-20 py-12 sm:py-16 bg-gray-200 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-gray-600 rounded-full animate-spin mx-auto mt-2 ml-2"></div>
          </div>
          <p className="text-gray-700 text-lg font-medium">Loading papers...</p>
          <p className="text-gray-500 text-sm mt-2">
            Please wait while we fetch the latest research
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 sm:px-6 lg:px-12 xl:px-20 py-12 sm:py-16 bg-gray-200 min-h-screen flex justify-center items-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-md">
          <div className="text-6xl mb-6">⚠️</div>
          <p className="text-red-600 text-xl font-semibold mb-3">
            Error loading papers
          </p>
          <p className="text-gray-600 text-sm mb-6 bg-gray-50 p-3 rounded-lg">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all duration-200 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  const displayedPapers = showAll ? papers : papers.slice(0, 3);

  return (
    <>
      <section className="px-4 sm:px-6 lg:px-12 xl:px-20 py-12 sm:py-16 lg:py-20 bg-gray-200 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header & Filters */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 sm:mb-12 gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-900 mb-2">
                Accepted Papers
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Explore cutting-edge research from our academic community
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="border-2 border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:border-gray-400 transition-all duration-200 min-w-0 sm:min-w-[200px]"
              >
                {departments.map((dept) => (
                  <option key={dept.department_id} value={dept.department_name}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="border-2 border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:border-gray-400 transition-all duration-200 min-w-0 sm:min-w-[180px]"
              >
                {topics.map((topic) => (
                  <option key={topic.domain_id} value={topic.domain_name}>
                    {topic.domain_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Papers Grid */}
          <div className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {displayedPapers.map((paper, idx) => (
              <div
                key={paper.id || idx}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 space-y-4 sm:space-y-6 flex flex-col h-full transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="space-y-3">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 line-clamp-3 group-hover:text-blue-600 transition-colors duration-200">
                    {paper.title}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base italic text-gray-700 font-medium">
                      {paper.authors}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full">
                      {paper.department}
                    </p>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-gray-700 flex-grow line-clamp-4 leading-relaxed">
                  {paper.abstract || "No abstract available."}
                </p>

                {paper.tags && paper.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {paper.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="bg-indigo-100 text-xs sm:text-sm text-indigo-700 px-3 py-1.5 rounded-full font-medium hover:bg-indigo-200 transition-colors duration-200"
                      >
                        {tag}
                      </span>
                    ))}
                    {paper.tags.length > 3 && (
                      <span className="bg-gray-100 text-xs sm:text-sm text-gray-500 px-3 py-1.5 rounded-full font-medium">
                        +{paper.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleReadAbstract(paper)}
                    className="flex-1 bg-gray-900 text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-gray-700 transition-all duration-200 text-sm sm:text-base font-medium transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                  >
                    Read Abstract
                  </button>
                  {!user || !token ? (
                    <button
                      onClick={goToSignup}
                      className="flex-1 border-2 border-gray-300 text-blue-600 px-4 sm:px-6 py-3 rounded-xl
                   text-sm sm:text-base hover:bg-gray-50 hover:border-gray-400 transition-all
                   duration-200 font-medium transform hover:scale-105 active:scale-95"
                      aria-label="Sign up to download PDF"
                    >
                      Sign up to Download PDF
                    </button>
                  ) : paper.has_pdf ? (
                    <button
                      onClick={() => handleDownloadPdf(paper)}
                      className="flex-1 border-2 border-gray-300 px-4 sm:px-6 py-3 rounded-xl text-sm sm:text-base
                   hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium
                   transform hover:scale-105 active:scale-95"
                    >
                      Download PDF
                    </button>
                  ) : (
                    <button
                      className="flex-1 border-2 border-gray-200 text-gray-400 px-4 sm:px-6 py-3 rounded-xl
                   text-sm sm:text-base cursor-not-allowed"
                      disabled
                    >
                      No PDF
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* No papers message */}
          {papers.length === 0 && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
                <div className="text-8xl mb-6">📄</div>
                <p className="text-gray-700 text-xl font-semibold mb-3">
                  No accepted papers found
                </p>
                <p className="text-gray-500 text-base">
                  Try adjusting your filter criteria to see more results
                </p>
              </div>
            </div>
          )}

          {/* Toggle Button */}
          {papers.length > 3 && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-8 py-4 text-white bg-gray-900 rounded-2xl hover:bg-gray-700 transition-all duration-300 font-semibold text-base sm:text-lg transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <span>
                  {showAll ? "Show Less" : `View All Papers (${papers.length})`}
                </span>
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    showAll ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Abstract Modal */}
      <AbstractModal
        isOpen={showModal}
        onClose={closeModal}
        paper={selectedPaper}
        onDownload={handleDownloadPdf}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default AcceptedPaper;
