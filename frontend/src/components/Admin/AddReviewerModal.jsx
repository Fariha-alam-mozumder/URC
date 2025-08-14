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

  // Helpers (not hooks)
  const getDomainNames = (r) =>
    Array.isArray(r?.domain)
      ? r.domain
          .map((d) => (typeof d === "string" ? d : d?.name ?? d?.domain_name ?? ""))
          .filter(Boolean)
      : [];

  const getDomainIds = (r) =>
    Array.isArray(r?.domain)
      ? r.domain
          .map((d) => (typeof d === "object" ? d.id ?? d.domain_id : undefined))
          .filter((v) => typeof v === "number")
      : [];

  // 2) useMemo still runs every render (that’s fine)
  const term = searchTerm.trim().toLowerCase();
  const filteredReviewers = useMemo(() => {
    return potentialReviewers.filter((r) => {
      const inName = (r?.name || "").toLowerCase().includes(term);
      const inEmail = (r?.email || "").toLowerCase().includes(term);
      const inDept = (r?.department || "").toLowerCase().includes(term);
      const inDomains = getDomainNames(r).some((dn) => dn.toLowerCase().includes(term));
      return inName || inEmail || inDept || inDomains;
    });
  }, [potentialReviewers, term]);

  // 3) Only now, after hooks, short-circuit rendering
  if (!show) return null;

  const toggleSelect = (id) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const handleSendInvites = () => {
    if (!onSendInvitation) return;
    if (selectedIds.length === 0) {
      alert("Please select at least one reviewer.");
      return;
    }
    onSendInvitation(selectedIds);
    setSelectedIds([]);
    setSearchTerm("");
  };

  const handleAddReviewer = () => {
    if (typeof onAddReviewer !== "function") return;
    if (selectedIds.length !== 1) {
      alert("Please select exactly one person to add as reviewer.");
      return;
    }
    const selected = filteredReviewers.find((r) => r.id === selectedIds[0]);
    if (!selected) return;
    const domainIds = getDomainIds(selected); // map [{id,name}] -> [id]
    onAddReviewer(selected.id, domainIds);
    setSelectedIds([]);
    setSearchTerm("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] flex flex-col p-6 relative" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close modal">
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name, email, department, or domain…"
          className="mb-4 w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* List */}
        <div className="overflow-auto flex-1 mb-20">
          {filteredReviewers.length > 0 ? (
            filteredReviewers.map((r) => (
              <label key={r.id} className="flex items-center border rounded p-3 mb-2 cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(r.id)}
                  onChange={() => toggleSelect(r.id)}
                  className="mr-4"
                />
                <div>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-gray-500 text-sm">{r.email}</div>
                  <div className="text-sm">{r.department}</div>

                  {/* Domain tags (names only) */}
                  {getDomainNames(r).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {getDomainNames(r).map((dn, idx) => (
                        <span
                          key={`${r.id}-dn-${idx}`}
                          className="inline-block bg-black text-white px-2 py-0.5 rounded-sm text-[10px]">
                          {dn}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </label>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">No reviewers found.</div>
          )}
        </div>

        {/* Footer actions */}
        <div className="absolute bottom-6 left-6 right-6 flex gap-3">
          <CommonButton label={buttonLabel} onClick={handleSendInvites} className="w-full flex items-center justify-center" />
          {typeof onAddReviewer === "function" && (
            <CommonButton label="Add Reviewer" onClick={handleAddReviewer} className="w-full flex items-center justify-center" />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddReviewerModal;