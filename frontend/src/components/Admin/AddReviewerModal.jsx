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
  // 1) Hooks must be top-level and unconditional
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);




  // Enhanced helper to extract domain names with more property checks
// Enhanced helper to extract domain names based on your Prisma schema
const getDomainNames = (r) => {
  if (Array.isArray(r?.expertise) && r.expertise.length > 0) {
    return r.expertise; // ["AI", "Networks"]
  }
  // Optional fallback if in future you pass the nested relation:
  if (Array.isArray(r?.teacher?.user?.userdomain)) {
    return r.teacher.user.userdomain
      .map((ud) => ud?.domain?.domain_name)
      .filter(Boolean);
  }
  return [];
};


  const getDomainIds = (r) =>
    Array.isArray(r?.domain)
      ? r.domain
          .map((d) => (typeof d === "object" ? d.id ?? d.domain_id : undefined))
          .filter((v) => typeof v === "number")
      : [];

  // Debug function to log domain structure
  const debugDomainStructure = (reviewer) => {
    console.log("Reviewer domain structure:", {
      reviewer: reviewer.name,
      domain: reviewer.domain,
      domainType: typeof reviewer.domain,
      isArray: Array.isArray(reviewer.domain)
    });
  };

  // 2) useMemo still runs every render (that's fine)
  const term = searchTerm.trim().toLowerCase();
const filteredReviewers = useMemo(() => {
  return potentialReviewers.filter((r) => {
    const inName = (r?.name || "").toLowerCase().includes(term);
    const inEmail = (r?.email || "").toLowerCase().includes(term);
    const inDept = (r?.department || "").toLowerCase().includes(term);
    const inDomains = getDomainNames(r).some((dn) =>
      (dn || "").toLowerCase().includes(term)
    );
    return inName || inEmail || inDept || inDomains;
  });
}, [potentialReviewers, term]);


  // 3) Only now, after hooks, short-circuit rendering
  if (!show) return null;

  const toggleSelect = (id) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const handleSend = () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one reviewer.");
      return;
    }
    onSendInvitation(selectedIds);
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
            filteredReviewers.map((r) => {
              const domainNames = getDomainNames(r);
              
              // Debug log for first few reviewers to check domain structure
              if (filteredReviewers.indexOf(r) < 3) {
                debugDomainStructure(r);
              }
              
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

                    {/* Debug info - remove this after fixing */}
                    {domainNames.length === 0 && r.domain && (
                      <div className="text-xs text-red-500 mt-1">
                        Debug: Domain exists but not displaying. Check console.
                      </div>
                    )}

                    {/* Multiple domain tags */}
                    {domainNames.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {domainNames.map((domainItem, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {domainItem}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </label>
              );
            })
          ) : (
            <div className="text-gray-500 text-center py-8">No reviewers found.</div>
          )}
        </div>

        {/* Assign button */}
        <div className="absolute bottom-6 left-6 right-6">
          <CommonButton
            label={buttonLabel}
            onClick={handleSend}
            className="w-full flex items-center justify-center flex gap-1 text-sm bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-900"
          />
        </div>
      </div>
    </div>
  );
};

export default AddReviewerModal;