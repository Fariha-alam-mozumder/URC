// components/teacher/CreateTeam/MemberManager.jsx
import React, { useState } from 'react';
// import MemberList from '../../teacher/TeamManagement/MemberList';
import MemberList from '../TeamManagement/MemberList';

const ROLE_OPTIONS = ['Lead Researcher', 'Researcher', 'Assistant'];

const MemberManager = ({ members, onChange }) => {
  const [editingRoleForId, setEditingRoleForId] = useState(null);

  // MemberList will give names; convert to team members
  const handleAddMany = (names) => {
    if (!names?.length) return;
    const existing = new Set(members.map((m) => m.name));
    const newOnes = names
      .filter((n) => !existing.has(n))
      .map((n) => ({
        id: n.toLowerCase().replace(/\s+/g, '-'),
        name: n,
        role: null,
      }));
    onChange([...members, ...newOnes]);
  };

  const setRole = (id, role) => {
    onChange(members.map((m) => (m.id === id ? { ...m, role } : m)));
    setEditingRoleForId(null);
  };

  const removeMember = (id) => onChange(members.filter((m) => m.id !== id));

  return (
    <section className="bg-white rounded-lg shadow p-5 space-y-5">
      <h3 className="font-semibold">Member Management</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* LEFT: your MemberList as a PICKER */}
        <MemberList
          onAddMany={handleAddMany}
          existing={members.map((m) => m.name)}
          title="Add Members"
          triggerText="Add Member"
        />

        {/* RIGHT: selected members + role control */}
        <div className="border rounded-lg">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <p className="text-sm font-medium">Selected Members ({members.length})</p>
            {members.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-sm px-3 py-1.5 border rounded hover:bg-gray-50"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="divide-y">
            {members.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">No members added yet.</div>
            ) : (
              members.map((m) => (
                <div key={m.id} className="p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                      {m.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{m.name}</p>
                      <p className="text-xs text-gray-500 truncate">{m.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Role UI */}
                    {m.role ? (
                      <>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{m.role}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingRoleForId(editingRoleForId === m.id ? null : m.id)
                          }
                          className="text-sm px-2 py-1 border rounded hover:bg-gray-50"
                        >
                          Change
                        </button>
                        {editingRoleForId === m.id && (
                          <select
                            autoFocus
                            value={m.role}
                            onChange={(e) => setRole(m.id, e.target.value)}
                            onBlur={() => setEditingRoleForId(null)}
                            className="border rounded px-2 py-1 text-sm"
                          >
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        )}
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setEditingRoleForId(m.id)}
                          className="text-sm px-2 py-1 border rounded hover:bg-gray-50"
                        >
                          Add role
                        </button>
                        {editingRoleForId === m.id && (
                          <select
                            autoFocus
                            defaultValue=""
                            onChange={(e) => e.target.value && setRole(m.id, e.target.value)}
                            onBlur={() => setEditingRoleForId(null)}
                            className="border rounded px-2 py-1 text-sm"
                          >
                            <option value="" disabled>Select role…</option>
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        )}
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => removeMember(m.id)}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberManager;
