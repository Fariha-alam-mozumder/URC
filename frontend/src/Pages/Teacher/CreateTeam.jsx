import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import BasicInfoForm from "../../components/Teacher/CreateTeam/BasicInfoForm";
import MemberManager from "../../components/Teacher/CreateTeam/MemberManager";
import DocumentUploader from "../../components/Teacher/CreateTeam/DocumentUpload";
import TeamSettings from "../../components/Teacher/CreateTeam/TeamSettings";
import FormActions from "../../components/Teacher/CreateTeam/FormActions";
const CreateTeam = () => {
  const navigate = useNavigate();

  // Basic info
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Active");

  // Members
  const [members, setMembers] = useState([]); // [{id, name, role}]

  // Documents
  const [paperFile, setPaperFile] = useState(null);
  const [proposalFile, setProposalFile] = useState(null);
  const [notes, setNotes] = useState("");

  // Settings
  const [visibility, setVisibility] = useState("public");
  const [maxMembers, setMaxMembers] = useState(10);
  const [allowApps, setAllowApps] = useState(true);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!name.trim()) return alert("Please enter a team name.");
    if (!category) return alert("Please choose a research category/field.");

    try {
      const formData = new FormData();

      // Basic fields
      formData.append("team_name", name);
      formData.append("team_description", desc);
      formData.append("domain_id", category); // ensure backend expects number
      formData.append("status", status.toUpperCase());
      formData.append("visibility", visibility.toUpperCase());
      formData.append("max_members", maxMembers);
      formData.append("isHiring", allowApps); // boolean

      // Proposal data (optional)
      formData.append("proposal_title", `${name} Proposal`);
      formData.append("proposal_abstract", notes || "");

      // Members array as JSON string
      const formattedMembers = members.map((m) => ({
        user_id: m.id, // make sure it's a number
        role_in_team: m.role,
      }));
      formData.append("members", JSON.stringify(formattedMembers));

      // File upload (only proposal for now)
      if (proposalFile) {
        formData.append("proposal", proposalFile); // field name matches backend
      }

      // Send request with token (if auth needed)
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8000/api/teams", // adjust API route
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Team created successfully!");
      navigate("/teacher/team");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error creating team. Check console.");
    }
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
          <p className="text-gray-500">
            Fill in the details below to set up your research team.
          </p>
        </div>
      </div>

      <BasicInfoForm
        name={name}
        onNameChange={setName}
        desc={desc}
        onDescChange={setDesc}
        category={category}
        onCategoryChange={setCategory}
        status={status}
        onStatusChange={setStatus}
      />

      <MemberManager members={members} onChange={setMembers} />

      <DocumentUploader
        //paperFile={paperFile} onPaperChange={setPaperFile}
        proposalFile={proposalFile}
        onProposalChange={setProposalFile}
        //notes={notes} onNotesChange={setNotes}
      />

      <TeamSettings
        visibility={visibility}
        onVisibilityChange={setVisibility}
        maxMembers={maxMembers}
        onMaxMembersChange={setMaxMembers}
        allowApps={allowApps}
        onAllowAppsChange={setAllowApps}
      />

      <FormActions
        onCancel={() => navigate("/teacher/team")}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default CreateTeam;
