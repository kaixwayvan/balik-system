const achievements = [
  "First Finder",
  "Good Samaritan",
  "Community Hero",
  "Detail Master",
];

export default function AchievementsPanel() {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="font-semibold mb-4">Achievements</h2>
      <ul className="space-y-3 text-sm">
        {achievements.map((a, i) => (
          <li key={i} className="border rounded-lg p-2">
            {a}
          </li>
        ))}
      </ul>
    </div>
  );
}