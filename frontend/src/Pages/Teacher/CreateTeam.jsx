import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import BasicInfoForm from '../../components/Teacher/CreateTeam/BasicInfoForm';
import MemberManager from '../../components/Teacher/CreateTeam/MemberManager';
import DocumentUploader from '../../components/Teacher/CreateTeam/DocumentUpload';
import TeamSettings from '../../components/Teacher/CreateTeam/TeamSettings';
import FormActions from '../../components/Teacher/CreateTeam/FormActions';
const CreateTeam = () => {
  const navigate = useNavigate();

  // Basic info
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('Active');

  // Members
  const [members, setMembers] = useState([]); // [{id, name, role}]

  // Documents
  const [paperFile, setPaperFile] = useState(null);
  const [proposalFile, setProposalFile] = useState(null);
  const [notes, setNotes] = useState('');

  // Settings
  const [visibility, setVisibility] = useState('public');
  const [maxMembers, setMaxMembers] = useState(10);
  const [allowApps, setAllowApps] = useState(true);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Please enter a team name.');
    if (!category) return alert('Please choose a research category/field.');

    const payload = {
      name, desc, category, status,
      members,
      files: { paper: paperFile?.name || null, proposal: proposalFile?.name || null },
      notes,
      settings: { visibility, maxMembers, allowApps },
    };
    console.log('Create Team payload:', payload);
    alert('Team created (mock). Check console for payload.');
    navigate('/teacher/team');
  };

  return (
    <div className="p-6 space-y-6">
        
      <div className="flex items-center gap-4 mb-4">
        <button
    onClick={() => navigate(-1)}
    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
  >
    <FaArrowLeft />
  </button>
        <div>  
          <h2 className="text-2xl font-bold">Create New Research Team</h2>
          <p className="text-gray-500">Fill in the details below to set up your research team.</p>
        </div>
      </div>

      <BasicInfoForm
        name={name} onNameChange={setName}
        desc={desc} onDescChange={setDesc}
        category={category} onCategoryChange={setCategory}
        status={status} onStatusChange={setStatus}
      />

      <MemberManager
        members={members}
        onChange={setMembers}
      />

      <DocumentUploader
        paperFile={paperFile} onPaperChange={setPaperFile}
        proposalFile={proposalFile} onProposalChange={setProposalFile}
        notes={notes} onNotesChange={setNotes}
      />

      <TeamSettings
        visibility={visibility} onVisibilityChange={setVisibility}
        maxMembers={maxMembers} onMaxMembersChange={setMaxMembers}
        allowApps={allowApps} onAllowAppsChange={setAllowApps}
      />

      <FormActions
        onCancel={() => navigate('/teacher/team')}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default CreateTeam;
