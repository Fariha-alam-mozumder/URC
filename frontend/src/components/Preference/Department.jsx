import { useMemo } from "react";

function Department({ departments = [], selectedDepartment, onDepartmentChange }) {
  const selectedDeptName = useMemo(() => {
    if (!selectedDepartment || !departments.length) return null;
    const dept = departments.find(d => d.department_id === selectedDepartment);
    return dept ? dept.department_name : null;
  }, [selectedDepartment, departments]);

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Department Selection</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Select Department <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedDepartment || ""}
            onChange={(e) => onDepartmentChange(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full border px-3 py-2 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a department</option>
            {departments.map(dept => (
              <option key={dept.department_id} value={dept.department_id}>
                {dept.department_name}
              </option>
            ))}
          </select>
        </div>

        {selectedDeptName && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-600 font-medium">Selected Department:</p>
            <p className="text-blue-800">{selectedDeptName}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Department;