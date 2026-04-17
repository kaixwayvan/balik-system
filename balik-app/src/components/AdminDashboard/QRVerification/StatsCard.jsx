export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((item, i) => {
        const Icon = item.icon;

        return (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 shadow-xs hover:shadow-md p-6 flex items-center gap-4"
          >
            {/* Icon */}
            <div className={`${item.bg} p-3 rounded-lg`}>
              <Icon className={item.color} size={22} />
            </div>

            {/* Text */}
            <div>
              <p className="text-gray-500 text-sm">{item.label}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}