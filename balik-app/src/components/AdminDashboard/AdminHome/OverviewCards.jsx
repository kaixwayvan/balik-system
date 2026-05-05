import {
  Trophy,
  HeartHandshake,
  Search,
  Medal,
  ArrowBigUpDash,
<<<<<<< HEAD
  ArrowBigDownDash
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";

export default function OverviewCards() {
  const [data, setData] = useState({
    totalPoints: 0,
    growth: 0,
    topFinderName: "No Finders Yet",
    topFinderPoints: 0,
    badges: [
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
    ]
  });

  useEffect(() => {
    async function fetchOverview() {
      try {
        const { data: items, error } = await supabase
          .from('items')
          .select('created_at, metadata')
          .eq('type', 'found');

        if (error) throw error;

        let thisMonthCount = 0;
        let lastMonthCount = 0;
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const userCounts = {};
        let topFinder = { name: "No Finders Yet", count: 0 };

        items.forEach(item => {
          const d = new Date(item.created_at);
          if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
            thisMonthCount++;
          } else if (
            d.getMonth() === (currentMonth === 0 ? 11 : currentMonth - 1) &&
            d.getFullYear() === (currentMonth === 0 ? currentYear - 1 : currentYear)
          ) {
            lastMonthCount++;
          }

          const reporterName = item.metadata?.reporter?.name || "Unknown";
          if (reporterName !== "Anonymous" && !item.metadata?.is_anonymous) {
            userCounts[reporterName] = (userCounts[reporterName] || 0) + 1;
            if (userCounts[reporterName] > topFinder.count) {
              topFinder = { name: reporterName, count: userCounts[reporterName] };
            }
          }
        });

        const POINTS_PER_ITEM = 50;
        const totalPoints = items.length * POINTS_PER_ITEM;
        const thisMonthPoints = thisMonthCount * POINTS_PER_ITEM;
        const lastMonthPoints = lastMonthCount * POINTS_PER_ITEM;

        let growth = 0;
        if (lastMonthPoints > 0) {
          growth = Math.round(((thisMonthPoints - lastMonthPoints) / lastMonthPoints) * 100);
        } else if (thisMonthPoints > 0) {
          growth = 100;
        }

        let goodSamaritan = 0;
        let superFinder = 0;
        let campusFinder = 0;

        Object.values(userCounts).forEach(count => {
          if (count >= 1) goodSamaritan++;
          if (count >= 5) superFinder++;
          if (count >= 10) campusFinder++;
        });

        setData({
          totalPoints,
          growth,
          topFinderName: topFinder.name,
          topFinderPoints: topFinder.count * POINTS_PER_ITEM,
          badges: [
            { name: "Good Samaritan", count: goodSamaritan, icon: HeartHandshake, color: "text-rose-500 bg-rose-100" },
            { name: "Super Finder", count: superFinder, icon: Search, color: "text-blue-500 bg-blue-100" },
            { name: "Campus Finder", count: campusFinder, icon: Medal, color: "text-purple-500 bg-purple-100" }
          ]
        });

      } catch (err) {
        console.error("Error fetching overview data:", err);
      }
    }
    fetchOverview();
  }, []);
=======
} from "lucide-react";

export default function OverviewCards() {
  const badges = [
    {
      name: "Good Samaritan",
      count: 24,
      icon: HeartHandshake,
      color: "text-rose-500 bg-rose-100",
    },
    {
      name: "Super Finder",
      count: 8,
      icon: Search,
      color: "text-blue-500 bg-blue-100",
    },
    {
      name: "Campus Finder",
      count: 3,
      icon: Medal,
      color: "text-purple-500 bg-purple-100",
    },
  ];
>>>>>>> a5afc5cb (ADMIN to QR. QR not yet finished)

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Points Card */}
<<<<<<< HEAD
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Points Overview</h3>
=======
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Points This Month</h3>
>>>>>>> a5afc5cb (ADMIN to QR. QR not yet finished)
          <button className="cursor-pointer font-semibold text-sm text-green-600 hover:underline">
            View All
          </button>
        </div>

        <div className="flex flex-col justify-center items-center gap-1">
<<<<<<< HEAD
          <p className="text-3xl font-bold text-green-600">
            {data.totalPoints.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mb-2">Total Points Awarded</p>
          <div className="flex justify-center items-center gap-1">
            {data.growth >= 0 ? (
              <ArrowBigUpDash className="text-green-600" size={18} strokeWidth={2.4} />
            ) : (
              <ArrowBigDownDash className="text-red-600" size={18} strokeWidth={2.4} />
            )}
            <p className={`text-sm font-bold ${data.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.growth >= 0 ? '+' : ''}{data.growth}% from last month
=======
          <p className="text-3xl font-bold text-green-600">2,450</p>
          <p className="text-sm text-gray-500 mb-2">Total Points Awarded</p>
          <div className="flex justify-center items-center gap-1">
            <ArrowBigUpDash
              className="text-green-600"
              size={18}
              strokeWidth={2.4}
            />
            <p className="text-sm font-bold text-green-600">
              +18% from last month
>>>>>>> a5afc5cb (ADMIN to QR. QR not yet finished)
            </p>
          </div>
        </div>
      </div>

      {/* Top Finder */}
<<<<<<< HEAD
      <div className="bg-white rounded-xl p-6 text-center shadow-md">
=======
      <div className="bg-white rounded-xl p-6 text-center">
>>>>>>> a5afc5cb (ADMIN to QR. QR not yet finished)
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Top Finder</h3>
          <button className="cursor-pointer font-semibold text-sm text-green-600 hover:underline">
            View Leaderboard
          </button>
        </div>

        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-gradient-to-b from-[#FFD587] to-[#A1640E] flex items-center justify-center">
            <Trophy className="text-white" size={36} strokeWidth={1.5} />
          </div>
        </div>

<<<<<<< HEAD
        <p className="mt-3 font-semibold">{data.topFinderName}</p>
        <p className="text-sm text-gray-500">{data.topFinderPoints} points</p>
      </div>

      {/* Earned Badges */}
      <div className="bg-white rounded-xl p-6 shadow-md">
=======
        <p className="mt-3 font-semibold">Rosmar Lamna</p>
        <p className="text-sm text-gray-500">850 points</p>
      </div>

      {/* Earned Badges */}
      <div className="bg-white rounded-xl p-6">
>>>>>>> a5afc5cb (ADMIN to QR. QR not yet finished)
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Most Earned Badge</h3>
          <button className="cursor-pointer font-semibold text-sm text-green-600 hover:underline">
            View All
          </button>
        </div>

        <div className="space-y-3">
<<<<<<< HEAD
          {data.badges.map((badge, index) => {
=======
          {badges.map((badge, index) => {
>>>>>>> a5afc5cb (ADMIN to QR. QR not yet finished)
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
