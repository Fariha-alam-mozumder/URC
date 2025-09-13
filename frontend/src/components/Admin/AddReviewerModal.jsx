import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import CommonButton from "../Common/CommonButton";

const AddReviewerModal = ({
  show,
  onClose,
  potentialReviewers = [],
  onSendInvitation,
  onAddReviewer,
  buttonLabel = "Send Invitation",
  title = "Add Reviewer",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // Fixed helper to extract domain names based on actual API response
  const getDomainNames = (reviewer) => {
    // The API returns domains in this format: domains: [{ id: 1, name: "AI" }]
    if (Array.isArray(reviewer?.domains) && reviewer.domains.length > 0) {
      return reviewer.domains.map((domain) => domain.name).filter(Boolean);
    }
    return [];
  };

  const getDomainIds = (reviewer) => {
    if (Array.isArray(reviewer?.domains) && reviewer.domains.length > 0) {
      return reviewer.domains
        .map((domain) => domain.id)
        .filter((id) => typeof id === "number");
    }
    return [];
  };

  // Fixed search filtering
  const term = searchTerm.trim().toLowerCase();
  const filteredReviewers = useMemo(() => {
    return potentialReviewers.filter((reviewer) => {
      const inName = (reviewer?.name || "").toLowerCase().includes(term);
      const inEmail = (reviewer?.email || "").toLowerCase().includes(term);
      const inDept = (reviewer?.department || "").toLowerCase().includes(term);
      const inDomains = getDomainNames(reviewer).some((domainName) =>
        (domainName || "").toLowerCase().includes(term)
      );
      return inName || inEmail || inDept || inDomains;
    });
  }, [potentialReviewers, term]);

  // Only render if modal should be shown
  if (!show) return null;

  const toggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const handleAdd = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one reviewer.");
      return;
    }
    await Promise.all(selectedIds.map((id) => onAddReviewer(id)));
    setSelectedIds([]);
    setSearchTerm("");
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] flex flex-col p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search reviewers..."
          className="mb-4 w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Scrollable reviewers list */}
        <div className="overflow-auto flex-1 mb-16">
          {filteredReviewers.length > 0 ? (
            filteredReviewers.map((reviewer) => {
              const domainNames = getDomainNames(reviewer);

              return (
                <label
                  key={reviewer.id}
                  className="flex items-center border rounded p-3 mb-2 cursor-pointer hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(reviewer.id)}
                    onChange={() => toggleSelect(reviewer.id)}
                    className="mr-4"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{reviewer.name}</div>
                    <div className="text-gray-500 text-sm">
                      {reviewer.email}
                    </div>
                    <div className="text-sm text-gray-600">
                      {reviewer.department}
                    </div>

                    {/* Display domains */}
                    {domainNames.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {domainNames.map((domainName, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {domainName}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Show message if no domains */}
                    {domainNames.length === 0 && (
                      <div className="text-xs text-gray-400 mt-1">
                        No expertise domains specified
                      </div>
                    )}
                  </div>
                </label>
              );
            })
          ) : (
            <div className="text-gray-500 text-center py-8">
              {potentialReviewers.length === 0
                ? "No potential reviewers available."
                : "No reviewers found matching your search."}
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="absolute bottom-6 left-6 right-6">
          <CommonButton
            label={`${buttonLabel} (${selectedIds.length} selected)`}
            onClick={handleAdd}
            disabled={selectedIds.length === 0}
            className={`w-full flex items-center justify-center gap-1 text-sm px-3 py-2 rounded ${
              selectedIds.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-700 text-white hover:bg-blue-900"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default AddReviewerModal;