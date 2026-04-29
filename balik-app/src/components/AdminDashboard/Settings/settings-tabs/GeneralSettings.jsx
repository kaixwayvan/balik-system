import { useState } from "react";

import SettingsInput from "../SettingsInput";
import SettingsSelect from "../SettingsSelect";

import { generalSettingsData } from "../helper/settingsData";

export default function GeneralSettings() {
  const [settings, setSettings] = useState(generalSettingsData);

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setSettings(generalSettingsData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-xl font-extrabold mb-8">
        General Settings
      </h2>

      <div className="space-y-8">
        <SettingsInput
          label="System Name"
          value={settings.systemName}
          placeholder="System Name"
          onChange={(e) =>
            handleChange("systemName", e.target.value)
          }
        />

        <SettingsInput
          label="Admin Email"
          value={settings.adminEmail}
          placeholder="Admin Email"
          onChange={(e) =>
            handleChange("adminEmail", e.target.value)
          }
        />

        <SettingsSelect
          label="Timezone"
          value={settings.timezone}
          onChange={(e) =>
            handleChange("timezone", e.target.value)
          }
          options={[
            "Asia/Manila",
            "Asia/Tokyo",
            "UTC",
            "America/New_York",
          ]}
        />

        <SettingsSelect
          label="Default Language"
          value={settings.language}
          onChange={(e) =>
            handleChange("language", e.target.value)
          }
          options={[
            "English",
            "Filipino",
            "Japanese",
          ]}
        />
      </div>

      <div className="border-t border-gray-200 mt-10 pt-8 flex flex-wrap gap-4">
        <button className="bg-green-600 hover:bg-green-700 text-white px-7 py-3 rounded-xl font-medium transition cursor-pointer">
          Save Changes
        </button>

        <button
          onClick={handleReset}
          className="border border-gray-400 hover:bg-gray-100 px-7 py-3 rounded-xl font-medium transition cursor-pointer"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}