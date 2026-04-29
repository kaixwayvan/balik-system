import { useState } from "react";

import SettingsSidebar from "./SettingsSidebar";

import GeneralSettings from "./settings-tabs/GeneralSettings";
import NotificationsSettings from "./settings-tabs/NotificationsSettings";
import AIMatchingSettings from "./settings-tabs/AIMatchingSettings";
import QRCodeSettings from "./settings-tabs/QRCodeSettings";
import SecuritySettings from "./settings-tabs/SecuritySettings";
import BackupSettings from "./settings-tabs/BackupSettings";

import { settingsTabs } from "./helper/settingsData";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;

      case "notifications":
        return <NotificationsSettings />;

      case "ai":
        return <AIMatchingSettings />;

      case "qr":
        return <QRCodeSettings />;

      case "security":
        return <SecuritySettings />;

      case "backup":
        return <BackupSettings />;

      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-[#eef1fb] p-6">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          System Settings
        </h1>
        <p className="text-gray-500 text-sm">
          Configure system preferences and behavior
        </p>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col lg:flex-row gap-8">
        <SettingsSidebar
          tabs={settingsTabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}