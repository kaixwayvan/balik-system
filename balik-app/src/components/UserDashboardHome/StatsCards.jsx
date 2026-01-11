const stats = [
  { label: "Items Claimed", value: 8 },
  { label: "Lost Items", value: 9 },
  { label: "Found Items", value: 9 },
  { label: "Total Reports", value: 9 },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="bg-white rounded-xl p-4 shadow">
          <p className="text-sm text-gray-500">{s.label}</p>
          <p className="text-2xl font-bold">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
