// components/Teacher/TeamManagement/MemberList.jsx
import React, { useEffect, useState } from "react";
import { FaUserPlus, FaUserCircle, FaEnvelope, FaTags } from "react-icons/fa";
import axios from "axios";

const MemberList = ({
  onAddMany,
  existing = [],
  triggerText = "Add Member",
  title = "Team Members",
  departmentId,
  creatorUserId,
  domainIds = [],
}) => {
  const pickerMode = typeof onAddMany === "function";
  const [members, setMembers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!departmentId && !creatorUserId) return;
    const token = localStorage.getItem("token");

    const params = { creatorUserId, departmentId };
    if (Array.isArray(domainIds) && domainIds.length) {
      params.domainIds = domainIds.join(",");
    }

    axios
      .get("http://localhost:8000/api/members", {
        params,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => setAllMembers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error("Error fetching students/teachers:", err.response?.data || err.message);
        setAllMembers([]);
      });
  }, [departmentId, creatorUserId, JSON.stringify(domainIds)]);

  const toggleSelect = (userId) =>
    setSelected((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));

  const handleAddMembers = () => {
    const selectedMembers = allMembers.filter((m) => selected.includes(m.user_id));
    if (pickerMode) onAddMany(selectedMembers);
    else setMembers((prev) => [...prev, ...selectedMembers]);
    setSelected([]);
    setShowModal(false);
  };

  const headerCount = pickerMode ? "" : ` (${members.length})`;

  // Component to display domain tags
  const DomainTags = ({ domains, matchingDomains, isCompact = false }) => {
    if (!domains || domains.length === 0) return null;
    
    return (
      <div className={`flex flex-wrap gap-1 ${isCompact ? 'mt-1' : 'mt-2'}`}>
        {domains.map((domain, index) => {
          const isMatching = matchingDomains && matchingDomains.includes(domain);
          return (
            <span
              key={index}
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isMatching
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
              title={isMatching ? 'Matching domain with creator' : 'User domain'}
            >
              {domain}
            </span>
          );
        })}
      </div>
    );
  };

  // If in picker mode, just render the button
  if (pickerMode) {
    return (
      <>
        <button 
          onClick={() => setShowModal(true)} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {triggerText}
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-md w-[600px] max-w-[90vw]">
              <h4 className="text-lg font-bold mb-4">Select Members</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                {allMembers.length > 0 ? (
                  allMembers.map((member) => {
                    const disabled = existing.includes(member.user_id);
                    const checked = selected.includes(member.user_id) || disabled;
                    return (
                      <label
                        key={member.user_id}
                        className={`flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 ${
                          disabled ? "opacity-60" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={disabled}
                          onChange={() => toggleSelect(member.user_id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{member.name}</span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {member.role}
                            </span>
                            {disabled && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                already added
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                            <FaEnvelope className="text-xs" />
                            <span>{member.email}</span>
                          </div>

                          <DomainTags 
                            domains={member.domains} 
                            matchingDomains={member.matchingDomains}
                            isCompact={true}
                          />

                          {member.matchingDomains && member.matchingDomains.length > 0 && (
                            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                              <FaTags className="text-xs" />
                              <span>
                                {member.matchingDomains.length} matching domain{member.matchingDomains.length > 1 ? 's' : ''} with creator
                              </span>
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">No members found.</p>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMembers}
                  disabled={selected.length === 0}
                  className={`px-4 py-2 text-sm rounded text-white ${
                    selected.length 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "bg-blue-300 cursor-not-allowed"
                  }`}
                >
                  Add Selected ({selected.length})
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Original component for non-picker mode
  return (
    <div className="bg-white p-4 rounded shadow h-fit">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}{headerCount}</h3>
        <button 
          onClick={() => setShowModal(true)} 
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <FaUserPlus /> {triggerText}
        </button>
      </div>

      <ul className="space-y-4">
        {members.map((member) => (
          <li key={member.user_id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
            <FaUserCircle className="text-2xl text-gray-500 mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-lg">{member.name}</p>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {member.role}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                <FaEnvelope className="text-xs" />
                <span>{member.email}</span>
              </div>
              <DomainTags 
                domains={member.domains} 
                matchingDomains={member.matchingDomains}
              />
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-[600px] max-w-[90vw]">
            <h4 className="text-lg font-bold mb-4">Select Members</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
              {allMembers.length > 0 ? (
                allMembers.map((member) => {
                  const disabled = existing.includes(member.user_id);
                  const checked = selected.includes(member.user_id) || disabled;
                  return (
                    <label
                      key={member.user_id}
                      className={`flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 ${
                        disabled ? "opacity-60" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggleSelect(member.user_id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{member.name}</span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {member.role}
                          </span>
                          {disabled && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              already added
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <FaEnvelope className="text-xs" />
                          <span>{member.email}</span>
                        </div>

                        <DomainTags 
                          domains={member.domains} 
                          matchingDomains={member.matchingDomains}
                          isCompact={true}
                        />

                        {member.matchingDomains && member.matchingDomains.length > 0 && (
                          <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <FaTags className="text-xs" />
                            <span>
                              {member.matchingDomains.length} matching domain{member.matchingDomains.length > 1 ? 's' : ''} with creator
                            </span>
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">No members found.</p>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMembers}
                disabled={selected.length === 0}
                className={`px-4 py-2 text-sm rounded text-white ${
                  selected.length 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "bg-blue-300 cursor-not-allowed"
                }`}
              >
                Add Selected ({selected.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberList;