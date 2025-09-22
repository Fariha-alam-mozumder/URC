import { useContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { resolveApiUrl } from "../../config/api";
import AdditionalPreferences from "../../components/Preference/AdditionalPreferences";
import Department from "../../components/Preference/Department";
import ResearchFields from "../../components/Preference/ResearchFields";
import AvatarPicker from "../../components/Profile/AvatarPicker";

function PreferencePage() {
  const navigate = useNavigate();
  const { user, currentViewRole, loading, token, updateAuth } = useContext(AuthContext);

  const resolvedUserId = useMemo(() => user?.user_id ?? user?.id, [user]);
  const [departments, setDepartments] = useState([]);
  const [availableDomains, setAvailableDomains] = useState([]);
  const [allDomains, setAllDomains] = useState([]);
  const [userPreferences, setUserPreferences] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [preferencesLoading, setPreferencesLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (user && token && resolvedUserId) {
      fetchInitialData();
      fetchProfileData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token, resolvedUserId]);

  const fetchProfileData = async () => {
    try {
      const { data } = await axios.get(
        resolveApiUrl(`/user/profile/${resolvedUserId}`),
        authHeaders
      );
      if (data.success) setProfileData(data.profile);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setProfileData(null);
    }
  };

  const fetchInitialData = async () => {
    try {
      setPreferencesLoading(true);
      const [deptRes, domainsRes, prefsRes] = await Promise.all([
        axios.get(resolveApiUrl("/departments"), authHeaders),
        axios.get(resolveApiUrl("/domains"), authHeaders),
        axios
          .get(resolveApiUrl(`/user/preferences/${resolvedUserId}`), authHeaders)
          .catch(() => ({ data: { preferences: {} } })),
      ]);

      setDepartments(deptRes.data.departments || []);
      setAllDomains(domainsRes.data.domains || []);

      const preferences = prefsRes.data.preferences || {};
      const initial = {
        name: preferences.name || user?.name || "",
        email: preferences.email || user?.email || "",
        designation: preferences.designation || "",
        department_id: preferences.department_id || null,
        roll_number: preferences.roll_number || "",
        selected_domains: Array.isArray(preferences.selected_domains) ? preferences.selected_domains : [],
        password: "",
        confirmPassword: "",
      };
      setUserPreferences(initial);

      if (initial.department_id) {
        await loadDomainsForDepartment(initial.department_id);
      } else {
        setAvailableDomains(domainsRes.data.domains || []);
      }
    } catch (err) {
      console.error("Error fetching initial data:", err);
      setDepartments([]);
      setAllDomains([]);
      setAvailableDomains([]);
      setUserPreferences({
        name: user?.name || "",
        email: user?.email || "",
        designation: "",
        department_id: null,
        roll_number: "",
        selected_domains: [],
        password: "",
        confirmPassword: "",
      });
    } finally {
      setPreferencesLoading(false);
    }
  };

  const loadDomainsForDepartment = async (departmentId) => {
    if (!departmentId) { setAvailableDomains(allDomains); return; }
    try {
      const res = await axios.get(
        resolveApiUrl(`/department/${departmentId}/domains`),
        authHeaders
      );
      setAvailableDomains(res.data.domains || []);
    } catch (err) {
      console.error("Error fetching dept domains:", err);
      setAvailableDomains([]);
    }
  };

  const handleDepartmentChange = async (deptId) => {
    setUserPreferences((p) => ({ ...p, department_id: deptId, selected_domains: [] }));
    await loadDomainsForDepartment(deptId);
  };

  const handleAdditionalPreferencesChange = (data) => {
    setUserPreferences((p) => ({ ...p, ...data }));
  };

  const handleDomainsChange = (selectedDomains) => {
    setUserPreferences((p) => ({ ...p, selected_domains: selectedDomains }));
  };

  const handleSavePreferences = async () => {
    try {
      setSaving(true);
      const p = userPreferences || {};

      // Validate locally to avoid noisy roundtrips
      if (!p.name?.trim()) { console.error("Name is required"); return; }
      if (!p.department_id) { console.error("Department is required"); return; }
      if (!Array.isArray(p.selected_domains) || p.selected_domains.length < 3) {
        console.error("At least 3 research domains are required"); return;
      }
      if (p.password) {
        if (p.password.length < 6) { console.error("Password must be at least 6 characters long"); return; }
        if (p.password !== p.confirmPassword) { console.error("Passwords do not match"); return; }
      }

      // Always send full payload backend expects (simple & reliable)
      const payload = {
        name: p.name.trim(),
        department_id: Number(p.department_id),
        selected_domains: p.selected_domains.map(Number),
        designation: p.designation?.trim() || null, // for TEACHER/REVIEWER
        roll_number: p.roll_number || null,         // for STUDENT
        ...(p.password ? { password: p.password, confirmPassword: p.confirmPassword } : {}),
      };

      console.log("Saving preferences (full payload):", payload);

      const { data } = await axios.put(
        resolveApiUrl(`/user/preferences/${resolvedUserId}`),
        payload,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      if (data?.success) {
        console.info("Preferences saved successfully");
        if (payload.name && payload.name !== user?.name) {
          updateAuth(token, { ...user, name: payload.name }, currentViewRole);
        }
        await fetchProfileData();
        handleCompleteSetup();
      } else {
        throw new Error(data?.error || data?.message || "Failed to save preferences");
      }
    } catch (error) {
      const msg = error.response?.data?.error || error.response?.data?.message || error.message || "Failed to save preferences";
      console.error("Error saving preferences:", msg, error);
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteSetup = () => {
    const rolePath = (currentViewRole || user.role)?.toLowerCase();
    if (rolePath) navigate(`/${rolePath}/home`);
  };

  if (loading || preferencesLoading || !userPreferences) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const userRole = currentViewRole || user.role;

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <img src="/image1.png" alt="Background" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-25"></div>

      <div className="relative max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-4 mb-4 z-10">
        <h1 className="text-2xl font-bold text-center mb-2">Set Your Research Preferences</h1>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">Profile Photo</h3>
          <p className="text-sm text-gray-500 mb-3">Upload a square image (JPG/PNG/WebP/GIF, max 3MB).</p>
          <AvatarPicker
            userId={resolvedUserId}
            token={token}
            currentUrl={profileData?.profile_image}
            onUpdated={fetchProfileData}
          />
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          <Department
            role={userRole}
            departments={departments}
            selectedDepartment={userPreferences.department_id}
            onDepartmentChange={handleDepartmentChange}
          />

          <AdditionalPreferences
            role={userRole}
            user={user}
            initialData={userPreferences}
            onDataChange={handleAdditionalPreferencesChange}
          />

          <ResearchFields
            role={userRole}
            availableDomains={availableDomains}
            allDomains={allDomains}
            selectedDomainIds={userPreferences.selected_domains}
            onChange={handleDomainsChange}
          />

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              disabled={saving}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSavePreferences}
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PreferencePage;
