import {
  Trophy,
  Search,
  Package,
  BarChart3,
} from "lucide-react";

const stats = [
  {
    label: "Items Claimed",
    value: 0,
    icon: Trophy,
  },
  {
    label: "Lost Items",
    value: 0,
    icon: Search,
  },
  {
    label: "Found Items",
    value: 0,
    icon: Package,
  },
  {
    label: "Total Reports",
    value: 0,
    icon: BarChart3,
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((s, i) => {
        const Icon = s.icon;

        return (
          <div
            key={i}
            className="bg-white rounded-xl p-4 shadow flex items-center gap-4"
          >
            {/* Icon */}
            <div className="p-1">
              <Icon size={25} className="text-red-700" />
            </div>

            {/* Text */}
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}