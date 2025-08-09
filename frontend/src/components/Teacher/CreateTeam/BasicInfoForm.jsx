import React from 'react';

const BasicInfoForm = ({
  name, onNameChange,
  desc, onDescChange,
  category, onCategoryChange,
  status, onStatusChange,
}) => {
  return (
    <section className="bg-white rounded-lg shadow p-5 space-y-4">
      <h3 className="font-semibold">Basic Information</h3>

      <div>
        <label className="text-sm font-medium">Team Name *</label>
        <input
          className="mt-1 w-full border rounded px-3 py-2"
          placeholder="e.g., AI Research 2025"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Team Description / Objective *</label>
        <textarea
          className="mt-1 w-full border rounded px-3 py-2 min-h-[96px]"
          placeholder="Briefly describe the research goal, focus area, or objectives"
          value={desc}
          onChange={(e) => onDescChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Research Category / Field</label>
          <select
            className="mt-1 w-full border rounded px-3 py-2"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">Select a category</option>
            <option>AI & ML</option>
            <option>Data Privacy</option>
            <option>Biotech</option>
            <option>Quantum Computing</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Team Status</label>
          <select
            className="mt-1 w-full border rounded px-3 py-2"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option>Active</option>
            <option>Recruiting</option>
            <option>Paused</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default BasicInfoForm;
