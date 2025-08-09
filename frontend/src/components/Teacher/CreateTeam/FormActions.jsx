import React from 'react';

const FormActions = ({ onCancel, onCreate }) => {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onCancel}
        className="px-4 py-2 rounded border hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        onClick={onCreate}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        Create Team
      </button>
    </div>
  );
};

export default FormActions;
