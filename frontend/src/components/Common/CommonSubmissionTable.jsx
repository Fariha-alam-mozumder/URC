import React from "react";
import { FaSort } from "react-icons/fa";

const HeaderCell = ({ label, onSort, sortKey, currentSort }) => (
  <button
    onClick={() => onSort && onSort(sortKey)}
    className="flex items-center gap-1 font-semibold text-sm text-gray-700 whitespace-nowrap"
  >
    {label} {onSort && <FaSort className="opacity-60" />}
  </button>
);

const CommonSubmissionTable = ({
  title,
  data,
  columns,
  sort,
  onSort,
  actions,
  scrollableBodyHeight = "600px",
}) => {
  return (
    <div className="bg-white rounded-xl shadow border min-w-full">
      {/* Table title */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="font-semibold">
          {title} ({data.length})
        </div>
      </div>

      {/* Scrollable container: horizontal + vertical */}
      <div
        className="overflow-auto min-w-0"
        style={{ maxHeight: scrollableBodyHeight }}
      >
        <table className="min-w-[900px] w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr className="text-xs text-gray-500 border-b">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-2 text-left font-semibold whitespace-nowrap ${
                    col.className || ""
                  }`}
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
                <th className="px-4 py-2 text-right whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {columns.map((col, idx) => (
                  <td
                    key={idx}
                    className={`px-4 py-2 text-sm text-gray-700 ${
                      col.className || ""
                    }`}
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
    </div>
  );
};

export default CommonSubmissionTable;
