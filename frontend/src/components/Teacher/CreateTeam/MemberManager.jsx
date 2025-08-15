// components/Teacher/CreateTeam/MemberManager.jsx
import React from "react";
<<<<<<< HEAD
import { FaEnvelope, FaTags } from "react-icons/fa";
=======
>>>>>>> origin/trisha-feature-BE-fix
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
<<<<<<< HEAD
  // Add picked users as team members with default role_in_team = RESEARCHER
=======
  // Add picked users as team members with default role_in_team = MEMBER
>>>>>>> origin/trisha-feature-BE-fix
  const handleAddMany = (newOnes) => {
    const existingIds = new Set(members.map((m) => Number(m.user_id)));
    const normalized = newOnes
      .filter((m) => !existingIds.has(Number(m.user_id)))
      .map((m) => ({
        user_id: Number(m.user_id),
        name: m.name,
        email: m.email,
        role_in_team: "RESEARCHER",
<<<<<<< HEAD
        domains: m.domains || [],
        matchingDomains: m.matchingDomains || [],
=======
>>>>>>> origin/trisha-feature-BE-fix
      }));
    onChange([...members, ...normalized]);
  };

  const removeMember = (userId) =>
    onChange(members.filter((m) => Number(m.user_id) !== Number(userId)));
<<<<<<< HEAD

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

  // Component to display domain tags
  const DomainTags = ({ domains, matchingDomains }) => {
    if (!domains || domains.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
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

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Members</h3>
        <div className="inline-block">
          <MemberList
            triggerText="+ Add Members"
            onAddMany={handleAddMany}
            existing={members.map((m) => m.user_id)}
            creatorUserId={creatorUserId}
            departmentId={departmentId}
            domainIds={domainIds}
          />
        </div>
=======

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
>>>>>>> origin/trisha-feature-BE-fix
      </div>

      {members.length === 0 ? (
        <p className="text-sm text-gray-500">No members selected yet.</p>
      ) : (
<<<<<<< HEAD
        <ul className="divide-y space-y-4">
          {members.map((m) => (
            <li
              key={m.user_id}
              className="py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-lg">{m.name}</p>
                    {m.matchingDomains && m.matchingDomains.length > 0 && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                        <FaTags className="text-xs" />
                        {m.matchingDomains.length} matching
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <FaEnvelope className="text-xs" />
                    <span>{m.email}</span>
                  </div>

                  <DomainTags 
                    domains={m.domains} 
                    matchingDomains={m.matchingDomains}
                  />
                </div>

                <div className="flex items-start gap-3">
                  <select
                    className="border rounded px-3 py-2 text-sm min-w-[140px]"
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
                    className="text-sm text-red-600 hover:text-red-800 px-2 py-2 hover:bg-red-50 rounded"
                  >
                    Remove
                  </button>
                </div>
=======
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
>>>>>>> origin/trisha-feature-BE-fix
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}