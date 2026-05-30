import { createPortal } from "react-dom";
import { useState, useRef, useEffect } from "react";
import {
  Trophy,
  Award,
  UserRound,
  ShieldUser,
  Settings2,
  CircleStar,
  SquareActivity,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  ImagePlus,
  Loader2,
  Eye,
  EyeOff,
  Search,
  Heart,
  Shield,
  PenTool,
  Repeat,
  Leaf,
  Mail,
  Phone,
  UserPen,
  Calendar,
  Lock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Trash2,
  AlertTriangle,
  UserCheck,
  X,
  Check,
  PauseCircle,
} from "lucide-react";

/* Backend Simulation */
const useLocation = () => ({ state: null });

const useAuth = () => ({
  user: {
    id: "user-123",
    email: "user@baliksystem.ph",
    last_sign_in_at: "2026-05-29T08:30:00.000Z",
    user_metadata: {
      full_name: "Juan Dela Cruz",
      avatar_url: null,
      mobile_number: "+639171234567",
      gender: "Male",
      two_factor_enabled: true,
      provider: "google",
    },
  },
});

const userService = {
  uploadAvatar: async (userId, file) =>
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  updateProfile: async (userId, updates) => updates,
  updatePassword: async (password) => true,
};

const gamificationService = {
  getUserAchievements: async (userId) => [
    {
      id: "ach-1",
      title: "First Report",
      description: "Auto-awarded after first verified report",
      unlocked: true,
      icon_name: "search",
      created_at: "2026-05-10",
    },
    {
      id: "ach-2",
      title: "Trusted User",
      description: "90% Successful claims achieved",
      unlocked: true,
      icon_name: "shield",
      created_at: "2026-05-15",
    },
    {
      id: "ach-3",
      title: "Consistent Reporter",
      description: "5 verified reports logged",
      unlocked: false,
      icon_name: "award",
      created_at: "2026-05-20",
    },
    {
      id: "ach-4",
      title: "Eco Warrior",
      description: "Recycled items reported and claimed",
      unlocked: false,
      icon_name: "leaf",
      created_at: "2026-05-22",
    },
  ],
};

const supabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () =>
          Promise.resolve({ data: { points: 1250, level: 3 }, error: null }),
      }),
    }),
  }),
  channel: () => ({
    on: () => ({
      subscribe: () => ({ unsubscribe: () => {} }),
    }),
  }),
};

/* Main Component */
export default function UserProfile() {
  const { user } = useAuth();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("achievements");
  const [achievementView, setAchievementView] = useState("challenges");
  const [activeSection, setActiveSection] = useState("profile");
  const [achievements, setAchievements] = useState([]);
  const [achievementsLoading, setAchievementsLoading] = useState(false);
  const [profilePoints, setProfilePoints] = useState(0);
  const [profileLevel, setProfileLevel] = useState(1);
  const [profileLoading, setProfileLoading] = useState(true);
  const [tasksCompletedPercent, setTasksCompletedPercent] = useState(0);

  useEffect(() => {
    const userName = user?.user_metadata?.full_name || "User";

    if (activeTab === "achievements") {
      document.title = `My Achievements - BALIK System`;
    } else if (activeTab === "settings") {
      document.title = `Account Settings - BALIK System`;
    } else {
      document.title = `${userName}'s Profile - BALIK System`;
    }

    return () => {
      document.title = "BALIK System";
    };
  }, [user?.user_metadata?.full_name, activeTab]);

  useEffect(() => {
    if (location.state?.editMode) {
      setActiveTab("settings");
      setActiveSection("profile");
    } else if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    if (!user?.id) {
      setProfileLoading(false);
      return;
    }

    const loadData = async () => {
      setAchievementsLoading(true);
      try {
        const data = await gamificationService.getUserAchievements(user.id);
        const sorted = [...(data || [])].sort((a, b) =>
          a.unlocked === b.unlocked ? 0 : a.unlocked ? -1 : 1,
        );
        setAchievements(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setAchievementsLoading(false);
      }

      try {
        const res = await supabase
          .from("profiles")
          .select("points, level")
          .eq("id", user.id)
          .single();
        if (res.data) {
          setProfilePoints(res.data.points || 0);
          setProfileLevel(res.data.level || 1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setProfileLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  useEffect(() => {
    if (!achievements.length) return;
    const unlocked = achievements.filter((a) => a.unlocked).length;
    const achComp = (unlocked / achievements.length) * 100;
    const pointsComp = (profilePoints / 5000) * 100;
    setTasksCompletedPercent(
      Math.min(Math.round((achComp + pointsComp) / 2), 100),
    );
  }, [achievements, profilePoints]);

  const avatarUrl = user?.user_metadata?.avatar_url;
  const fullName = user?.user_metadata?.full_name || "BALIK User";

  return (
    <div className="p-8 sm:p-8 md:p-8 bg-[#F9F6F0] min-h-screen antialiased transition-all duration-300">
      {/* Global Animation Keyframes */}
      <style>{`
        @keyframes subtleFadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: subtleFadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="mx-auto space-y-6 animate-fade-in-up">
        {/* Header Summary Card */}
        <div className="bg-white rounded-4xl border border-[#E2DCD0] p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 w-full md:w-auto">
            {/* Profile Avatar */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#66240E] to-[#997C68] flex items-center justify-center text-white font-bold text-3xl shadow-inner border-4 border-white overflow-hidden">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-[#2C4A52] text-white p-2 rounded-full border-2 border-white shadow-md">
                <Shield size={14} />
              </div>
            </div>

            <div className="space-y-1.5 min-w-0 w-full flex flex-col items-center sm:items-start">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-[#66240E] tracking-tight">
                  {fullName}
                </h1>
                <span className="px-3 py-0.5 bg-[#66240E]/10 border border-[#66240E]/20 text-[#66240E] rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  Level {profileLevel}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail size={14} className="text-slate-400" /> {user?.email}
              </p>

              <div className="pt-3 max-w-xs w-full">
                <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  <span>Trust Score</span>
                  <span className="text-[#2C4A52]">
                    {tasksCompletedPercent}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                  <div
                    className="h-full bg-gradient-to-r from-[#2C4A52] to-[#45727d] transition-all duration-700 ease-out"
                    style={{ width: `${tasksCompletedPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveTab("settings");
              setActiveSection("profile");
            }}
            className="group cursor-pointer w-full sm:w-auto px-6 py-3 bg-[#66240E] text-white rounded-4xl text-xs sm:text-sm font-bold tracking-wider uppercase shadow-md shadow-[#66240E]/10 hover:bg-[#521c0b] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#66240E]/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <UserPen
              size={16}
              className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
            />
            Edit System Profile
          </button>
        </div>

        {/* Primary Navigation */}
        <div className="flex justify-center sm:justify-start border-b border-[#E2DCD0] gap-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("achievements")}
            className={`cursor-pointer pb-3 px-2 text-sm sm:text-base font-bold uppercase tracking-wider transition-all relative shrink-0 ${
              activeTab === "achievements"
                ? "text-[#66240E]"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Achievements
            {activeTab === "achievements" && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#66240E] rounded-t-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`cursor-pointer pb-3 px-2 text-sm sm:text-base font-bold uppercase tracking-wider transition-all relative shrink-0 ${
              activeTab === "settings"
                ? "text-[#66240E]"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Account Settings
            {activeTab === "settings" && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#66240E] rounded-t-full" />
            )}
          </button>
        </div>

        {/* Interaction Tabs */}
        <div key={activeTab} className="animate-fade-in-up">
          {activeTab === "achievements" && (
            <Achievements
              achievementView={achievementView}
              setAchievementView={setAchievementView}
              achievements={achievements}
              achievementsLoading={achievementsLoading}
              profilePoints={profilePoints}
              profileLevel={profileLevel}
              profileLoading={profileLoading}
            />
          )}
          {activeTab === "settings" && (
            <AccountSettings
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* Sub-component */
const ACHIEVEMENT_THEME_MAP = {
  "First Report": {
    icon: Search,
    iconColor: "text-blue-600",
    bgBubble: "bg-blue-50 border-blue-100",
  },
  "First Finder": {
    icon: Search,
    iconColor: "text-blue-600",
    bgBubble: "bg-blue-50 border-blue-100",
  },
  "Trusted User": {
    icon: Shield,
    iconColor: "text-indigo-600",
    bgBubble: "bg-indigo-50 border-indigo-100",
  },
  "Consistent Reporter": {
    icon: Award,
    iconColor: "text-purple-600",
    bgBubble: "bg-purple-50 border-purple-100",
  },
  "Helper Badge": {
    icon: Award,
    iconColor: "text-pink-600",
    bgBubble: "bg-pink-50 border-pink-100",
  },
  "Good Samaritan": {
    icon: Heart,
    iconColor: "text-pink-600",
    bgBubble: "bg-pink-50 border-pink-100",
  },
  "Community Hero": {
    icon: Trophy,
    iconColor: "text-amber-600",
    bgBubble: "bg-amber-50 border-amber-100",
  },
  "Active Reporter": {
    icon: CircleStar,
    iconColor: "text-orange-600",
    bgBubble: "bg-orange-50 border-orange-100",
  },
  "Detail Master": {
    icon: PenTool,
    iconColor: "text-purple-600",
    bgBubble: "bg-purple-50 border-purple-100",
  },
  "Loyal BALIK User": {
    icon: Shield,
    iconColor: "text-indigo-600",
    bgBubble: "bg-indigo-50 border-indigo-100",
  },
  "Persistent Seeker": {
    icon: Repeat,
    iconColor: "text-teal-600",
    bgBubble: "bg-teal-50 border-teal-100",
  },
  "Eco Warrior": {
    icon: Leaf,
    iconColor: "text-emerald-600",
    bgBubble: "bg-emerald-50 border-emerald-100",
  },
};

function Achievements({
  achievementView,
  setAchievementView,
  achievements,
  achievementsLoading,
  profilePoints,
  profileLevel,
  profileLoading,
}) {
  return (
    <div className="space-y-6">
      {/* System Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Accumulated Points"
          value={profileLoading ? "..." : profilePoints.toLocaleString()}
          desc="Points towards next status tier"
          icon={Sparkles}
          color="bg-amber-50 text-amber-700 border-amber-200"
        />
        <StatCard
          title="Current Status Level"
          value={profileLoading ? "..." : `Level ${profileLevel}`}
          desc="Higher tier expands permissions"
          icon={Trophy}
          color="bg-purple-50 text-purple-700 border-purple-200"
        />
        <StatCard
          title="Unlocked Badges"
          value={
            achievementsLoading
              ? "..."
              : `${achievements.filter((a) => a.unlocked).length} / ${achievements.length}`
          }
          desc="Badges earned through community acts"
          icon={Award}
          color="bg-emerald-50 text-emerald-700 border-emerald-200"
        />
      </div>

      {/* Badges Grid Panel */}
      <div className="bg-white rounded-4xl p-6 sm:p-6 shadow-sm border border-[#E2DCD0]">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6">
          <h3 className="text-base sm:text-lg font-extrabold text-[#66240E] uppercase tracking-wider flex items-center gap-2">
            <CircleStar className="w-6 h-6 sm:w-[18px] sm:h-[18px] text-amber-500 shrink-0" />
            Earned System Badges
          </h3>

          <span className="w-fit text-[10px] sm:text-xs bg-slate-100 text-slate-600 font-bold px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-200 uppercase tracking-widest shadow-sm">
            {achievementsLoading
              ? "..."
              : `${achievements.filter((a) => a.unlocked).length} / ${achievements.length} Done`}
          </span>
        </div>

        {/* Content Grid */}
        {achievementsLoading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="animate-spin text-[#2C4A52]" size={28} />
          </div>
        ) : achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const theme = ACHIEVEMENT_THEME_MAP[achievement.title] || {
                icon: Award,
                iconColor: "text-slate-600",
                bgBubble: "bg-slate-50 border-slate-200",
              };
              const Icon = theme.icon;
              const isUnlocked = achievement.unlocked;

              const hasProgressData =
                achievement.progress !== undefined &&
                achievement.total !== undefined;
              const progressPercentage = hasProgressData
                ? (achievement.progress / achievement.total) * 100
                : 0;

              return (
                <div
                  key={achievement.id}
                  className={`group border rounded-3xl p-4 transition-all duration-300 hover:shadow-md flex flex-col justify-between ${
                    isUnlocked
                      ? "bg-gradient-to-br from-emerald-50/30 to-white border-emerald-200 hover:border-emerald-300"
                      : "bg-white border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    {/* Icon Container */}
                    <div
                      className={`p-2.5 rounded-2xl border flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                        isUnlocked
                          ? theme.bgBubble
                          : "bg-gray-50 border-gray-100 text-gray-400"
                      }`}
                    >
                      <Icon
                        size={20}
                        strokeWidth={isUnlocked ? 2.5 : 2}
                        className={
                          isUnlocked ? theme.iconColor : "text-gray-400"
                        }
                      />
                    </div>

                    {/* Content Area */}
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <p
                          className={`text-sm font-bold truncate leading-tight ${
                            isUnlocked ? "text-gray-800" : "text-gray-500"
                          }`}
                        >
                          {achievement.title}
                        </p>

                        {/* Top Right Status badge */}
                        {isUnlocked ? (
                          <CheckCircle2
                            size={16}
                            className="text-emerald-500 flex-shrink-0 mt-0.5 animate-pulse"
                            style={{ animationDuration: "4s" }}
                          />
                        ) : (
                          <Lock
                            size={14}
                            className="text-gray-300 flex-shrink-0 mt-0.5"
                          />
                        )}
                      </div>

                      <p className="text-xs text-gray-400 mt-1 leading-relaxed mb-3 line-clamp-2">
                        {achievement.description ||
                          "System milestone progress tracker"}
                      </p>

                      {/* Status / Progress Footer */}
                      {isUnlocked ? (
                        <span className="inline-flex text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                          Unlocked
                        </span>
                      ) : hasProgressData ? (
                        <div className="mt-auto">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                              <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 whitespace-nowrap self-end sm:self-center">
                              {achievement.progress} / {achievement.total} (
                              {Math.round(progressPercentage)}%)
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-400 font-medium italic text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            No system achievements found.
          </p>
        )}
      </div>

      {/* Sub Views Switches */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="relative flex bg-slate-100/60 rounded-full p-1.5 shrink-0 w-full sm:w-[360px] shadow-[inset_0_3px_8px_rgba(0,0,0,0.08)] border border-slate-200/50 transition-all duration-300">
          <div
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-br from-[#2C4A52]/90 to-[#1b3036]/95 backdrop-blur-md border border-white/25 rounded-full shadow-[0_4px_12px_rgba(44,74,82,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-transform duration-[380ms] ease-[cubic-bezier(0.25,1.25,0.4,1)] z-0 ${
              achievementView === "challenges"
                ? "translate-x-0"
                : "translate-x-full"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 pointer-events-none rounded-full" />
          </div>

          {/* Challenges Button */}
          <button
            onClick={() => setAchievementView("challenges")}
            className={`group cursor-pointer relative z-10 flex-1 py-3 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-widest transition-all duration-300 transform active:scale-[0.97] outline-none select-none ${
              achievementView === "challenges"
                ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                : "text-[#2C4A52]/70 hover:text-[#2C4A52]"
            }`}
          >
            <span className="inline-block transition-transform duration-200 group-hover:scale-105">
              Challenges
            </span>
          </button>

          {/* Certificates Button */}
          <button
            onClick={() => setAchievementView("certificates")}
            className={`group cursor-pointer relative z-10 flex-1 py-3 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-widest transition-all duration-300 transform active:scale-[0.97] outline-none select-none ${
              achievementView === "certificates"
                ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                : "text-[#2C4A52]/70 hover:text-[#2C4A52]"
            }`}
          >
            <span className="inline-block transition-transform duration-200 group-hover:scale-105">
              Certificates
            </span>
          </button>
        </div>
      </div>

      <div key={achievementView} className="animate-fade-in-up">
        {achievementView === "challenges" && <ChallengesSection />}
        {achievementView === "certificates" && <CertificatesSection />}
      </div>
    </div>
  );
}

function StatCard({
  title = "",
  subtitle,
  desc,
  value,
  icon: Icon,
  color = "slate",
  trend = "Last 7 Days",
  index = 0,
}) {
  const [animatedValue, setAnimatedValue] = useState("0");
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  // Expanded check to match "Level", "Lv.", "LV", etc.
  const isLevelCard =
    title.toLowerCase().includes("level") ||
    title.toLowerCase().includes("lv") ||
    String(value).toLowerCase().includes("level") ||
    String(value).toLowerCase().includes("lv");

  useEffect(() => {
    if (!window.IntersectionObserver) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }, 
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Count-Up Logic for Points / Badges
  useEffect(() => {
    if (!isVisible || isLevelCard || value == null) return;

    const valStr = String(value);
    const match = valStr.match(/^(.*?)([\d.,]+)(.*)$/);

    if (!match) {
      setAnimatedValue(valStr);
      return;
    }

    const [, prefix, numStr, suffix] = match;
    const targetNum = parseFloat(numStr.replace(/,/g, ""));

    if (isNaN(targetNum)) {
      setAnimatedValue(valStr);
      return;
    }

    const hasComma = numStr.includes(",");
    const isFloat = numStr.includes(".") && !numStr.endsWith(".");
    const decimals = isFloat ? numStr.split(".")[1].length : 0;

    let startTimestamp = null;
    const duration = 1800;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentNum = targetNum * ease;

      let formattedNum = isFloat
        ? currentNum.toFixed(decimals)
        : Math.round(currentNum).toString();

      if (hasComma) {
        formattedNum = Number(formattedNum).toLocaleString("en-US");
      }

      setAnimatedValue(`${prefix}${formattedNum}${suffix}`);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [value, isVisible, isLevelCard]);

  const themes = {
    amber: {
      glowA: "bg-amber-400",
      glowB: "bg-orange-400",
      iconGrad: "from-amber-400 to-orange-500",
      textGrad: "from-slate-800 to-amber-700",
      chartColor: "text-amber-500",
    },
    purple: {
      glowA: "bg-purple-400",
      glowB: "bg-indigo-400",
      iconGrad: "from-purple-400 to-indigo-500",
      textGrad: "from-slate-800 to-purple-700",
      chartColor: "text-purple-500",
    },
    emerald: {
      glowA: "bg-emerald-400",
      glowB: "bg-teal-400",
      iconGrad: "from-emerald-400 to-teal-500",
      textGrad: "from-slate-800 to-emerald-700",
      chartColor: "text-emerald-500",
    },
    teal: {
      glowA: "bg-[#2C4A52]",
      glowB: "bg-teal-600",
      iconGrad: "from-teal-600 to-[#2C4A52]",
      textGrad: "from-slate-800 to-[#2C4A52]",
      chartColor: "text-[#2C4A52]",
    },
    slate: {
      glowA: "bg-slate-300",
      glowB: "bg-slate-400",
      iconGrad: "from-slate-400 to-slate-500",
      textGrad: "from-slate-700 to-slate-900",
      chartColor: "text-slate-500",
    },
  };

  const activeTheme =
    Object.keys(themes).find((t) => color.toLowerCase().includes(t)) || "slate";
  const theme = themes[activeTheme];
  const displaySubtitle = subtitle || desc;

  return (
    <div
      ref={cardRef}
      className="group relative w-full rounded-[2rem] bg-white border border-[#E8E3D9] shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-500 overflow-hidden animate-slide-up-fade flex flex-col"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "both",
      }}
    >
      <div
        className={`absolute -top-10 -right-10 w-40 h-40 ${theme.glowA} rounded-full mix-blend-multiply filter blur-[3rem] opacity-10 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none`}
      />
      <div
        className={`absolute -bottom-10 -left-10 w-40 h-40 ${theme.glowB} rounded-full mix-blend-multiply filter blur-[3rem] opacity-10 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none`}
      />
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

      <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full justify-between gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-lg sm:text-xl font-black text-slate-800 tracking-tight leading-tight break-words">
              {title}
            </p>
            <p className="text-[10px] sm:text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-relaxed break-words">
              {displaySubtitle}
            </p>
          </div>

          <div
            className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-[1.25rem] shrink-0 bg-gradient-to-br ${theme.iconGrad} shadow-inner shadow-white/30 ring-1 ring-black/5 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 mt-1`}
          >
            {Icon && (
              <Icon
                size={24}
                strokeWidth={2.25}
                className="text-white drop-shadow-md sm:w-7 sm:h-7"
              />
            )}
          </div>
        </div>

        <div className="flex items-end justify-between mt-auto gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-3xl sm:text-3xl lg:text-4xl font-black tracking-tighter drop-shadow-sm leading-none pb-1 break-words">
              {isLevelCard ? (
                <span className="block overflow-hidden pb-1">
                  <span
                    className={`block bg-clip-text text-transparent bg-gradient-to-br ${theme.textGrad} transition-transform duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isVisible ? "translate-y-0" : "translate-y-[110%]"
                    }`}
                  >
                    {value}
                  </span>
                </span>
              ) : (
                <span
                  className={`bg-clip-text text-transparent bg-gradient-to-br ${theme.textGrad}`}
                >
                  {animatedValue}
                </span>
              )}
            </h3>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="text-[10px] font-extrabold text-slate-300 mb-1.5 uppercase tracking-widest">
              {trend}
            </span>
            <svg
              className="w-16 h-5 sm:w-20 sm:h-6 opacity-30 group-hover:opacity-100 transition-opacity duration-500"
              viewBox="0 0 100 25"
              preserveAspectRatio="none"
            >
              <path
                d="M0 20 C 20 20, 30 5, 50 15 C 70 25, 80 5, 100 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                className={`text-slate-200 group-hover:${theme.chartColor} transition-colors duration-500`}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChallengesSection() {
  const challenges = [
    {
      title: "Honest Finder Milestone",
      progress: 75,
      target: "4/5 Returned",
      desc: "Successfully match and hand off items.",
    },
    {
      title: "Precise Coordinator",
      progress: 40,
      target: "2/5 Verified",
      desc: "Submit matching details on listings.",
    },
  ];

  return (
    <div className="bg-white border border-[#E2DCD0] rounded-4xl p-5 sm:p-6 shadow-sm space-y-4">
      <h3 className="text-base sm:text-lg font-extrabold text-[#66240E] uppercase tracking-wider flex items-center gap-2">
        <SquareActivity size={16} /> Active System Challenges
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenges.map((c, i) => (
          <div
            key={i}
            className="p-5 border border-slate-100 rounded-3xl bg-slate-50/50 space-y-3.5"
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="font-extrabold text-sm text-slate-800">
                  {c.title}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {c.desc}
                </p>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#2C4A52] whitespace-nowrap bg-[#2C4A52]/10 px-2 py-1 rounded-md">
                {c.target}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#2C4A52] to-[#45727d]"
                style={{ width: `${c.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CertificatesSection() {
  return (
    <div className="bg-white border border-[#E2DCD0] rounded-4xl p-5 sm:p-6 shadow-sm space-y-4">
      <h3 className="text-base sm:text-lg font-extrabold text-[#66240E] uppercase tracking-wider flex items-center gap-2">
        <Award size={16} /> Verifiable Certificates
      </h3>
      <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
        <div className="p-4 bg-slate-50 text-slate-300 rounded-full border border-slate-100">
          <Lock size={28} />
        </div>
        <p className="font-bold text-sm sm:text-base text-slate-700">
          No Certificates Released Yet
        </p>
        <p className="text-xs text-slate-500 max-w-sm font-medium leading-relaxed">
          Maintain a high successful validation rate to automatically download
          system-stamped integrity records.
        </p>
      </div>
    </div>
  );
}

/* Sub-component */
function AccountSettings({ activeSection, setActiveSection }) {
  const menuItems = [
    { id: "profile", label: "Profile Settings", icon: UserRound },
    { id: "security", label: "Security & Privacy", icon: ShieldUser },
    { id: "preferences", label: "Account Preferences", icon: Settings2 },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className="w-full lg:w-64 grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col bg-white rounded-4xl border border-[#E2DCD0] p-2 gap-1 shadow-sm shrink-0">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSelected = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`cursor-pointer group relative w-full flex items-center gap-3.5 px-4 py-3 sm:py-3.5 rounded-3xl text-base sm:text-[13px] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] outline-none text-left overflow-hidden ${
                isSelected
                  ? "bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] text-[#66240E] font-extrabold"
                  : "bg-transparent border border-transparent text-slate-500 hover:bg-white/40 hover:backdrop-blur-sm hover:border-white/50 hover:text-slate-800 hover:shadow-sm"
              }`}
            >
              <div
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 rounded-r-full transition-all duration-500 bg-gradient-to-b from-[#66240E] to-[#8a3315] ${
                  isSelected ? "h-3/5 opacity-100" : "h-0 opacity-0"
                }`}
              />

              <div
                className={`flex items-center justify-center p-2 rounded-xl transition-all duration-500 ${
                  isSelected
                    ? "bg-gradient-to-br from-[#66240E] to-[#4a190a] text-[#FFF9F0] shadow-md shadow-[#66240E]/20 scale-100"
                    : "bg-slate-100/50 text-slate-400 group-hover:bg-white/80 group-hover:text-[#66240E]/70 group-hover:scale-105"
                }`}
              >
                <Icon size={18} strokeWidth={isSelected ? 2.5 : 2} />
              </div>

              {/* Label */}
              <span className="relative z-10 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 w-full bg-white rounded-4xl border border-[#E2DCD0] p-6 sm:p-6 md:p-8 shadow-sm overflow-hidden">
        <div key={activeSection} className="animate-fade-in-up">
          {activeSection === "profile" && <ProfileSettings />}
          {activeSection === "security" && <SecurityAndPrivacy />}
          {activeSection === "preferences" && <AccountPreferences />}
        </div>
      </div>
    </div>
  );
}

/* Sub-sections */
function ProfileSettings() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [avatar, setAvatar] = useState(user?.user_metadata?.avatar_url || null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [gender, setGender] = useState(user?.user_metadata?.gender || "");
  const [firstName, setFirstName] = useState(
    user?.user_metadata?.full_name?.split(" ")[0] || "",
  );
  const [lastName, setLastName] = useState(
    user?.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "",
  );
  const [email, setEmail] = useState(user?.email || "");
  const [contact, setContact] = useState(
    user?.user_metadata?.mobile_number || "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  // PH Phone Validator
  const isValidPHNumber = (num) => {
    const cleanNum = num.replace(/\s/g, "");
    return /^(09|\+639)\d{9}$/.test(cleanNum);
  };

  const handlePhoneChange = (e) => {
    // Restrict input to digits and '+' only
    let val = e.target.value.replace(/[^\d+]/g, "");
    if (val.length <= 13) setContact(val); // +639XXXXXXXXX is 13 chars max
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus({ type: "", message: "" });

    // Validate Contact
    if (contact && !isValidPHNumber(contact)) {
      setStatus({
        type: "error",
        message:
          "Validation Failed: Please enter a valid Philippine mobile number (e.g., 09123456789 or +639123456789).",
      });
      setIsSaving(false);
      return;
    }

    try {
      let finalUrl = avatar;
      if (avatarFile) {
        finalUrl = await userService.uploadAvatar(user.id, avatarFile);
      }
      await userService.updateProfile(user.id, {
        full_name: `${firstName} ${lastName}`.trim(),
        mobile_number: contact,
        gender,
        avatar_url: finalUrl,
      });
      setStatus({
        type: "success",
        message: "Profile parameters saved successfully!",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Failed execution loop sync.",
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatus({ type: "", message: "" }), 4000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
          Edit Your Profile
        </h2>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Keep parameters synchronized to ensure fast validation matching rules.
        </p>
      </div>

      {status.message && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
            status.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {status.message}
        </div>
      )}

      {/* Profile Input */}
      <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50/50 p-5 rounded-3xl border border-slate-100">
        <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#66240E] to-[#997C68] text-white flex items-center justify-center font-black text-3xl border-2 border-white shadow-md overflow-hidden shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            firstName[0]
          )}
        </div>
        <div className="space-y-2.5 text-center sm:text-left w-full sm:w-auto">
          <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            Avatar Representation File
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer px-5 py-2.5 bg-white border border-slate-200 rounded-3xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
            >
              <ImagePlus size={16} /> Upload New File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <p className="text-[11px] font-medium text-slate-400">
            Supported types: JPG, PNG. Recommended limit 2MB.
          </p>
        </div>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormInput
          label="Given First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Juan"
        />
        <FormInput
          label="Registered Surname"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Dela Cruz"
        />
        <FormInput
          label="Account Contact Link Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@domain.com"
          disabled
          icon={Mail}
        />
        <FormInput
          label="Verified Phone Link"
          value={contact}
          onChange={handlePhoneChange}
          placeholder="09123456789 or +639..."
          icon={Phone}
        />
      </div>

      {/* Gender Radio */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Gender Orientation Parameter (Optional)
        </label>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          {["Male", "Female", "Prefer not to say"].map((opt) => (
            <label
              key={opt}
              className={`cursor-pointer flex items-center gap-2 border px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                gender === opt
                  ? "bg-[#2C4A52]/10 border-[#2C4A52] text-[#2C4A52]"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="gender"
                value={opt}
                checked={gender === opt}
                onChange={(e) => setGender(e.target.value)}
                className="cursor-pointer accent-[#2C4A52] w-4 h-4"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* Save Trigger Layout */}
      <div className="flex justify-end pt-5 border-t border-slate-100">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="cursor-pointer w-full sm:w-auto px-8 py-3.5 bg-[#2C4A52] text-white font-bold rounded-3xl text-xs sm:text-sm uppercase tracking-wider shadow-md hover:bg-[#1f343a] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
        >
          {isSaving && <Loader2 className="animate-spin" size={16} />}
          {isSaving ? "Syncing Parameters..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  icon: Icon,
}) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full text-sm font-medium border border-slate-200 rounded-xl px-4 py-3.5 outline-none transition-all focus:border-[#2C4A52] focus:ring-2 focus:ring-[#2C4A52]/10 ${
            Icon ? "pl-11" : ""
          } ${disabled ? "bg-slate-50 text-slate-400 cursor-not-allowed" : "text-slate-700 bg-white"}`}
        />
      </div>
    </div>
  );
}

function SecurityAndPrivacy() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [is2FA, setIs2FA] = useState(
    user?.user_metadata?.two_factor_enabled || false,
  );
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMsg({
        type: "error",
        text: "Password inputs do not match standard parameters.",
      });
      return;
    }
    setUpdating(true);
    try {
      await userService.updatePassword(newPassword);
      setMsg({
        type: "success",
        text: "Security credentials rotated successfully!",
      });
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setIsModalOpen(false), 2000);
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
          Security Credentials & Privacy
        </h2>
        <p className="text-base font-medium text-slate-500 mt-1">
          Configure parameters securing access credentials to your systemic data
          nodes.
        </p>
      </div>

      {msg.text && !isModalOpen && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-bold border ${msg.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"}`}
        >
          {msg.text}
        </div>
      )}

      {/* Info Blocks Matrix */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-5 sm:p-6 space-y-4">
        <h3 className="text-sm sm:text-base font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <UserCheck size={16} className="text-slate-500" /> Active System
          Session Log
        </h3>
        <ul className="text-base sm:text-lg font-medium text-slate-500 space-y-3 list-none pl-0">
          <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-slate-200/50 pb-3 gap-1">
            <span>Last Auth Validation Check</span>
            <strong className="text-slate-800">
              {user?.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleString()
                : "Recently Checked"}
            </strong>
          </li>
          <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span>Encryption Layer Node Connection</span>
            <strong className="text-emerald-700 uppercase tracking-wider text-[10px] sm:text-xs font-bold bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 self-start sm:self-auto">
              TLS 1.3 Active
            </strong>
          </li>
        </ul>
      </div>

      {/* Operational Triggers Frame */}
      <div className="space-y-4 pt-2">
        <h3 className="text-base font-bold uppercase tracking-wider text-slate-400">
          Security Actions
        </h3>

        {/* Password Modification Option */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border border-slate-200 rounded-2xl bg-white shadow-sm">
          <div>
            <p className="text-base font-extrabold text-slate-800">
              Reset Your Password
            </p>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Change parameters regularly to secure ecosystem validation nodes.
            </p>
          </div>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setMsg({ type: "", text: "" });
            }}
            className="cursor-pointer px-5 py-3 bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-3xl text-xs sm:text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Lock size={14} /> Modify Password
          </button>
        </div>

        {/* Two Factor Configuration */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border border-slate-200 rounded-2xl bg-white shadow-sm">
          <div>
            <p className="text-base font-extrabold text-slate-800">
              Two-Factor Step-Up Validation
            </p>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Appends secondary out-of-band mobile verification parameter
              verification requirements.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIs2FA(!is2FA)}
            className={`group relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-300 ease-in-out outline-none focus:ring-2 focus:ring-[#2C4A52]/20 focus:ring-offset-2 self-start sm:self-center ${
              is2FA
                ? "bg-gradient-to-r from-[#2C4A52] to-[#3d6671] shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]"
                : "bg-slate-100 border border-slate-200/80 shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]"
            }`}
          >
            {/* Screen Reader Accessibility */}
            <span className="sr-only">Toggle 2FA</span>

            <span
              className={`pointer-events-none relative inline-block h-5.5 w-5.5 transform rounded-full bg-white transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-[0_2px_5px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.05)] ${
                is2FA ? "translate-x-6" : "translate-x-0"
              } group-active:w-7 ${
                is2FA ? "group-active:translate-x-4.5" : ""
              }`}
            >
              <span className="absolute top-0.5 inset-x-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent rounded-full pointer-events-none" />
            </span>
          </button>
        </div>
      </div>

      {/* Password Modal Overlay Implementation */}
      {isModalOpen &&
        typeof document !== "undefined" &&
        (() => {
          // 1. Evaluate rules inline so it stays contained in this block
          const validationRules = [
            {
              id: "length",
              label: "At least 12 characters",
              valid: newPassword.length >= 12,
            },
            {
              id: "upper",
              label: "One uppercase letter",
              valid: /[A-Z]/.test(newPassword),
            },
            {
              id: "lower",
              label: "One lowercase letter",
              valid: /[a-z]/.test(newPassword),
            },
            {
              id: "number",
              label: "One number",
              valid: /[0-9]/.test(newPassword),
            },
            {
              id: "special",
              label: "One special character",
              valid: /[^A-Za-z0-9]/.test(newPassword),
            },
            {
              id: "unique",
              label: "8 unique characters",
              valid: new Set(newPassword).size >= 8,
            },
          ];

          const allRulesPassed = validationRules.every((r) => r.valid);

          return createPortal(
            <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#1a0500]/60 backdrop-blur-sm transition-opacity">
              <div className="relative w-full max-w-md bg-gradient-to-b from-[#FFF9F0] to-white rounded-t-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-[0_-15px_50px_rgba(102,36,14,0.15)] sm:shadow-2xl border-t sm:border border-[#66240E]/10 overflow-hidden animate-slide-up-fade text-left">
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#66240E]/5 rounded-full blur-[3rem] pointer-events-none" />
                <div className="w-10 h-1.5 bg-[#66240E]/10 rounded-full mx-auto mb-5 sm:hidden relative z-10" />

                {/* Header */}
                <div className="relative z-10 mb-6">
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#66240E] uppercase tracking-wider flex items-center gap-2.5">
                    <Lock size={20} className="text-[#66240E]" />
                    Modify Your Password
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1.5">
                    Provide alpha-numerical characters to define uniqueness
                    settings.
                  </p>
                </div>

                {/* Status Message */}
                {msg.text && (
                  <div
                    className={`p-3 mb-5 rounded-xl text-sm font-bold border relative z-10 ${
                      msg.type === "success"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-rose-50 border-rose-200 text-rose-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                )}

                {/* Form intercepts submission to check rules first */}
                <form
                  className="relative z-10 space-y-5"
                  onSubmit={(e) => {
                    if (!allRulesPassed) {
                      e.preventDefault();
                      setMsg({
                        type: "error",
                        text: "Security thresholds not met. Please fulfill all password requirements.",
                      });
                      return;
                    }
                    if (newPassword !== confirmPassword) {
                      e.preventDefault();
                      setMsg({
                        type: "error",
                        text: "Verification mismatch. Passwords do not match.",
                      });
                      return;
                    }
                    // If valid, pass the event to your original handler
                    handleUpdatePassword(e);
                  }}
                >
                  {/* New Password Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#66240E]/70 uppercase tracking-widest ml-1">
                      New Password
                    </label>
                    <div className="relative group">
                      <input
                        type={showPass ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full text-sm font-semibold text-slate-800 bg-white border border-[#66240E]/20 rounded-3xl pl-4 pr-11 py-3.5 outline-none transition-all focus:border-[#66240E] focus:ring-4 focus:ring-[#66240E]/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="cursor-pointer absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-[#66240E]"
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Real-Time Validation Checklist */}
                  <div className="bg-white/60 border border-[#66240E]/10 rounded-xl p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                      {validationRules.map((rule, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                              newPassword.length === 0
                                ? "bg-slate-50 border-slate-200"
                                : rule.valid
                                  ? "bg-[#66240E] border-[#66240E] text-[#FFF9F0]"
                                  : "bg-rose-50 border-rose-200 text-rose-500"
                            }`}
                          >
                            {newPassword.length > 0 && rule.valid && (
                              <Check size={10} strokeWidth={4} />
                            )}
                            {newPassword.length > 0 && !rule.valid && (
                              <X size={10} strokeWidth={3} />
                            )}
                          </div>
                          <span
                            className={`text-[10px] sm:text-[11px] font-bold tracking-tight ${
                              newPassword.length === 0
                                ? "text-slate-400"
                                : rule.valid
                                  ? "text-[#66240E]"
                                  : "text-rose-500"
                            }`}
                          >
                            {rule.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#66240E]/70 uppercase tracking-widest ml-1">
                      Re-enter Verification Token
                    </label>
                    <input
                      type={showPass ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full text-sm font-semibold text-slate-800 bg-white border border-[#66240E]/20 rounded-3xl px-4 py-3.5 outline-none transition-all focus:border-[#66240E] focus:ring-4 focus:ring-[#66240E]/10"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="cursor-pointer w-full sm:w-auto px-6 py-3 bg-white border border-[#66240E]/20 text-[#66240E] font-bold rounded-3xl text-sm hover:bg-[#FFF9F0] transition-all"
                    >
                      Dismiss
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="cursor-pointer w-full sm:w-auto px-6 py-3 bg-[#66240E] shadow-[0_4px_12px_rgba(102,36,14,0.2)] text-[#FFF9F0] font-bold rounded-3xl text-sm hover:bg-[#4a190a] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      {updating && (
                        <Loader2 size={14} className="animate-spin" />
                      )}
                      {updating ? "Processing..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>,
            document.body,
          );
        })()}
    </div>
  );
}

function AccountPreferences() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200/70 pb-5">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Account Preferences
        </h2>
        <p className="text-sm sm:text-base font-medium text-slate-500 mt-1.5 leading-relaxed">
          Manage your linked institutional services and account security
          settings.
        </p>
      </div>

      {/* Microsoft Outlook Provider Card */}
      <div className="bg-white border border-slate-200/80 p-5 sm:p-7 rounded-[2rem] shadow-sm space-y-5">
        <h3 className="text-[11px] sm:text-base font-extrabold text-slate-400 uppercase tracking-widest ml-1">
          Institutional Identity
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-slate-50/50 border border-slate-100 p-4 sm:p-5 rounded-2xl transition-all hover:bg-slate-50">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            {/* Microsoft Logo Container */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white flex items-center justify-center border border-slate-200/70 shrink-0 shadow-sm">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7"
                viewBox="0 0 21 21"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
            </div>

            <div>
              <p className="text-base sm:text-lg font-extrabold text-slate-900">
                Microsoft Outlook
              </p>
              <p className="text-sm sm:text-base text-slate-500 font-medium mt-1 leading-snug">
                Connected via{" "}
                <span className="text-[#0078D4] font-bold">
                  @iskolarngbayan.pup.edu.ph
                </span>
              </p>
            </div>
          </div>

          <button className="cursor-pointer w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-white border border-slate-200 text-slate-700 text-sm sm:text-sm font-bold rounded-3xl hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] transition-all shadow-sm shrink-0">
            {user?.user_metadata?.provider === "microsoft"
              ? "Disconnect Link"
              : "Connect Webmail"}
          </button>
        </div>
      </div>

      {/* Danger Management */}
      <div className="border border-rose-200/60 bg-rose-50/30 p-5 sm:p-7 rounded-[2rem] space-y-6 sm:space-y-7">
        <div className="flex items-center gap-3 border-b border-rose-200/60 pb-4">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
            <AlertTriangle
              size={16}
              className="text-rose-600"
              strokeWidth={2.5}
            />
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-rose-900 tracking-tight">
            Danger Zone
          </h3>
        </div>

        <div className="space-y-6">
          {/* Deactivate Account */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="max-w-md">
              <p className="text-base sm:text-lg font-extrabold text-slate-900">
                Deactivate Account
              </p>
              <p className="text-sm sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
                Hide your profile and pause all system activity. You can easily
                reactivate by logging back in with your PUP webmail.
              </p>
            </div>
            <button className="cursor-pointer w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-white border border-slate-200 text-amber-700 font-extrabold rounded-3xl text-sm sm:text-base hover:bg-amber-50 hover:border-amber-200 hover:text-amber-800 active:scale-[0.98] transition-all shadow-sm shrink-0 flex justify-center items-center gap-2">
              <PauseCircle size={16} strokeWidth={2.5} /> Deactivate
            </button>
          </div>

          {/* Delete Account */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-rose-200/50">
            <div className="max-w-md">
              <p className="text-base sm:text-lg font-extrabold text-slate-900">
                Delete Account
              </p>
              <p className="text-sm sm:text-sm text-rose-600/80 font-semibold mt-1.5 leading-relaxed">
                Permanently remove your profile, data, and historical records.
                This action cannot be undone.
              </p>
            </div>
            <button className="cursor-pointer w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-rose-600 text-white font-extrabold rounded-3xl text-sm sm:text-sm hover:bg-rose-700 active:scale-[0.98] shadow-[0_4px_12px_rgba(225,29,72,0.25)] transition-all flex items-center justify-center gap-2 shrink-0">
              <Trash2 size={16} strokeWidth={2.5} /> Delete Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}