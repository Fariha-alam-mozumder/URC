import React, { useState } from "react";
import { X } from "lucide-react";
import CommonButton from "../Common/CommonButton";

const AddReviewerModal = ({
  show,
  onClose,
  potentialReviewers,
  onSendInvitation,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  if (!show) return null;

  // Filter reviewers based on search term
  const filteredReviewers = potentialReviewers.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(r.domain)
      ? r.domain.some((d) =>
          d.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : r.domain.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSend = () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one reviewer to invite.");
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
          <h3 className="text-xl font-semibold">Add Reviewer</h3>
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
            filteredReviewers.map((r) => (
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
                <div>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-gray-500 text-sm">{r.email}</div>
                  <div className="text-sm">{r.department}</div>

                  {/* Multiple domain tags - small */}
                  <div className="flex flex-wrap gap-0.5 mt-1">
                    {(Array.isArray(r.domain) ? r.domain : [r.domain]).map(
                      (domainItem, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-black text-white px-1 py-0.5 rounded-sm text-[10px] cursor-pointer"
                          title={domainItem}
                        >
                          {domainItem}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </label>
            ))
          ) : (
            <div>No reviewers found.</div>
          )}
        </div>

        {/* Send Invitation button */}
        <div className="absolute bottom-6 left-6 right-6">
          <CommonButton
            label="Send Invitation"
            onClick={handleSend}
            className="w-full flex items-center justify-center"
          />
        </div>
      </div>
    </div>
  );
};

export default AddReviewerModal;
