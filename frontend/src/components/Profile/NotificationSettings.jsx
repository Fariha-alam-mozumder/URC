import { useState } from "react";

function NotificationSettings() {
  const [settings, setSettings] = useState({
    email: true,
    weekly: true,
    events: false,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="mb-4">
      <p className="font-medium">Notification Settings</p>
      <div className="mt-2 space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.email}
            onChange={() => toggleSetting("email")}
            className="mr-2"
          />
          Email notifications for new research papers
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.weekly}
            onChange={() => toggleSetting("weekly")}
            className="mr-2"
          />
          Weekly research digest
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.events}
            onChange={() => toggleSetting("events")}
            className="mr-2"
          />
          Conference and event notifications
        </label>
      </div>
    </div>
  );
}

export default NotificationSettings;
