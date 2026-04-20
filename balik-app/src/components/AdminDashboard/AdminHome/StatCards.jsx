import { Search, Waves, Clock, SquaresExclude, QrCode, UserSearch } from "lucide-react";

const stats = [
  { icon: Search, value: 248, label: "Total Lost Items", change: "+12%", css: "text-red-500 bg-red-200" },
  { icon: Waves, value: 192, label: "Total Found Items", change: "+8%", css: "text-green-600 bg-green-200" },
  { icon: Clock, value: 89, label: "Successful Claims", change: "+15%", css: "text-blue-700 bg-blue-200" },
  { icon: SquaresExclude, value: 156, label: "AI Matches", change: "+22%", css: "text-purple-600 bg-purple-200" },
  { icon: QrCode, value: 73, label: "QR Verified items", change: "+5%", css: "text-yellow-600 bg-yellow-200" },
  { icon: UserSearch, value: 45, label: "Guest Found Reports", change: "-3%", css: "text-violet-600 bg-violet-200" },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-6 gap-4">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={i} className="bg-white rounded-xl p-5 shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <Icon className={`${s.css} rounded-lg p-2 w-10 h-10`} />
              </div>
              <span
                className={`text-md font-extrabold ${
                  s.change.includes("-") ? "text-red-500" : "text-green-500"
                }`}
              >
                {s.change}
              </span>
            </div>

            <h3 className="text-2xl font-semibold mt-3">{s.value}</h3>
            <p className="pt-2 text-sm font-medium text-gray-500">{s.label}</p>
          </div>
        );
      })}
    </div>
  );
}
