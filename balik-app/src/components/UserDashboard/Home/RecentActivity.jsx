import {
  Smartphone,
  Package,
  Edit3,
  ClipboardCheck,
  User,
  SearchCheck,
} from "lucide-react";

const activities = [
  {
    text: "Lost item reported: iPhone 15 Pro",
    history: "Yesterday, 3:45 PM",
    icon: Smartphone,
  },
  {
    text: "Reported found item",
    history: "12 minutes ago",
    icon: Package,
  },
  {
    text: "Edited a lost report",
    history: "1 hour ago",
    icon: Edit3,
  },
  {
    text: "Submitted a claiming request",
    history: "Janury 22, 2026",
    icon: ClipboardCheck,
  },
  {
    text: "Updated profile",
    history: "3 hours ago",
    icon: User,
  },
  {
    text: "Item claiming request has been approved",
    history: "7 hours ago",
    icon: SearchCheck,
  },
];

const colors = [
  { bubble: "bg-red-100", icon: "text-red-600" },
  { bubble: "bg-green-100", icon: "text-green-600" },
  { bubble: "bg-orange-200", icon: "text-orange-600" },
  { bubble: "bg-blue-100", icon: "text-blue-600" },
  { bubble: "bg-yellow-100", icon: "text-yellow-500" },
  { bubble: "bg-pink-100", icon: "text-pink-600" },
  { bubble: "bg-purple-100", icon: "text-purple-600" },
  { bubble: "bg-amber-100", icon: "text-amber-600" },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Recent Activity</h2>
        <button className="text-blue-600 text-sm hover:underline cursor-pointer">
          View All
        </button>
      </div>

      {/* Activity list */}
      {/* Activity list */}
      <ul className="space-y-4">
        {activities.map((a, i) => {
          const Icon = a.icon;

          // Pick a random color
          const color = colors[Math.floor(Math.random() * colors.length)];

          return (
            <li key={i} className="flex items-center gap-3">
              {/* Icon bubble */}
              <div className={`p-2 rounded-full ${color.bubble}`}>
                <Icon size={14} className={color.icon} />
              </div>

              {/* Text */}
              <div className="flex-col">
                <p className="text-sm text-gray-600 font-semibold leading-snug mb-1">{a.text}</p>
                <p className="text-xs text-gray-400 ">{a.history}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
