import {
  Search,
  Heart,
  Trophy,
  PenTool,
  Shield,
  Repeat,
  Leaf,
} from "lucide-react";

const achievements = [
  {
    title: "First Finder",
    description: "Report your first found item",
    icon: Search,
    unlocked: true,
  },
  {
    title: "Good Samaritan",
    description: "Help return 5 items",
    icon: Heart,
    unlocked: true,
  },
  {
    title: "Community Hero",
    description: "Help return 20 items",
    icon: Trophy,
    progress: 12,
    total: 20,
  },
  {
    title: "Detail Master",
    description: "Provide detailed descriptions for 10 items",
    icon: PenTool,
    unlocked: true,
  },
  {
    title: "Loyal BALIK User",
    description: "Active user for 3 consecutive months",
    icon: Shield,
    progress: 1,
    total: 3,
  },
  {
    title: "Persistent Seeker",
    description: "Log in and check item updates 5 times",
    icon: Repeat,
    progress: 2,
    total: 5,
  },
  {
    title: "Eco Warrior",
    description: "Choose digital reporting instead of printing posters",
    icon: Leaf,
    progress: 1,
    total: 3,
  },
];

export default function AchievementsPanel() {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="font-semibold mb-4">Achievements</h2>

      <div className="space-y-3">
        {achievements.map((a, i) => {
          const Icon = a.icon;
          const isUnlocked = a.unlocked;

          return (
            <div
              key={i}
              className={`border rounded-lg p-3 ${
                isUnlocked
                  ? "border-green-400 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex gap-3 items-start">
                {/* Icon */}
                <div
                  className={`p-2 rounded-full ${
                    isUnlocked ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <Icon
                    size={16}
                    className={
                      isUnlocked ? "text-green-600" : "text-gray-500"
                    }
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    {a.description}
                  </p>

                  {/* Status */}
                  {isUnlocked ? (
                    <p className="text-xs text-green-600 font-medium">
                      ✓ Unlocked
                    </p>
                  ) : (
                    <>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-400"
                          style={{
                            width: `${(a.progress / a.total) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {a.progress}/{a.total}
                      </p>
                    </>
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
