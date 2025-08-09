import PrivacySettings from "./PrivacySettings";
import NotificationSettings from "./NotificationSettings";



function AdditionalPreferences() {
  return (
    <div className="mb-6">
      <NotificationSettings />
      <PrivacySettings />
    </div>
  );
}

export default AdditionalPreferences;
