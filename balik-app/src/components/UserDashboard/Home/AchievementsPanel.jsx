import {
  Search,
  Heart,
  Trophy,
  PenTool,
  Shield,
  Repeat,
  Leaf,
  CheckCircle2,
  Lock,
} from "lucide-react";

const achievements = [
  {
    title: "First Finder",
    description: "Report your first found item",
    icon: Search,
    iconColor: "text-blue-600",
    bgBubble: "bg-blue-50 border-blue-100",
    unlocked: true,
  },
  {
    title: "Good Samaritan",
    description: "Help return 5 items",
    icon: Heart,
    iconColor: "text-pink-600",
    bgBubble: "bg-pink-50 border-pink-100",
    unlocked: true,
  },
  {
    title: "Community Hero",
    description: "Help return 20 items",
    icon: Trophy,
    iconColor: "text-amber-600",
    bgBubble: "bg-amber-50 border-amber-100",
    progress: 12,
    total: 20,
  },
  {
    title: "Detail Master",
    description: "Provide detailed descriptions for 10 items",
    icon: PenTool,
    iconColor: "text-purple-600",
    bgBubble: "bg-purple-50 border-purple-100",
    unlocked: true,
  },
  {
    title: "Loyal BALIK User",
    description: "Active user for 3 consecutive months",
    icon: Shield,
    iconColor: "text-indigo-600",
    bgBubble: "bg-indigo-50 border-indigo-100",
    progress: 1,
    total: 3,
  },
  {
    title: "Persistent Seeker",
    description: "Log in and check item updates 5 times",
    icon: Repeat,
    iconColor: "text-teal-600",
    bgBubble: "bg-teal-50 border-teal-100",
    progress: 2,
    total: 5,
  },
  {
    title: "Eco Warrior",
    description: "Choose digital reporting instead of printing posters",
    icon: Leaf,
    iconColor: "text-emerald-600",
    bgBubble: "bg-emerald-50 border-emerald-100",
    progress: 1,
    total: 3,
  },
];

export default function AchievementsPanel() {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-bold text-gray-800 text-lg">Achievements</h2>
        <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-full border border-slate-200">
          {achievements.filter(a => a.unlocked).length} / {achievements.length} Done
        </span>
      </div>

      <div className="space-y-3">
        {achievements.map((a, i) => {
          const Icon = a.icon;
          const isUnlocked = a.unlocked;
          
          const progressPercentage = !isUnlocked ? (a.progress / a.total) * 100 : 100;

          return (
            <div
              key={i}
              className={`group border rounded-2xl p-3.5 transition-all duration-300 hover:shadow-md ${
                isUnlocked 
                  ? "bg-gradient-to-r from-emerald-50/30 to-white border-emerald-200 hover:border-emerald-300" 
                  : "bg-white border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className="flex gap-3.5 items-start">
                
                {/* Icon Container */}
                <div className={`p-2.5 rounded-xl border flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                  isUnlocked ? a.bgBubble : "bg-gray-50 border-gray-100 text-gray-400"
                }`}>
                  <Icon size={18} strokeWidth={isUnlocked ? 2.5 : 2} className={isUnlocked ? a.iconColor : "text-gray-400"} />
                </div>

                {/* Content Area */}
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <p className={`text-sm font-bold truncate leading-tight ${isUnlocked ? "text-gray-800" : "text-gray-500"}`}>
                      {a.title}
                    </p>
                    
                    {/* Status badge */}
                    {isUnlocked ? (
                      <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5 animate-pulse" style={{ animationDuration: '4s' }} />
                    ) : (
                      <Lock size={12} className="text-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-1 leading-normal mb-2.5">
                    {a.description}
                  </p>

                  {isUnlocked ? (
                    <span className="inline-flex text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      Unlocked
                    </span>
                  ) : (
                    <div className="mt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden border border-gray-50">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 whitespace-nowrap self-end sm:self-center">
                          {a.progress} / {a.total} ({Math.round(progressPercentage)}%)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}