import  { useState } from "react";

function PrivacySettings() {
  const [privacy, setPrivacy] = useState({
    visible: true,
    allowResearch: false,
  });

  const togglePrivacy = (key) => {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <p className="font-medium">Privacy Settings</p>
      <div className="mt-2 space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={privacy.visible}
            onChange={() => togglePrivacy("visible")}
            className="mr-2"
          />
          Make my profile visible to other researchers
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={privacy.allowResearch}
            onChange={() => togglePrivacy("allowResearch")}
            className="mr-2"
          />
          Allow others to see my research interests
        </label>
      </div>
    </div>
  );
}

export default PrivacySettings;
