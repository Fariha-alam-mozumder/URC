import React from 'react';

const TeamSettings = ({
  visibility, onVisibilityChange,
  maxMembers, onMaxMembersChange,
  allowApps, onAllowAppsChange,
}) => {
  return (
    <section className="bg-white rounded-lg shadow p-5 space-y-4">
      <h3 className="font-semibold">Settings & Permissions</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Visibility</label>
          <div className="mt-2 flex gap-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={visibility === 'public'}
                onChange={() => onVisibilityChange('public')}
              />
              <span className="text-sm">Public (students can request to join)</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={visibility === 'private'}
                onChange={() => onVisibilityChange('private')}
              />
              <span className="text-sm">Private (teacher adds members only)</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Max Number of Members</label>
            <input
              type="number"
              min={1}
              className="mt-1 w-full border rounded px-3 py-2"
              value={maxMembers}
              onChange={(e) => onMaxMembersChange(Number(e.target.value))}
            />
          </div>

          <div className="flex items-end">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={allowApps}
                onChange={(e) => onAllowAppsChange(e.target.checked)}
              />
              <span className="text-sm">Allow student applications</span>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSettings;
