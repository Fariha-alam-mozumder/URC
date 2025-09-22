import React from 'react';

const PersonalInfo = ({ 
  name, 
  email, 
  role, 
  department, 
  designation, 
  rollNumber, 
  domains = [],
  isVerified,
  isMainAdmin 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Personal Information</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
          <p className="text-gray-800 bg-gray-50 p-2 rounded">{name}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-800 bg-gray-50 p-2 rounded flex-1">{email}</p>
            {isVerified && (
              <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded">Verified</span>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-800 bg-gray-50 p-2 rounded flex-1">{role}</p>
            {isMainAdmin && (
              <span className="text-blue-600 text-xs bg-blue-100 px-2 py-1 rounded">Main Admin</span>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
          <p className="text-gray-800 bg-gray-50 p-2 rounded">{department}</p>
        </div>
        
        {designation && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Designation</label>
            <p className="text-gray-800 bg-gray-50 p-2 rounded">{designation}</p>
          </div>
        )}
        
        {rollNumber && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Roll Number</label>
            <p className="text-gray-800 bg-gray-50 p-2 rounded">{rollNumber}</p>
          </div>
        )}
      </div>
      
      {domains.length > 0 && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">Domains of Interest</label>
          <div className="flex flex-wrap gap-2">
            {domains.map((domain, index) => (
              <span 
                key={domain.domain_id || index} 
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {domain.domain_name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;