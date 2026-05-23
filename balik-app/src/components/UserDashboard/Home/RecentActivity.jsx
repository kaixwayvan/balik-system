import { useNavigate } from "react-router-dom";
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
    history: "January 22, 2026",
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
  { bubble: "bg-red-50 text-red-600 border-red-100" },
  { bubble: "bg-green-50 text-green-600 border-green-100" },
  { bubble: "bg-orange-50 text-orange-600 border-orange-100" },
  { bubble: "bg-blue-50 text-blue-600 border-blue-100" },
  { bubble: "bg-yellow-50 text-yellow-600 border-yellow-100" },
  { bubble: "bg-pink-50 text-pink-600 border-pink-100" },
  { bubble: "bg-purple-50 text-purple-600 border-purple-100" },
  { bubble: "bg-amber-50 text-amber-600 border-amber-100" },
];

export default function RecentActivity() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-bold text-gray-800 text-lg">Recent Activity</h2>
        <button 
          onClick={() => navigate("/dashboard/history")}
          className="text-blue-600 text-sm font-semibold hover:text-blue-800 transition-colors duration-200 hover:underline cursor-pointer px-2 py-1 rounded-lg hover:bg-blue-50 active:scale-95 transform"
        >
          View All
        </button>
      </div>

      {/* Activity list */}
      <ul className="space-y-2 sm:space-y-3">
        {activities.map((a, i) => {
          const Icon = a.icon;

          const colorStyles = colors[i % colors.length];

          return (
            <li 
              key={i} 
              className="group flex items-center gap-3.5 p-2.5 sm:p-2 rounded-2xl hover:bg-slate-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-100"
            >
              {/* Icon bubble */}
              <div className={`p-2.5 rounded-xl border flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${colorStyles.bubble}`}>
                <Icon size={16} strokeWidth={2.5} />
              </div>

              {/* Text Container */}
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-700 font-semibold leading-snug truncate group-hover:text-gray-900 transition-colors duration-200">
                  {a.text}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{a.history}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}