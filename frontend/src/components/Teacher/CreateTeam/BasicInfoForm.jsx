// components/Teacher/CreateTeam/BasicInfoForm.jsx
import React from "react";

export default function BasicInfoForm({
  name, onNameChange,
  desc, onDescChange,
  category, onCategoryChange,       // domain_id
  status, onStatusChange,
  domainOptions = [],               // [{domain_id, domain_name}]
}) {
  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Team Name</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g., AI Research Team"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          value={desc}
          onChange={(e) => onDescChange(e.target.value)}
          placeholder="Short description"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Research Domain</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={category || ""}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {domainOptions.length === 0 && <option value="">No domains available</option>}
            {domainOptions.map((d) => (
              <option key={d.domain_id} value={d.domain_id}>
                {d.domain_name || `Domain ${d.domain_id}`}
              </option>
            ))}
          </select>

        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option>Active</option>
            <option>Recruiting</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
}