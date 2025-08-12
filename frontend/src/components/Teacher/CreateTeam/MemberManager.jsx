// components/Teacher/CreateTeam/MemberManager.jsx
import React from "react";
import MemberList from "../TeamManagement/MemberList";

// Display label -> enum value used by backend
const TEAM_ROLE_OPTIONS = [
  { label: "Lead Researcher", value: "LEAD" },
  { label: "Researcher", value: "RESEARCHER" },
  { label: "Assistant", value: "ASSISTANT" },
];

export default function MemberManager({
  members,
  onChange,
  creatorUserId,
  departmentId,
  domainIds,
}) {
  // Add picked users as team members with default role_in_team = MEMBER
  const handleAddMany = (newOnes) => {
    const existingIds = new Set(members.map((m) => Number(m.user_id)));
    const normalized = newOnes
      .filter((m) => !existingIds.has(Number(m.user_id)))
      .map((m) => ({
        user_id: Number(m.user_id),
        name: m.name,
        email: m.email,
        role_in_team: "RESEARCHER",
      }));
    onChange([...members, ...normalized]);
  };

  const removeMember = (userId) =>
    onChange(members.filter((m) => Number(m.user_id) !== Number(userId)));

  const setMemberRole = (userId, newRoleValue) => {
    const upper = String(newRoleValue).toUpperCase();
    let next = members.map((m) =>
      Number(m.user_id) === Number(userId) ? { ...m, role_in_team: upper } : m
    );

    if (upper === "LEAD") {
      next = next.map((m) =>
        Number(m.user_id) !== Number(userId) && m.role_in_team === "LEAD"
          ? { ...m, role_in_team: "RESEARCHER" }
          : m
      );
    }
    onChange(next);
  };

  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Members</h3>
        <MemberList
          title="Add Members"
          triggerText="Add Members"
          onAddMany={handleAddMany}
          existing={members.map((m) => m.user_id)}
          creatorUserId={creatorUserId}
          departmentId={departmentId}
          domainIds={domainIds}
        />
      </div>

      {members.length === 0 ? (
        <p className="text-sm text-gray-500">No members selected yet.</p>
      ) : (
        <ul className="divide-y">
          {members.map((m) => (
            <li
              key={m.user_id}
              className="py-2 flex items-center justify-between gap-3"
            >
              <div>
                <p className="font-medium">{m.name}</p>
                <p className="text-sm text-gray-500">{m.email}</p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={m.role_in_team || "RESEARCHER"}
                  onChange={(e) => setMemberRole(m.user_id, e.target.value)}
                >
                  {TEAM_ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => removeMember(m.user_id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}