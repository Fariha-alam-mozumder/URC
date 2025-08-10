import React from 'react';
import { FaSort, FaRegEye, FaRegCopy, FaDownload } from 'react-icons/fa';

const statusClasses = {
  Accepted: 'bg-green-900 text-white',
  'Under Review': 'bg-yellow-300 text-white',
  'Needs Revision': 'bg-gray-200 text-gray-700',
  Rejected: 'bg-red-600 text-white',
  Submitted: 'bg-blue-300 text-gray-700',
};

const Badge = ({ children }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
    {children}
  </span>
);

const StatusPill = ({ status }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${statusClasses[status] || 'bg-gray-200 text-gray-700'}`}>
    {status}
  </span>
);

const HeaderCell = ({ label, onSort, sortKey, current }) => (
  <button
    onClick={() => onSort(sortKey)}
    className="flex items-center gap-1 font-semibold text-sm text-gray-700"
    title={`Sort by ${label}`}
  >
    {label} <FaSort className="opacity-60" />
  </button>
);

const SubmissionTable = ({ items, sort, onSort }) => {
  return (
    <div className="bg-white rounded-xl shadow border">
      {/* Top row */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="font-semibold">Papers ({items.length})</div>
        <button className="flex items-center gap-2 text-sm border px-3 py-1.5 rounded-md hover:bg-gray-50">
          <FaDownload /> Export
        </button>
      </div>

      {/* Header */}
      <div className="grid grid-cols-12 px-4 py-2 text-xs text-gray-500 border-b">
        <div className="col-span-5">
          <HeaderCell label="Paper Title" sortKey="title" onSort={onSort} current={sort} />
        </div>
        <div className="col-span-2">
          <HeaderCell label="Field of Research" sortKey="field" onSort={onSort} current={sort} />
        </div>
        <div className="col-span-2">
          <HeaderCell label="Submitted Date" sortKey="submitted" onSort={onSort} current={sort} />
        </div>
        <div className="col-span-2">
          <HeaderCell label="Status" sortKey="status" onSort={onSort} current={sort} />
        </div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* Rows */}
      <ul className="divide-y">
        {items.map((p) => (
          <li key={p.id} className="grid grid-cols-12 items-center px-4 py-3 hover:bg-gray-50">
            {/* Title + meta */}
            <div className="col-span-5">
              <div className="text-sm font-medium text-gray-900">{p.title}</div>
              <div className="text-xs text-gray-500">{p.code} • {p.authors} authors</div>
            </div>

            {/* Field */}
            <div className="col-span-2">
              <Badge>{p.field}</Badge>
            </div>

            {/* Submitted */}
            <div className="col-span-2 text-sm text-gray-700">{p.submitted}</div>

            {/* Status */}
            <div className="col-span-2">
              <StatusPill status={p.status} />
            </div>

            {/* Actions */}
            <div className="col-span-1">
              <div className="flex items-center justify-end gap-2">
                <button className="p-2 rounded-md hover:bg-gray-100" title="View"><FaRegEye /></button>
                <button
                  className="p-2 rounded-md hover:bg-gray-100"
                  title="Copy Paper ID"
                  onClick={() => navigator.clipboard?.writeText(p.code)}
                >
                  <FaRegCopy />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubmissionTable;
