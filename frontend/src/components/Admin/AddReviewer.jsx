import React, { useMemo, useState, useEffect } from "react";
import { X } from "lucide-react";
import CommonButton from "../Common/CommonButton";

const AddReviewer = ({
  show,
  onClose,
  potentialReviewers = [],
  onSubmit,
  buttonLabel = "Confirm",
  title = "Select Reviewers",
  minSelected = 1,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // Reset when modal closes
  useEffect(() => {
    if (!show) {
      setSelectedIds([]);
      setSearchTerm("");
    }
  }, [show]);

  const handleClose = () => {
    setSelectedIds([]);
    setSearchTerm("");
    onClose?.();
  };

  const getTagNames = (reviewer) => {
    if (Array.isArray(reviewer?.domains) && reviewer.domains.length > 0) {
      return reviewer.domains.map((d) => d?.name).filter(Boolean);
    }
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
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const handlePrimary = async () => {
    if (selectedIds.length < minSelected) {
      const needed = minSelected - selectedIds.length;
      alert(
        `Please select at least ${minSelected} reviewer${minSelected > 1 ? "s" : ""}. You need ${needed} more.`
      );
      return;
    }
    if (onSubmit) {
      await onSubmit(selectedIds);
    } else {
      console.warn("No onSubmit handler provided to AddReviewer");
    }
    setSelectedIds([]);
    setSearchTerm("");
  };

  const notEnough = selectedIds.length < minSelected;
  const needed = Math.max(0, minSelected - selectedIds.length);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] flex flex-col p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700" aria-label="Close modal">
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

        {/* Minimum requirement hint */}
        {minSelected >= 1 && (
          <div className="text-sm mb-2">
            <span className="font-medium">Minimum required:</span> {minSelected} reviewer{minSelected > 1 ? "s" : ""}.{" "}
            {notEnough ? (
              <span className="text-red-600">You need {needed} more selection{needed > 1 ? "s" : ""}.</span>
            ) : (
              <span className="text-green-700">Good to go!</span>
            )}
          </div>
        )}

        {/* List */}
        <div className="overflow-auto flex-1 mb-16">
          {filteredReviewers.length > 0 ? (
            filteredReviewers.map((r) => {
              const id = r?.id ?? r?.user_id;
              const tags = getTagNames(r);
              return (
                <label key={id} className="flex items-center border rounded p-3 mb-2 cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(id)}
                    onChange={() => toggleSelect(id)}
                    className="mr-4"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{r?.name || "Unnamed"}</div>
                    <div className="text-gray-500 text-sm">{r?.email || "No email"}</div>
                    <div className="text-sm text-gray-600">{r?.department || "No department"}</div>

                    {tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tags.map((t, idx) => (
                          <span
                            key={`${id}-tag-${idx}`}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 mt-1">No expertise/domains specified</div>
                    )}
                  </div>
                </label>
              );
            })
          ) : (
            <div className="text-gray-500 text-center py-8">
              {potentialReviewers.length === 0 ? "No reviewers available." : "No reviewers found matching your search."}
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="absolute bottom-6 left-6 right-6">
          <CommonButton
            label={`${buttonLabel} (${selectedIds.length} selected)${notEnough ? ` — need ${needed} more` : ""}`}
            onClick={handlePrimary}
            disabled={notEnough}
            className={`w-full flex items-center justify-center gap-1 text-sm px-3 py-2 rounded ${
              notEnough ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-700 text-white hover:bg-blue-900"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default AddReviewer;
