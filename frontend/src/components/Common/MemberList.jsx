// components/Common/MemberList.jsx  (use this single file)
import React, { useEffect, useState } from "react";
import { FaUserPlus, FaUserCircle, FaEnvelope, FaTags, FaIdBadge } from "react-icons/fa";
import axios from "axios";
import { resolveApiUrl } from "../../config/api";

/** TeamRole: LEAD | RESEARCHER | ASSISTANT */
const roleToBadgeClasses = (role) => {
  const r = (role || "").toUpperCase();
  if (r === "LEAD") return "bg-red-100 text-red-700";
  if (r === "RESEARCHER") return "bg-blue-100 text-blue-700";
  if (r === "ASSISTANT") return "bg-purple-100 text-purple-700";
  return "bg-gray-100 text-gray-700";
};

/** Platform Role: ADMIN | TEACHER | REVIEWER | STUDENT | GENERALUSER */
const platformRoleToBadgeClasses = (role) => {
  const r = (role || "").toUpperCase();
  if (r === "ADMIN") return "bg-orange-100 text-orange-700";
  if (r === "TEACHER") return "bg-emerald-100 text-emerald-700";
  if (r === "REVIEWER") return "bg-indigo-100 text-indigo-700";
  if (r === "STUDENT") return "bg-slate-100 text-slate-700";
  if (r === "GENERALUSER") return "bg-gray-100 text-gray-700";
  return "bg-gray-100 text-gray-700";
};

const DomainTags = ({ domains, matchingDomains, isCompact = false }) => {
  if (!domains?.length) return null;
  return (
    <div className={`flex flex-wrap gap-1 ${isCompact ? "mt-1" : "mt-2"}`}>
      {domains.map((domain, idx) => {
        const isMatching = matchingDomains?.includes(domain);
        return (
          <span
            key={`${domain}-${idx}`}
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isMatching
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-gray-100 text-gray-600 border border-gray-200"
            }`}
            title={isMatching ? "Matching domain with creator" : "User domain"}
          >
            {domain}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Props:
 * - members: [{ user_id, name, email, role_in_team, user_role?, roll_number?, domains?, matchingDomains? }]
 * - teamId: number
 * - canManage: boolean  // pass true for teachers, false for students
 * - onMemberAdded?: () => void
 * - title?: string
 */
const MemberList = ({ members = [], teamId, canManage = false, onMemberAdded, title = "Team Members" }) => {
  const [allPotentialMembers, setAllPotentialMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState([]);      // user_id[]
  const [memberRoles, setMemberRoles] = useState({}); // { [user_id]: "RESEARCHER" | "ASSISTANT" | "LEAD" }
  const [loading, setLoading] = useState(false);

  // Fetch potential members only if teacher can manage
  useEffect(() => {
    if (canManage && showModal && teamId) fetchPotentialMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManage, showModal, teamId]);

  const fetchPotentialMembers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Get creator context to query candidates
      const ctx = await axios.get(resolveApiUrl("/me/context"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { department_id, domains } = ctx.data || {};
      const domainIds = Array.isArray(domains) ? domains.map((d) => d.domain_id) : [];

      const res = await axios.get(resolveApiUrl("/members"), {
        params: { departmentId: department_id, domainIds: domainIds.join(",") },
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllPotentialMembers(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Error fetching potential members:", e);
      setAllPotentialMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (userId) => {
    setSelected((prev) => {
      const exists = prev.includes(userId);
      const next = exists ? prev.filter((id) => id !== userId) : [...prev, userId];
      if (!exists) {
        setMemberRoles((r) => ({ ...r, [userId]: "RESEARCHER" }));
      }
      return next;
    });
  };

  const updateMemberRole = (userId, role) => {
    setMemberRoles((prev) => ({ ...prev, [userId]: role }));
  };

  const handleAddMembers = async () => {
    if (!selected.length) return;
    try {
      const token = localStorage.getItem("token");
      const payload = selected.map((userId) => ({
        user_id: userId,
        role_in_team: (memberRoles[userId] || "RESEARCHER").toUpperCase(),
      }));

      await axios.post(
        resolveApiUrl(`/teacher/teams/${teamId}/add-members`),
        { members: payload },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelected([]);
      setMemberRoles({});
      setShowModal(false);
      onMemberAdded && onMemberAdded();
    } catch (e) {
      console.error("Error adding members:", e);
      alert("Failed to add members. Please try again.");
    }
  };

  const existingMemberIds = members.map((m) => m.user_id);

  return (
    <div className="bg-white p-4 rounded shadow h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title} ({members.length})</h3>
        {canManage && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
          >
            <FaUserPlus /> Add Member
          </button>
        )}
      </div>

      {/* Member list */}
      <div className="flex-1 overflow-y-auto">
        {members.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No team members yet.
          </div>
        ) : (
          <ul className="space-y-4">
            {members.map((m) => {
              const teamRole = (m.role_in_team || "RESEARCHER").toUpperCase();
              const userRole = (m.user_role || "").toUpperCase();
              return (
                <li key={m.user_id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                  <FaUserCircle className="text-2xl text-gray-500 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-lg">{m.name}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${roleToBadgeClasses(teamRole)}`}
                        title={`Team Role: ${teamRole}`}
                      >
                        {teamRole}
                      </span>
                      {userRole && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${platformRoleToBadgeClasses(userRole)}`}
                          title={`User Role: ${userRole}`}
                        >
                          {userRole}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <FaEnvelope className="text-xs flex-shrink-0" />
                      <span className="truncate">{m.email}</span>
                    </div>

                    {m.roll_number && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <FaIdBadge className="text-xs flex-shrink-0" />
                        <span>Roll: {m.roll_number}</span>
                      </div>
                    )}

                    <DomainTags domains={m.domains || []} matchingDomains={m.matchingDomains || []} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Add Members Modal (teacher only) */}
      {canManage && showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-[700px] max-w-[90vw] max-h-[80vh] flex flex-col">
            <h4 className="text-lg font-bold mb-4">Add Team Members</h4>

            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <p>Loading potential members...</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto mb-4">
                  <div className="space-y-3">
                    {allPotentialMembers.length ? (
                      allPotentialMembers.map((cand) => {
                        const disabled = existingMemberIds.includes(cand.user_id);
                        const isSelected = selected.includes(cand.user_id);
                        return (
                          <div
                            key={cand.user_id}
                            className={`p-3 border border-gray-200 rounded-lg ${disabled ? "opacity-60" : "hover:bg-gray-50"}`}
                          >
                            <label className="flex items-start gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isSelected || disabled}
                                disabled={disabled}
                                onChange={() => toggleSelect(cand.user_id)}
                                className="mt-1 flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium">{cand.name}</span>
                                  {cand.role && (
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                      {cand.role}
                                    </span>
                                  )}
                                  {disabled && (
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                      already added
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                  <FaEnvelope className="text-xs flex-shrink-0" />
                                  <span className="truncate">{cand.email}</span>
                                </div>

                                {cand.roll_number && (
                                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                    <FaIdBadge className="text-xs flex-shrink-0" />
                                    <span>Roll: {cand.roll_number}</span>
                                  </div>
                                )}

                                <DomainTags domains={cand.domains || []} matchingDomains={cand.matchingDomains || []} isCompact />

                                {Array.isArray(cand.matchingDomains) && cand.matchingDomains.length > 0 && (
                                  <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                    <FaTags className="text-xs flex-shrink-0" />
                                    <span>
                                      {cand.matchingDomains.length} matching domain
                                      {cand.matchingDomains.length > 1 ? "s" : ""} with creator
                                    </span>
                                  </div>
                                )}

                                {isSelected && !disabled && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <label className="text-sm font-medium">Team Role:</label>
                                    <select
                                      value={memberRoles[cand.user_id] || "RESEARCHER"}
                                      onChange={(e) => updateMemberRole(cand.user_id, e.target.value)}
                                      className="text-xs px-2 py-1 border rounded"
                                    >
                                      <option value="RESEARCHER">Researcher</option>
                                      <option value="ASSISTANT">Assistant</option>
                                      <option value="LEAD">Lead</option>
                                    </select>
                                  </div>
                                )}
                              </div>
                            </label>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-8">No potential members found.</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    onClick={() => { setShowModal(false); setSelected([]); setMemberRoles({}); }}
                    className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMembers}
                    disabled={!selected.length}
                    className={`px-4 py-2 text-sm rounded text-white ${selected.length ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}`}
                  >
                    Add Selected ({selected.length})
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberList;
