export default function PointsPanel() {
  return (
    <div className="bg-indigo-900 text-white rounded-xl p-6 shadow">
      <h2 className="font-semibold">Your Points</h2>
      <p className="text-4xl font-bold mt-2">0</p>
      <p className="text-sm mt-1">Level 0: Starter Status</p>
      <div className="mt-4">
        <div className="h-2 bg-indigo-700 rounded-full">
          <div className="h-2 bg-yellow-400 rounded-full w-0"></div>
        </div>
        <p className="text-xs mt-1">1000 more points to go</p>
      </div>
    </div>
  );
}