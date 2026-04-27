import { Package, Search, CheckCircle, Archive } from "lucide-react";

export default function StatsCards({ stats }) {
  const statsConfig = [
    {
      label: "Total Reports",
      value: stats?.total || 0,
      color: "bg-purple-500 border-2 border-purple-400",
      icon: Package,
    },
    {
      label: "Lost Items",
      value: stats?.lost || 0,
      color: "bg-red-500 border-2 border-red-400",
      icon: Search,
    },
    {
      label: "Found Items",
      value: stats?.found || 0,
      color: "bg-yellow-500  border-2 border-yellow-400",
      icon: Archive,
    },
    {
      label: "Successfully Claimed",
      value: stats?.claimed || 0,
      color: "bg-green-500 border-2 border-green-400",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {statsConfig.map((s) => {
        const Icon = s.icon;

        return (
          <div
            key={s.label}
            className={`${s.color} shadow-xs hover:shadow-lg text-white rounded-xl p-5 flex items-center gap-4 shadow`}
          >
            <Icon size={32} />
            <div>
              <p className="text-sm">{s.label}</p>
              <p className="text-xl font-bold">{s.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}