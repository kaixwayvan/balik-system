import {
  Trophy,
  HeartHandshake,
  Search,
  Medal,
  ArrowBigUpDash,
} from "lucide-react";

export default function OverviewCards() {
  const badges = [
    {
      name: "Good Samaritan",
      count: 0,
      icon: HeartHandshake,
      color: "text-rose-500 bg-rose-100",
    },
    {
      name: "Super Finder",
      count: 0,
      icon: Search,
      color: "text-blue-500 bg-blue-100",
    },
    {
      name: "Campus Finder",
      count: 0,
      icon: Medal,
      color: "text-purple-500 bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Points Card */}
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Points This Month</h3>
          <button className="cursor-pointer font-semibold text-sm text-green-600 hover:underline">
            View All
          </button>
        </div>

        <div className="flex flex-col justify-center items-center gap-1">
          <p className="text-3xl font-bold text-green-600">0</p>
          <p className="text-sm text-gray-500 mb-2">Total Points Awarded</p>
          <div className="flex justify-center items-center gap-1">
            <ArrowBigUpDash
              className="text-green-600"
              size={18}
              strokeWidth={2.4}
            />
            <p className="text-sm font-bold text-green-600">
              0% from last month
            </p>
          </div>
        </div>
      </div>

      {/* Top Finder */}
      <div className="bg-white rounded-xl p-6 text-center">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Top Finder</h3>
          <button className="cursor-pointer font-semibold text-sm text-green-600 hover:underline">
            View Leaderboard
          </button>
        </div>

        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-gradient-to-b from-gray-200 to-gray-400 flex items-center justify-center">
            <Trophy className="text-white" size={36} strokeWidth={1.5} />
          </div>
        </div>

        <p className="mt-3 font-semibold">No data</p>
        <p className="text-sm text-gray-500">0 points</p>
      </div>

      {/* Earned Badges */}
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Most Earned Badge</h3>
          <button className="cursor-pointer font-semibold text-sm text-green-600 hover:underline">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {badges.map((badge, index) => {
            const Icon = badge.icon;

            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${badge.color}`}>
                    <Icon size={16} />
                  </div>

                  <span className="text-sm font-medium">{badge.name}</span>
                </div>

                <span className="text-sm font-semibold text-gray-600">
                  {badge.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
