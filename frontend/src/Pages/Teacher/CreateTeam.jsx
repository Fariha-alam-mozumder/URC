// src/Pages/Teacher/CreateTeam.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { resolveApiUrl } from "../../config/api";

import BasicInfoForm from "../../components/Teacher/CreateTeam/BasicInfoForm";
import MemberManager from "../../components/Teacher/CreateTeam/MemberManager";
import DocumentUploader from "../../components/Teacher/CreateTeam/DocumentUpload";
import TeamSettings from "../../components/Teacher/CreateTeam/TeamSettings";
import FormActions from "../../components/Teacher/CreateTeam/FormActions";
import { AuthContext } from "../../context/AuthContext";

const CreateTeam = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Creator context
  const [creatorDeptId, setCreatorDeptId] = useState(null);
  const [domainOptions, setDomainOptions] = useState([]); // [{domain_id, domain_name}]
  const [creatorDomainIds, setCreatorDomainIds] = useState([]); // [id, id, ...]

  // Basic info
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState(""); // selected domain_id (string/number)
  const [status, setStatus] = useState("Active");

  // Members
  const [members, setMembers] = useState([]);

  // Proposal modal & data
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalAbstract, setProposalAbstract] = useState("");
  const [proposalFile, setProposalFile] = useState(null);

  // Settings
  const [visibility, setVisibility] = useState("public");
  const [maxMembers, setMaxMembers] = useState(10);
  const [allowApps, setAllowApps] = useState(true);

  // Fetch creator context (dept + domains)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(resolveApiUrl("/me/context"), {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const deptId = res.data?.department_id ?? null;
        const domains = Array.isArray(res.data?.domains)
          ? res.data.domains
          : [];
        setCreatorDeptId(deptId);
        setDomainOptions(domains);
        const ids = domains.map((d) => d.domain_id);
        setCreatorDomainIds(ids);
        // Preselect first domain if none selected yet
        if (!category && domains.length) {
          setCategory(String(domains[0].domain_id));
        }
      })
      .catch((err) => {
        console.error(
          "Failed to load creator context:",
          err.response?.data || err.message
        );
      });
  }, []);

  // Upload modal submit handler
  const handleUploadSubmit = ({ title, abstract, file }) => {
    console.log("Create Team UploadSubmit received:", {
      title,
      abstract,
      file,
    });
    setProposalTitle(title);
    setProposalAbstract(abstract);
    setProposalFile(file);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter a team name.");
    if (!category) return alert("Please choose a research category/field.");

    try {
      // Ensure creator is included as LEAD
      const creatorId = user?.id ?? user?.user_id;
      let finalMembers = [...members];
      if (
        creatorId &&
        !finalMembers.some(
          (m) => Number(m.user_id ?? m.id ?? m.userId) === Number(creatorId)
        )
      ) {
        finalMembers.unshift({
          user_id: Number(creatorId),
          name: user?.name || "Creator",
          email: user?.email || "",
          role_in_team: "LEAD",
        });
      }

      const formData = new FormData();
      formData.append("team_name", name);
      formData.append("team_description", desc);
      formData.append("domain_id", String(Number(category))); // server coerces to number
      formData.append("status", status.toUpperCase());
      formData.append("visibility", visibility.toUpperCase());
      formData.append("max_members", String(Number(maxMembers)));
      formData.append("isHiring", String(!!allowApps));

      // Proposal info
      formData.append("proposal_title", proposalTitle || `${name} Proposal`);
      formData.append("proposal_abstract", proposalAbstract || "");

      const formattedMembers = members.map((m) => ({
        user_id: Number(m.user_id ?? m.id ?? m.userId),
        role_in_team: m.role_in_team || m.role || "RESEARCHER",
      }));
      formData.append("members", JSON.stringify(formattedMembers));

      console.log("Submitting proposal file:", proposalFile);

      if (proposalFile) {
        formData.append("proposal", proposalFile);
      }
      console.log("Final payload to backend:", [...formData.entries()]);
      const token = localStorage.getItem("token");
      await axios.post(resolveApiUrl("/teams"), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Team created successfully!");
      navigate("/teacher/team");
    } catch (err) {
      console.error("Create team error:", err.response?.data || err.message);
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const first = Object.values(err.response.data.errors)[0];
        alert(`Validation failed: ${JSON.stringify(first)}`);
      } else {
        alert("Error creating team. Check console.");
      }
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
        domainOptions={domainOptions} 
      />

      {creatorDeptId && (
        <MemberManager
          members={members}
          onChange={setMembers}
          creatorUserId={user?.user_id ?? user?.id}
          teamDomainId={Number(category) || null}
        />
      )}

      <DocumentUploader
        proposalFile={proposalFile}
        onProposalSubmit={handleUploadSubmit}
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
