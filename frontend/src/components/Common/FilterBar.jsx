// components/Common/FilterBar.jsx
import React from 'react';

const FilterBar = ({ onSearchChange, onFilterChange }) => {
  return (
    <div className="flex flex-wrap sm:flex-nowrap gap-4 items-center mb-6">
      <input
        type="text"
        placeholder="Search by title or team"
        className="border px-3 py-2 rounded min-w-[180px] flex-1"
        onChange={onSearchChange}
      />

      <input
        type="date"
        className="border px-3 py-2 rounded min-w-[180px] flex-1"
      />

      <select
        className="border px-3 py-2 rounded min-w-[180px] flex-1"
        onChange={(e) => onFilterChange('status', e.target.value)}
      >
        <option>All Status</option>
        <option>Approved</option>
        <option>Needs Revision</option>
        <option>Rejected</option>
      </select>

      <select
        className="border px-3 py-2 rounded min-w-[180px] flex-1"
        onChange={(e) => onFilterChange('area', e.target.value)}
      >
        <option>All Areas</option>
        <option>AI</option>
        <option>Healthcare</option>
        <option>IoT</option>
      </select>

      <select
        className="border px-3 py-2 rounded min-w-[180px] flex-1"
        onChange={(e) => onFilterChange('sort', e.target.value)}
      >
        <option>Latest First</option>
        <option>Oldest First</option>
      </select>
    </div>
  );
};

export default FilterBar;
