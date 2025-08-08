import React from 'react';

const FilterBar = ({ filters, onFilterChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 w-full mb-6">
      {filters.map((filter, index) => {
        const commonProps = {
  className: 'border px-3 py-2 rounded-md text-sm w-full',
  onChange: (e) => onFilterChange(filter.name, e.target.value),
  value: filter.value || '',
};


        if (filter.type === 'input') {
          return (
            <input
              key={index}
              type={filter.inputType || 'text'}
              placeholder={filter.placeholder}
              {...commonProps}
            />
          );
        }

        if (filter.type === 'select') {
          return (
            <select key={index} {...commonProps}>
              {filter.options.map((option, idx) => (
                <option key={idx}>{option}</option>
              ))}
            </select>
          );
        }

        return null;
      })}
    </div>
  );
};

export default FilterBar;