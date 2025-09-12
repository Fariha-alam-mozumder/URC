import { useMemo, useState, useEffect } from "react";

const equalIds = (a = [], b = []) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

function ResearchFields({
  availableDomains = [],                 // [{domain_id, domain_name}]
  selectedDomainIds = [],               // [id]
  allDomains = [],                      // [{domain_id, domain_name}]
  onChange,
}) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState(selectedDomainIds);

  // Sync from parent only when actually different
  useEffect(() => {
    if (!equalIds(selectedIds, selectedDomainIds)) {
      setSelectedIds(selectedDomainIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDomainIds]);

  // Notify parent only on real change
  useEffect(() => {
    if (!equalIds(selectedIds, selectedDomainIds)) {
      onChange?.(selectedIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds]);

  const nameById = useMemo(() => {
    const m = new Map();
    allDomains.forEach(d => m.set(d.domain_id, d.domain_name));
    availableDomains.forEach(d => m.set(d.domain_id, d.domain_name));
    return m;
  }, [allDomains, availableDomains]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const filteredAvailable = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (availableDomains || []).filter(d =>
      (d.domain_name || "").toLowerCase().includes(q)
    );
  }, [availableDomains, search]);

  const unselectedList = useMemo(
    () => filteredAvailable.filter(d => !selectedSet.has(d.domain_id)),
    [filteredAvailable, selectedSet]
  );

  const selectedList = useMemo(
    () => selectedIds.map(id => ({
      domain_id: id,
      domain_name: nameById.get(id) ?? `Domain #${id}`,
    })),
    [selectedIds, nameById]
  );

  const add = (id) => {
    if (!selectedSet.has(id)) {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const remove = (id) => {
    if (selectedSet.has(id)) {
      setSelectedIds(prev => prev.filter(x => x !== id));
    }
  };

  const needed = Math.max(0, 3 - selectedIds.length);

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-end justify-between gap-4 mb-3">
        <p className="font-medium">
          Research Fields of Interest <span className="text-red-500">*</span>
          <span className="text-sm text-gray-600 ml-2">
            (minimum 3 required, {selectedIds.length} selected)
          </span>
        </p>
        <input
          type="text"
          placeholder="Search domains..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 border rounded-md p-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-2">Available Domains</h4>
          <div className="border rounded-md max-h-72 overflow-auto divide-y">
            {unselectedList.length === 0 ? (
              <div className="p-3 text-gray-500 text-sm">
                No domains found{search ? ` for "${search}"` : ""}.
              </div>
            ) : (
              unselectedList.map(d => (
                <div key={d.domain_id} className="flex items-center justify-between p-2">
                  <span className="text-sm">{d.domain_name}</span>
                  <button
                    type="button"
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => add(d.domain_id)}
                  >
                    Add
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Selected Domains</h4>
          <div className="border rounded-md max-h-72 overflow-auto divide-y">
            {selectedList.length === 0 ? (
              <div className="p-3 text-gray-500 text-sm">No domains selected</div>
            ) : (
              selectedList.map(d => (
                <div key={d.domain_id} className="flex items-center justify-between p-2">
                  <span className="text-sm">{d.domain_name}</span>
                  <button
                    type="button"
                    className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => remove(d.domain_id)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {selectedList.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedList.map(d => (
                <span key={d.domain_id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                  {d.domain_name}
                </span>
              ))}
            </div>
          )}

          {needed > 0 && (
            <p className="text-red-500 text-sm mt-2">
              Please select at least {needed} more field{needed !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResearchFields;
