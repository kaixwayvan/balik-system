import {
  Smartphone,
  Package,
  Search,
  CheckCircle,
} from "lucide-react";

export default function RecentActivity({ items = [] }) {
  const colors = [
    { bubble: "bg-red-100", icon: "text-red-600" },
    { bubble: "bg-green-100", icon: "text-green-600" },
    { bubble: "bg-blue-100", icon: "text-blue-600" },
    { bubble: "bg-yellow-100", icon: "text-yellow-500" },
  ];

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
      <ul className="space-y-4">
        {items.length > 0 ? (
          items.map((item, i) => {
            const Icon = item.type === 'lost' ? Search : Package;
            const color = item.status === 'resolved' ? colors[1] : (item.type === 'lost' ? colors[0] : colors[2]);

            return (
              <li key={item.id || i} className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${color.bubble}`}>
                  <Icon size={14} className={color.icon} />
                </div>
                <div className="flex-col">
                  <p className="text-sm text-gray-600 font-semibold leading-snug mb-1">
                    Reported {item.type} {item.category}: {item.title}
                  </p>
                  <p className="text-xs text-gray-400 ">
                    {new Date(item.created_at || item.date_reported).toLocaleDateString()} • {item.status}
                  </p>
                </div>
              </li>
            );
          })
        ) : (
          <li className="text-sm text-gray-500 text-center py-4">No recent activity</li>
        )}
      </ul>
    </div>
  );
}
