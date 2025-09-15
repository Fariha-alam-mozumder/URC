import { useState, useEffect } from "react";

// Abstract Modal Component
const AbstractModal = ({ isOpen, onClose, paper }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold pr-4">{paper?.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold min-w-[32px] min-h-[32px] flex items-center justify-center"
            >
              ×
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-sm italic text-gray-700 mb-2">
              <strong>Authors:</strong> {paper?.authors}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Department:</strong> {paper?.department}
            </p>
            
            {paper?.tags && paper.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {paper.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Abstract</h3>
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {paper?.abstract || "No abstract available."}
            </p>
          </div>
          
          <div className="flex justify-end mt-6 gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Close
            </button>
            {paper?.pdf_url && (
              <a
                href={paper.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
              >
                Download PDF
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AcceptedPaper = ({ 
  user = null, 
  token = null, 
  onNavigateToLogin = () => {} 
}) => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [departments, setDepartments] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  // Fetch papers from API
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        
        // Add department filter if selected
        if (selectedDepartment && selectedDepartment !== "All Departments") {
          const dept = departments.find(d => d.department_name === selectedDepartment);
          if (dept && dept.department_id !== 0) {
            params.append('department_id', dept.department_id.toString());
          }
        }
        
        // Add topic filter if selected
        if (selectedTopic && selectedTopic !== "All Topics") {
          const topic = topics.find(t => t.domain_name === selectedTopic);
          if (topic && topic.domain_id !== 0) {
            params.append('domain_id', topic.domain_id.toString());
          }
        }

        const url = `http://localhost:8000/api/public/accepted-papers${params.toString() ? `?${params.toString()}` : ''}`;
        console.log('Fetching papers from:', url);

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.success) {
          setPapers(data.papers || []);
        } else {
          throw new Error(data.message || 'Failed to fetch papers');
        }
      } catch (error) {
        console.error("Failed to fetch accepted papers:", error);
        setError(error.message);
        setPapers([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch papers if we have departments and topics loaded
    if (departments.length > 0 && topics.length > 0) {
      fetchPapers();
    }
  }, [selectedDepartment, selectedTopic, departments, topics]);

  // Fetch filters (departments and topics) from API
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        console.log('Fetching filters from: http://localhost:8000/api/public/filters');
        
        const response = await fetch("http://localhost:8000/api/public/filters");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Filters Response:', data);
        
        if (data.success) {
          setDepartments([
            { department_id: 0, department_name: "All Departments" },
            ...(data.departments || []),
          ]);
          setTopics([
            { domain_id: 0, domain_name: "All Topics" },
            ...(data.domains || []),
          ]);
        } else {
          throw new Error(data.message || 'Failed to fetch filters');
        }
      } catch (e) {
        console.error("Failed to fetch filters:", e);
        // Fallback to default options
        setDepartments([
          { department_id: 0, department_name: "All Departments" },
        ]);
        setTopics([{ domain_id: 0, domain_name: "All Topics" }]);
      }
    };
    
    fetchFilters();
  }, []);

  const handleReadAbstract = (paper) => {
    if (!user || !token) {
      // Redirect to login if not authenticated
      onNavigateToLogin();
      return;
    }
    
    // Show abstract in modal
    setSelectedPaper(paper);
    setShowModal(true);
  };

  const handleDownloadPdf = (paper) => {
    if (!user || !token) {
      // Redirect to login if not authenticated
      onNavigateToLogin();
      return;
    }
    
    if (paper.pdf_url) {
      // Open PDF in new tab for download
      window.open(paper.pdf_url, '_blank');
    } else {
      alert('PDF not available for this paper.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPaper(null);
  };

  if (loading) {
    return (
      <section className="px-4 sm:px-6 md:px-12 py-8 bg-gray-200 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading papers...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 sm:px-6 md:px-12 py-8 bg-gray-200 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg mb-2">Error loading papers</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
      <section className="px-4 sm:px-6 md:px-12 py-8 bg-gray-200 min-h-screen flex flex-col">
        {/* Header & Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mt-32 gap-3">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            Accepted Papers
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {displayedPapers.map((paper, idx) => (
            <div
              key={paper.id || idx}
              className="bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 space-y-4 flex flex-col h-full"
            >
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">
                  {paper.title}
                </h3>
                <p className="text-sm italic text-gray-600 mb-1">{paper.authors}</p>
                <p className="text-xs font-medium text-blue-600 mb-3">
                  {paper.department}
                </p>
              </div>
              
              <p className="text-sm text-gray-700 flex-grow line-clamp-4">
                {paper.abstract || "No abstract available."}
              </p>
              
              {paper.tags && paper.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {paper.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-xs text-gray-700 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 pt-2">
                <button 
                  onClick={() => handleReadAbstract(paper)}
                  className="flex-1 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition-colors text-sm font-medium"
                >
                  Read Abstract
                </button>
                <button 
                  onClick={() => handleDownloadPdf(paper)}
                  className="flex-1 border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-50 transition-colors font-medium"
                >
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No papers message */}
        {papers.length === 0 && !loading && !error && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-gray-600 text-lg mb-2">No accepted papers found</p>
              <p className="text-gray-500 text-sm">Try adjusting your filter criteria</p>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        {papers.length > 3 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              {showAll ? "Show Less" : `View All Papers (${papers.length})`}
            </button>
          </div>
        )}
      </section>

      {/* Abstract Modal */}
      <AbstractModal 
        isOpen={showModal}
        onClose={closeModal}
        paper={selectedPaper}
      />
    </>
  );
};

export default AcceptedPaper;