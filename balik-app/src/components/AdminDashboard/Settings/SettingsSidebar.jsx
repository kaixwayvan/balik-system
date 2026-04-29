import SettingsTabButton from "./SettingsTabButton";

export default function SettingsSidebar({
  tabs,
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3 w-full lg:w-[340px] h-fit">
      <div className="space-y-2">
        {tabs.map((tab) => (
          <SettingsTabButton
            key={tab.id}
            label={tab.label}
            icon={tab.icon}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>
    </div>
  );
}