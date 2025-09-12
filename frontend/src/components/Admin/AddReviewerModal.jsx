import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import CommonButton from "../Common/CommonButton";

/**
 * This modal is used in two contexts:
 * 1) Inviting teachers to become reviewers (items look like { id: teacher_id, domains: [{id,name}], ... })
 * 2) Assigning active reviewers (items look like { id: reviewer_id, expertise: ["AI","ML"], ... })
 *
 * It now reads tags from EITHER `domains[].name` OR `expertise[]`.
 */
const AddReviewerModal = ({
  show,
  onClose,
  potentialReviewers = [],
  onSubmit, // single callback
  buttonLabel = "Confirm",
  title = "Select Reviewers",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const getTagNames = (reviewer) => {
    // domains: [{id, name}] (invite flow)
    if (Array.isArray(reviewer?.domains) && reviewer.domains.length > 0) {
      return reviewer.domains.map((d) => d?.name).filter(Boolean);
    }
    // expertise: ["AI", "ML"] (assignment flow)
    if (Array.isArray(reviewer?.expertise) && reviewer.expertise.length > 0) {
      return reviewer.expertise.filter(Boolean);
    }
    return [];
  };

  const term = searchTerm.trim().toLowerCase();
  const filteredReviewers = useMemo(() => {
    return potentialReviewers.filter((r) => {
      const inName = (r?.name || "").toLowerCase().includes(term);
      const inEmail = (r?.email || "").toLowerCase().includes(term);
      const inDept = (r?.department || "").toLowerCase().includes(term);
      const inTags = getTagNames(r).some((t) => (t || "").toLowerCase().includes(term));
      return inName || inEmail || inDept || inTags;
    });
  }, [potentialReviewers, term]);

  if (!show) return null;

  const toggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const handlePrimary = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one person.");
      return;
    }
    if (onSubmit) {
      await onSubmit(selectedIds);
    } else {
      console.warn("No onSubmit handler provided to AddReviewerModal");
    }
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
          placeholder="Search by name, email, department, expertise..."
          className="mb-4 w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* List */}
        <div className="overflow-auto flex-1 mb-16">
          {filteredReviewers.length > 0 ? (
            filteredReviewers.map((r) => {
              const tags = getTagNames(r);
              return (
                <label
                  key={r.id}
                  className="flex items-center border rounded p-3 mb-2 cursor-pointer hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(r.id)}
                    onChange={() => toggleSelect(r.id)}
                    className="mr-4"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-gray-500 text-sm">{r.email}</div>
                    <div className="text-sm text-gray-600">{r.department}</div>

                    {tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 mt-1">
                        No expertise/domains specified
                      </div>
                    )}
                  </div>
                </label>
              );
            })
          ) : (
            <div className="text-gray-500 text-center py-8">
              {potentialReviewers.length === 0
                ? "No reviewers available."
                : "No reviewers found matching your search."}
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="absolute bottom-6 left-6 right-6">
          <CommonButton
            label={`${buttonLabel} (${selectedIds.length} selected)`}
            onClick={handlePrimary}
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
