// components/Teacher/TeamManagement/MemberList.jsx
import React, { useEffect, useState } from "react";
import { FaUserPlus, FaUserCircle } from "react-icons/fa";
import axios from "axios";

const MemberList = ({
  onAddMany,
  existing = [],
  triggerText = "Add Member",
  title = "Team Members",
  departmentId,
  creatorUserId,
  domainIds = [],               // NEW
}) => {
  const pickerMode = typeof onAddMany === "function";
  const [members, setMembers] = useState([]);       // only in non-picker mode
  const [allMembers, setAllMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!departmentId && !creatorUserId) return;
    const token = localStorage.getItem("token");

    const params = { creatorUserId, departmentId };
    if (Array.isArray(domainIds) && domainIds.length) {
      params.domainIds = domainIds.join(","); // "1,2,3"
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

  return (
    <div className="bg-white p-4 rounded shadow h-fit">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}{headerCount}</h3>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
          <FaUserPlus /> {triggerText}
        </button>
      </div>

      {!pickerMode && (
        <ul className="space-y-3">
          {members.map((member) => (
            <li key={member.user_id} className="flex items-center gap-3">
              <FaUserCircle className="text-xl text-gray-500" />
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h4 className="text-lg font-bold mb-4">Select Members</h4>
            <div className="space-y-2 max-h-72 overflow-y-auto mb-4">
              {allMembers.length > 0 ? (
                allMembers.map((member) => {
                  const disabled = existing.includes(member.user_id);
                  const checked = selected.includes(member.user_id) || disabled;
                  return (
                    <label
                      key={member.user_id}
                      className={`flex items-center gap-2 cursor-pointer ${disabled ? "opacity-60" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggleSelect(member.user_id)}
                      />
                      <span className="font-medium">{member.name}</span>
                      <span className="text-xs text-gray-500">({member.role})</span>
                      {disabled && <span className="text-xs text-gray-400">(already added)</span>}
                    </label>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">No members found.</p>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
                Cancel
              </button>
              <button
                onClick={handleAddMembers}
                disabled={selected.length === 0}
                className={`px-4 py-1 text-sm rounded text-white ${selected.length ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}`}
              >
                Add Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberList;