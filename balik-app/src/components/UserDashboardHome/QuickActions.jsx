export default function QuickActions() {
  const actions = [
    { text: "Report Item", color: "bg-blue-600" },
    { text: "Browse Found Items", color: "bg-green-600" },
    { text: "Track Items", color: "bg-orange-500" },
    { text: "View Activity History", color: "bg-lime-600" },
    { text: "Edit Profile", color: "bg-red-700" },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((a, i) => (
          <button
            key={i}
            className={`${a.color} text-white w-full py-3 rounded-lg font-medium`}
          >
            {a.text}
          </button>
        ))}
      </div>
    </div>
  );
}
