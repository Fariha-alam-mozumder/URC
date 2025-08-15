import { useParams } from "react-router-dom";
import EditButton from "../../components/Profile/EditButton";
import PersonalInfo from "../../components/Profile/PersonalInfo";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ResearchStats from "../../components/Profile/ResearchStats";
import { profiles } from "../../Data/ProfileData";



const ProfilePage = () => {
  const { role } = useParams(); // teacher or reviewer
  const profile = profiles[role] ; // fallback

  return (
    <div className="p-4 md:p-6 bg-gray-300 min-h-screen flex flex-col gap-6">
      <ProfileHeader
        name={profile.name}
        role={profile.role}
        department={profile.department}
      />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          <PersonalInfo
            name={profile.name}
            phone={profile.phone}
            email={profile.email}
            department={profile.department}
             university={profile.university}
            role={profile.role}
            
          />
          
          <EditButton />
        </div>
        <ResearchStats stats={profile.stats} />
      </div>
    </div>
  );
};

export default ProfilePage;