export default function Tabs({ activeTab, setActiveTab }) {
  const tabs = [
    "Reward Rules Engine",
    "Level Progression Rules",
    "Gamification Audit Logs",
  ];

  return (
    <div className="flex gap-3 mt-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`cursor-pointer px-6 py-3 rounded-full text-sm font-bold
            transition-colors duration-200
            ${
              activeTab === tab
                ? "bg-indigo-700 text-white hover:bg-indigo-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}