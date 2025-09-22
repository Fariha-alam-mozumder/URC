import { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { resolveApiUrl } from "../../config/api";
import EditButton from "../../components/Profile/EditButton";
import PersonalInfo from "../../components/Profile/PersonalInfo";
import ProfileHeader from "../../components/Profile/ProfileHeader";

const ProfilePage = () => {
  const { user, currentViewRole, loading, token } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState(null);
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(Date.now());

  // Resolve user ID safely
  const resolvedUserId = useMemo(() => user?.user_id ?? user?.id, [user]);

  const fetchProfileData = async () => {
    if (!resolvedUserId || !token) return;

    setProfileLoading(true);
    setError(null);

    try {
      // Add cache busting to the profile request
      const timestamp = Date.now();
      const response = await axios.get(
        resolveApiUrl(`/user/profile/${resolvedUserId}?t=${timestamp}`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile response:", response.data); // Debug log

      if (response.data?.success && response.data?.profile) {
        setProfileData(response.data.profile);
        // Update avatar refresh key to force re-render of images
        setAvatarRefreshKey(timestamp);
      } else {
        throw new Error("Invalid profile data received from server");
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch profile";

      setError(`${err.response?.status || ""} ${msg}`.trim());
      console.error("Error fetching profile:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [resolvedUserId, token]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center text-red-600">
        User not found. Please log in again.
      </div>
    );
  }

  const role = currentViewRole || user.role;

  if (!role) {
    return (
      <div className="p-6 text-center text-red-600">
        Role not found. Please contact support.
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4">Loading profile details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>Error loading profile: {error}</p>
        <button
          onClick={fetchProfileData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Use profileData if available, fallback to user context
  const displayData = profileData || user;

  // Extract department name correctly based on the schema
  let departmentName =
    displayData?.department?.department_name || "Not specified";

  if (departmentName === "EEE")
    departmentName = "Electrical and Electronic Engineering";
  else if (departmentName === "CSE")
    departmentName = "Computer Science and Engineering";

  // Extract other role-specific data
  const designation = displayData?.designation || null; // Teacher/Reviewer
  const rollNumber = displayData?.roll_number || null; // Student

  // Extract domains
  const domains = displayData?.domains || [];

  const profile = {
    name: displayData.name || "Not provided",
    email: displayData.email || "Not provided",
    role,
    department: departmentName,
    designation,
    rollNumber,
    domains,
    isVerified: displayData.isVerified,
    isMainAdmin: displayData.isMainAdmin,
    profileUrl: displayData.profile_image || null,
  };

  profile.role =
    profile.role.charAt(0).toUpperCase() + profile.role.slice(1).toLowerCase();

  // Generate avatar URL with cache busting
  const getAvatarUrl = () => {
    const baseUrl = displayData?.profile_image;
    if (!baseUrl || baseUrl.includes("placeholder")) return baseUrl;

    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}t=${avatarRefreshKey}`;
  };

  return (
    <div className="p-4 md:p-6 bg-gray-300 min-h-screen flex flex-col gap-6">
      <ProfileHeader
        name={profile.name}
        role={profile.role}
        department={profile.department}
        avatarUrl={getAvatarUrl()}
        key={avatarRefreshKey} // Force re-render when avatar changes
      />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          <PersonalInfo
            name={profile.name}
            email={profile.email}
            role={profile.role}
            department={profile.department}
            designation={profile.designation}
            rollNumber={profile.rollNumber}
            domains={profile.domains}
            isVerified={profile.isVerified}
            isMainAdmin={profile.isMainAdmin}
          />
          <EditButton />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
