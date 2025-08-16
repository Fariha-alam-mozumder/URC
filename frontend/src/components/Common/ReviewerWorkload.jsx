import React from "react";

const ProgressBar = ({ value }) => {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full">
      <div
        className="h-2 rounded-full bg-black"
        style={{ width: `${pct}%` }}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      />
    </div>
  );
};

const ReviewerRow = ({ name, assigned, completed, avgTimeDays, pending }) => {
  const percent = assigned ? (completed / assigned) * 100 : 0;

  return (
    <div className="py-3 border-b last:border-b-0">
      <div className="flex items-center justify-between">
        <p className="font-semibold">{name}</p>
        {typeof pending === "number" && pending > 0 ? (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
            {pending} pending
          </span>
        ) : (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
            0 pending
          </span>
        )}
      </div>

      <div className="mt-2 text-xs text-gray-600 grid grid-cols-2 gap-2">
        <span>Assigned: {assigned}</span>
        <span className="text-right">Completed: {completed}</span>
        <span className="col-span-2">Avg Time: {avgTimeDays} days</span>
      </div>

      <div className="mt-2">
        <ProgressBar value={percent} />
      </div>
    </div>
  );
};

const ReviewerWorkload = ({ reviewers = [] }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md h-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg font-semibold">Reviewer Workload</span>
      </div>

      <div className="divide-y">
        {reviewers.map((r, i) => (
          <ReviewerRow
            key={i}
            name={r.name}
            assigned={r.assigned}
            completed={r.completed}
            avgTimeDays={r.avgTimeDays}
            pending={r.pending}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewerWorkload;
