import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import StatsCard from "./StatsCard";
import BadgeList from "./BadgeList";
import Tabs from "./Tabs";
import Certificates from "./Certificates";
import LevelProgression from "./LevelProgression";
import AuditLogs from "./AuditLogs";

// Simulated Backend
const mockGamificationService = {
  getTotalUsers: async () => new Promise(res => setTimeout(() => res(24592), 800)),
  getActiveToday: async () => new Promise(res => setTimeout(() => res(1843), 600)),
  getRewardsIssued: async () => new Promise(res => setTimeout(() => res(845200), 700)),
  AvgTaskCompletion: async () => new Promise(res => setTimeout(() => res(92), 500)),
  
  getBadgeStats: async () => new Promise(res => setTimeout(() => res([
    { title: "Pioneer Status", description: "Joined during the initial platform rollout", users: "4.2k" },
    { title: "Efficiency Master", description: "Resolved 50+ tickets with 5-star ratings", users: "1.8k" },
    { title: "Community Pillar", description: "Provided highly rated answers in forums", users: "856" }
  ]), 900)),

  getCertificatesData: async () => new Promise(res => setTimeout(() => res([
    { 
      title: "Platform Onboarding Excellence", 
      requirements: ["Complete profile verification", "Pass security protocol quiz", "Enable 2FA"] 
    },
    { 
      title: "Advanced Data Handling", 
      requirements: ["Maintain 95% accuracy over 30 days", "Process 500+ data nodes", "Zero compliance flags"] 
    }
  ]), 600)),

  getLevelRulesData: async () => new Promise(res => setTimeout(() => res([
    { 
      from: "Level 1", 
      to: "Level 2", 
      requirement: "Earn 1,000 total points (Seeker Status → Finder Status)" 
    },
    { 
      from: "Level 2", 
      to: "Level 3", 
      requirement: "Earn 2,000 total points (Finder Status → Hero Status)" 
    },
    { 
      from: "Level 3", 
      to: "Level 4", 
      requirement: "Earn 3,500 total points (Hero Status → Guardian Status)" 
    },
    { 
      from: "Level 4", 
      to: "Level 5", 
      requirement: "Earn 5,000 total points (Guardian Status → Legend Status)" 
    }
  ]), 400)),

  getAuditLogsData: async () => new Promise(res => setTimeout(() => res([
    { userName: "user_7739", activity: "was awarded the Efficiency Master badge." },
    { userName: "system_auto", activity: "issued 500 XP to 140 users for daily login streak." },
    { userName: "user_1022", activity: "upgraded from Novice to Specialist tier." },
    { userName: "admin_sarah", activity: "adjusted the Global XP Multiplier to 1.5x." },
    { userName: "user_8991", activity: "completed Platform Onboarding Excellence certificate." }
  ]), 750))
};

export default function GamificationPage() {
  const [activeTab, setActiveTab] = useState("Reward Rules Engine");
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [levelRules, setLevelRules] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [statsData, setStatsData] = useState([
    { title: "Total Users", value: 0, type: "users", change: "+12%", trend: "up" },
    { title: "Active Today", value: 0, type: "active", change: "+5%", trend: "up" },
    { title: "Total Points Issued", value: "0", type: "rewards", change: "+18%", trend: "up" },
    { title: "Avg. Resolution Rate", value: 0, type: "completion", change: "Stable", trend: "up" },
  ]);

  const fetchGamificationData = async () => {
    try {
      setLoading(true);
      const [
        totalUsers,
        activeToday,
        rewardsIssued,
        avgTaskCompletion,
        badgesStats,
        certsData,
        levelRulesData,
        logsData
      ] = await Promise.all([
        mockGamificationService.getTotalUsers(),
        mockGamificationService.getActiveToday(),
        mockGamificationService.getRewardsIssued(),
        mockGamificationService.AvgTaskCompletion(),
        mockGamificationService.getBadgeStats(),
        mockGamificationService.getCertificatesData(),
        mockGamificationService.getLevelRulesData(),
        mockGamificationService.getAuditLogsData()
      ]);

      setStatsData([
        { title: "Total Users", value: totalUsers.toLocaleString(), type: "users", change: "+12%", trend: "up" },
        { title: "Active Today", value: activeToday.toLocaleString(), type: "active", change: "+8%", trend: "up" },
        { title: "Total Points Issued", value: rewardsIssued.toLocaleString(), type: "rewards", change: "+24%", trend: "up" },
        { title: "Avg. Resolution Rate", value: avgTaskCompletion, type: "completion", change: "+4%", trend: "up" },
      ]);

      setBadges(badgesStats);
      setCertificates(certsData);
      setLevelRules(levelRulesData);
      
      const auditStrings = (logsData || []).map(log => `[${log.userName}] ${log.activity}`);
      setAuditLogs(auditStrings);
    } catch (err) {
      console.error("Error fetching gamification data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGamificationData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-[2rem] h-full overflow-y-auto shadow-xl border border-white/40 flex flex-col gap-6 sm:gap-8 w-full"
    >

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 shrink-0 w-full">
        {statsData.map((stat, i) => (
          <StatsCard key={i} {...stat} loading={loading} />
        ))}
      </div>

      {/* Badges Component Section */}
      <div className="shrink-0 w-full">
        <BadgeList badges={badges} loading={loading} />
      </div>

      {/* Tabs Navigation */}
      <div className="shrink-0 w-full overflow-x-auto">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="w-full h-auto flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="w-full"
          >
            {activeTab === "Reward Rules Engine" && (
              <Certificates certificates={certificates} />
            )}

            {activeTab === "Level Progression Rules" && (
              <LevelProgression rules={levelRules} />
            )}

            {activeTab === "Gamification Audit Logs" && (
              <AuditLogs logs={auditLogs} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}