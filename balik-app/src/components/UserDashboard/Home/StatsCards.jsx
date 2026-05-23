import {
  Trophy,
  Search,
  Package,
  BarChart3,
} from "lucide-react";

const stats = [
  {
    label: "Items Claimed",
    value: 8,
    icon: Trophy,
  },
  {
    label: "Lost Items",
    value: 9,
    icon: Search,
  },
  {
    label: "Found Items",
    value: 9,
    icon: Package,
  },
  {
    label: "Total Reports",
    value: 9,
    icon: BarChart3,
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((s, i) => {
        const Icon = s.icon;

        return (
          <div
            key={i}
            className="group bg-white rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98] cursor-pointer flex items-center gap-4 border border-transparent hover:border-orange-100"
          >
            {/* Icon Container */}
            <div className="p-3 bg-orange-50 text-[#964E1A] rounded-2xl flex-shrink-0 transition-colors duration-300 group-hover:bg-[#6B110D] group-hover:text-white">
              <Icon 
                size={24} 
                className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" 
                strokeWidth={2.5}
              />
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <p className="text-sm sm:text-base text-orange-800 truncate transition-colors duration-300 group-hover:text-gray-700">
                {s.label}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 transition-transform duration-300">
                {s.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}