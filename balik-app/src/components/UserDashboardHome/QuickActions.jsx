import {
  Plus,
  Search,
  MapPin,
  History,
  User,
} from "lucide-react";

export default function QuickActions({ onReportClick }) {
  const actions = [
    {
      text: "Report Item",
      color: "bg-blue-600",
      icon: Plus,
      onClick: onReportClick,
    },
    {
      text: "Browse Found Items",
      color: "bg-green-600",
      icon: Search,
    },
    {
      text: "Track Items",
      color: "bg-orange-500",
      icon: MapPin,
    },
    {
      text: "View Activity History",
      color: "bg-lime-600",
      icon: History,
    },
    {
      text: "Edit Profile",
      color: "bg-red-700",
      icon: User,
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="font-semibold mb-4">Quick Actions</h2>

      <div className="space-y-3 ">
        {actions.map((a, i) => {
          const Icon = a.icon;

          return (
            <button
              key={i}
              onClick={a.onClick}
              className={`${a.color} cursor-pointer text-white w-full py-3 px-4 rounded-lg font-medium flex items-center gap-3 hover:opacity-60 transition`}
            >
              <Icon size={18} />
              <span>{a.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}