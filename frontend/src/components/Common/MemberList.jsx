// components/Common/MemberList.jsx
import React, { useEffect, useState } from "react";
import { FaUserPlus, FaUserCircle, FaEnvelope, FaTags, FaIdBadge } from "react-icons/fa";
import axios from "axios";

const MemberList = ({
  members = [], // Current team members
  canManage = false,
  teamId,
  onMemberAdded,
  title = "Team Members",
}) => {
  const [allPotentialMembers, setAllPotentialMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState([]);
  const [memberRoles, setMemberRoles] = useState({}); // Track roles for selected members
  const [loading, setLoading] = useState(false);

  // Fetch potential members when modal opens
  useEffect(() => {
    if (showModal && teamId) {
      fetchPotentialMembers();
    }
  }, [showModal, teamId]);

  const fetchPotentialMembers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Get creator context first
      const contextRes = await axios.get("http://localhost:8000/api/me/context", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const { department_id, domains } = contextRes.data;
      const domainIds = domains.map(d => d.domain_id);
      
      // Fetch potential members
      const params = {
        departmentId: department_id,
        domainIds: domainIds.join(',')
      };
      
      const membersRes = await axios.get("http://localhost:8000/api/members", {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAllPotentialMembers(Array.isArray(membersRes.data) ? membersRes.data : []);
    } catch (err) {
      console.error("Error fetching potential members:", err);
      setAllPotentialMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (userId) => {
    setSelected(prev => {
      const newSelected = prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId];
      
      // Initialize role for newly selected member
      if (!prev.includes(userId)) {
        setMemberRoles(prevRoles => ({
          ...prevRoles,
          [userId]: 'RESEARCHER' // Default role
        }));
      }
      
      return newSelected;
    });
  };

  const updateMemberRole = (userId, role) => {
    setMemberRoles(prev => ({
      ...prev,
      [userId]: role
    }));
  };

  const handleAddMembers = async () => {
    if (selected.length === 0) return;
    
    try {
      const token = localStorage.getItem("token");
      const membersToAdd = selected.map(userId => ({
        user_id: userId,
        role_in_team: memberRoles[userId] || 'RESEARCHER'
      }));
      
      await axios.post(`http://localhost:8000/api/teacher/teams/${teamId}/add-members`, {
        members: membersToAdd
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Reset state
      setSelected([]);
      setMemberRoles({});
      setShowModal(false);
      
      // Callback to parent to refresh team data
      if (onMemberAdded) {
        onMemberAdded();
      }
      
    } catch (err) {
      console.error("Error adding members:", err);
      alert("Failed to add members. Please try again.");
    }
  };

  // Component to display domain tags
  const DomainTags = ({ domains, matchingDomains, isCompact = false }) => {
    if (!domains || domains.length === 0) return null;
    
    return (
      <div className={`flex flex-wrap gap-1 ${isCompact ? 'mt-1' : 'mt-2'}`}>
        {domains.map((domain, index) => {
          const isMatching = matchingDomains && matchingDomains.includes(domain);
          return (
            <span
              key={index}
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isMatching
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
              title={isMatching ? 'Matching domain with creator' : 'User domain'}
            >
              {domain}
            </span>
          );
        })}
      </div>
    );
  };

  const existingMemberIds = members.map(m => m.user_id);

  return (
    <div className="bg-white p-4 rounded shadow h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title} ({members.length})</h3>
        {canManage && (
          <button 
            onClick={() => setShowModal(true)} 
            className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
          >
            <FaUserPlus /> Add Member
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {members.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No team members yet.
          </div>
        ) : (
          <ul className="space-y-4">
            {members.map((member) => (
              <li key={member.user_id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                <FaUserCircle className="text-2xl text-gray-500 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-lg">{member.name}</p>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {member.role || 'User'}
                    </span>
                    {member.role_in_team && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {member.role_in_team}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <FaEnvelope className="text-xs flex-shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  
                  {member.roll_number && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <FaIdBadge className="text-xs flex-shrink-0" />
                      <span>Roll: {member.roll_number}</span>
                    </div>
                  )}
                  
                  <DomainTags 
                    domains={member.domains || []} 
                    matchingDomains={member.matchingDomains || []}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Members Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-[700px] max-w-[90vw] max-h-[80vh] flex flex-col">
            <h4 className="text-lg font-bold mb-4">Add Team Members</h4>
            
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <p>Loading potential members...</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto mb-4">
                  <div className="space-y-3">
                    {allPotentialMembers.length > 0 ? (
                      allPotentialMembers.map((member) => {
                        const disabled = existingMemberIds.includes(member.user_id);
                        const isSelected = selected.includes(member.user_id);
                        
                        return (
                          <div
                            key={member.user_id}
                            className={`p-3 border border-gray-200 rounded-lg ${
                              disabled ? "opacity-60" : "hover:bg-gray-50"
                            }`}
                          >
                            <label className="flex items-start gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isSelected || disabled}
                                disabled={disabled}
                                onChange={() => toggleSelect(member.user_id)}
                                className="mt-1 flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium">{member.name}</span>
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {member.role}
                                  </span>
                                  {disabled && (
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                      already added
                                    </span>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                  <FaEnvelope className="text-xs flex-shrink-0" />
                                  <span className="truncate">{member.email}</span>
                                </div>

                                {member.roll_number && (
                                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                    <FaIdBadge className="text-xs flex-shrink-0" />
                                    <span>Roll: {member.roll_number}</span>
                                  </div>
                                )}

                                <DomainTags 
                                  domains={member.domains || []} 
                                  matchingDomains={member.matchingDomains || []}
                                  isCompact={true}
                                />

                                {member.matchingDomains && member.matchingDomains.length > 0 && (
                                  <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                    <FaTags className="text-xs flex-shrink-0" />
                                    <span>
                                      {member.matchingDomains.length} matching domain{member.matchingDomains.length > 1 ? 's' : ''} with creator
                                    </span>
                                  </div>
                                )}

                                {/* Role Selection for Selected Members */}
                                {isSelected && !disabled && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <label className="text-sm font-medium">Team Role:</label>
                                    <select
                                      value={memberRoles[member.user_id] || 'RESEARCHER'}
                                      onChange={(e) => updateMemberRole(member.user_id, e.target.value)}
                                      className="text-xs px-2 py-1 border rounded"
                                    >
                                      <option value="RESEARCHER">Researcher</option>
                                      <option value="ASSISTANT">Assistant</option>
                                      <option value="LEAD">Lead</option>
                                    </select>
                                  </div>
                                )}
                              </div>
                            </label>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-8">No potential members found.</p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button 
                    onClick={() => {
                      setShowModal(false);
                      setSelected([]);
                      setMemberRoles({});
                    }} 
                    className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMembers}
                    disabled={selected.length === 0}
                    className={`px-4 py-2 text-sm rounded text-white ${
                      selected.length 
                        ? "bg-blue-600 hover:bg-blue-700" 
                        : "bg-blue-300 cursor-not-allowed"
                    }`}
                  >
                    Add Selected ({selected.length})
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberList;