// src/components/Common/FilterBar.jsx
import React from 'react';

const FilterBar = ({ filters, onFilterChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-4 w-full mb-6">
      {filters.map((filter, index) => {
        const handleChange = (e) => onFilterChange(filter.name, e.target.value);
        const value = filter.value ?? '';

        if (filter.type === 'input') {
          return (
            <input
              key={filter.name || index}
              type={filter.inputType || 'text'}
              placeholder={filter.placeholder}
              className="border px-3 py-2 rounded-md text-sm w-full"
              onChange={handleChange}
              value={value}
            />
          );
        }

        if (filter.type === 'select') {
          return (
            <select
              key={filter.name || index}
              className="border px-3 py-2 rounded-md text-sm w-full"
              onChange={handleChange}
              value={value}
            >
              {(filter.options || []).map((option, idx) => {
                const opt = typeof option === 'string' ? { label: option, value: option } : option;
                return (
                  <option key={opt.value ?? idx} value={opt.value}>
                    {opt.label ?? String(opt.value)}
                  </option>
                );
              })}
            </select>
          );
        }

        return null;
      })}
    </div>
  );
};

export default FilterBar;