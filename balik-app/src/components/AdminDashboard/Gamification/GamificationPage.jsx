import { useState } from "react";
import StatsCard from "./StatsCard";
import BadgeList from "./BadgeList";
import Tabs from "./Tabs";
import Certificates from "./Certificates";
import LevelProgression from "./LevelProgression";
import AuditLogs from "./AuditLogs";

import {
  statsData,
  badgesData,
  certificatesData,
  levelRulesData,
  auditLogsData,
} from "./helper/gamificationData";

export default function GamificationPage() {
  const [activeTab, setActiveTab] = useState("Reward Rules Engine");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          System Gamification Engine
        </h1>
        <p className="text-gray-500 text-sm">
          Engage and motivate users through interactive challenges, rewards, and
          achievements to encourage active participation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      <BadgeList badges={badgesData} />

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "Reward Rules Engine" && (
        <Certificates certificates={certificatesData} />
      )}

      {activeTab === "Level Progression Rules" && (
        <LevelProgression rules={levelRulesData} />
      )}

      {activeTab === "Gamification Audit Logs" && (
        <AuditLogs logs={auditLogsData} />
      )}
    </div>
  );
}