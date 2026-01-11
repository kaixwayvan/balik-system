const activities = [
  "Lost item reported: iPhone 15 Pro",
  "Reported found item",
  "Edited a lost report",
  "Submitted a claiming request",
  "Updated profile",
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Recent Activity</h2>
        <button className="text-blue-600 text-sm">View All</button>
      </div>
      <ul className="space-y-3 text-sm text-gray-600">
        {activities.map((a, i) => (
          <li key={i}>• {a}</li>
        ))}
      </ul>
    </div>
  );
}