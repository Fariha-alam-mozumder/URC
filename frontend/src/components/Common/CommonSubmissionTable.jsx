import React from "react";
import { FaSort } from "react-icons/fa";

export const Badge = ({ children }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
    {children}
  </span>
);

export const StatusPill = ({ status, classes = {} }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
      classes[status] || "bg-gray-200 text-gray-700"
    }`}
  >
    {status}
  </span>
);

const HeaderCell = ({ label, onSort, sortKey, currentSort }) => (
  <button
    onClick={() => onSort && onSort(sortKey)}
    className="flex items-center gap-1 font-semibold text-sm text-gray-700 whitespace-nowrap"
  >
    {label} {onSort && <FaSort className="opacity-60" />}
  </button>
);

const CommonSubmissionTable = ({ title, data, columns, sort, onSort, actions }) => {
  return (
    <div className="bg-white rounded-xl shadow border overflow-x-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="font-semibold">
          {title} ({data.length})
        </div>
      </div>

      <table className="min-w-[1100px] w-full border-collapse">
        <thead>
          <tr className="text-xs text-gray-500 border-b">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-4 py-2 text-left font-semibold whitespace-nowrap"
              >
                <HeaderCell
                  label={col.label}
                  sortKey={col.key}
                  currentSort={sort}
                  onSort={col.sortable ? onSort : null}
                />
              </th>
            ))}
            {actions && (
              <th className="px-4 py-2 text-right whitespace-nowrap">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="hover:bg-gray-50"
            >
              {columns.map((col, idx) => (
                <td
                  key={idx}
                  className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap"
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-2 text-right whitespace-nowrap">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommonSubmissionTable;