// components/Common/MemberList.jsx
import React, { useState } from 'react';
import { FaUserPlus, FaUserCircle } from 'react-icons/fa';

/**
 * Props:
 * - canManage?: boolean (default true) => controls visibility of "Add Member" button & modal
 * - onAddMany?: (names: string[]) => void  // picker mode if provided
 * - existing?: string[]
 * - triggerText?: string
 * - title?: string
 */
const defaultMembers = [
  { name: 'Alice Johnson', role: 'Researcher' },
  { name: 'Bob Smith', role: 'Analyst' },
];

const allStudents = ['Eve Martinez','John Doe','Linda Zhao','David Kim','Maria Garcia'];

const MemberList = ({
  canManage = true,
  onAddMany,
  existing = [],
  triggerText = 'Add Member',
  title = 'Team Members',
}) => {
  const pickerMode = typeof onAddMany === 'function';

  // local-only list for standalone mode (non-picker)
  const [members, setMembers] = useState(defaultMembers);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState([]);

  const toggleSelect = (name) =>
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));

  const handleAddMembers = () => {
    if (pickerMode) {
      onAddMany(selected);
    } else {
      const newMembers = selected.map((name) => ({ name, role: 'New Member' }));
      setMembers((prev) => [...prev, ...newMembers]);
    }
    setSelected([]);
    setShowModal(false);
  };

  const headerCount = pickerMode ? '' : ` (${members.length})`;

  return (
    <div className="bg-white p-4 rounded shadow h-fit">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {title}{headerCount}
        </h3>

        {/* Only show action when allowed */}
        {canManage && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
          >
            <FaUserPlus /> {triggerText}
          </button>
        )}
      </div>

      {/* Current members list only in standalone mode */}
      {!pickerMode && (
        <ul className="space-y-3">
          {members.map((member, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <FaUserCircle className="text-xl text-gray-500" />
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal is also gated by canManage */}
      {canManage && showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h4 className="text-lg font-bold mb-4">Select Members</h4>
            <div className="space-y-2 max-h-72 overflow-y-auto mb-4">
              {allStudents.map((student, index) => {
                const disabled = existing.includes(student);
                const checked = selected.includes(student) || disabled;
                return (
                  <label
                    key={index}
                    className={`flex items-center gap-2 cursor-pointer ${disabled ? 'opacity-60' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggleSelect(student)}
                    />
                    {student} {disabled && <span className="text-xs text-gray-400">(already added)</span>}
                  </label>
                );
              })}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
                Cancel
              </button>
              <button onClick={handleAddMembers} className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
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
