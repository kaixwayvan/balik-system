import { Search, Waves, Clock, SquaresExclude, QrCode, UserSearch } from "lucide-react";
<<<<<<< HEAD
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";

export default function StatCards() {
  const [statsData, setStatsData] = useState({
    total: 0,
    lost: 0,
    found: 0,
    resolved: 0,
    ai: 0,
    qr: 0,
    guest: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data, error } = await supabase.from('items').select('type, status, metadata, description_embedding');
        if (error) throw error;

        let total = data.length;
        let lost = 0, found = 0, resolved = 0, ai = 0, qr = 0, guest = 0;
        data.forEach(item => {
          if (item.type === 'lost') lost++;
          if (item.type === 'found') {
              found++;
              if (item.metadata?.is_anonymous) guest++;
          }
          if (item.status === 'resolved') resolved++;
          if (item.description_embedding) ai++;
          if (item.metadata?.qr_code) qr++;
        });
        setStatsData({ total, lost, found, resolved, ai, qr, guest });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }
    fetchStats();
  }, []);

  const getPercentage = (val) => {
    if (statsData.total === 0) return "0%";
    return `+${Math.round((val / statsData.total) * 100)}%`;
  };

  const stats = [
    { icon: Search, value: statsData.lost, label: "Total Lost Items", change: getPercentage(statsData.lost), css: "text-red-500 bg-red-200" },
    { icon: Waves, value: statsData.found, label: "Total Found Items", change: getPercentage(statsData.found), css: "text-green-600 bg-green-200" },
    { icon: Clock, value: statsData.resolved, label: "Successful Claims", change: getPercentage(statsData.resolved), css: "text-blue-700 bg-blue-200" },
    { icon: SquaresExclude, value: statsData.ai, label: "AI Matches", change: getPercentage(statsData.ai), css: "text-purple-600 bg-purple-200" },
    { icon: QrCode, value: statsData.qr, label: "QR Verified items", change: getPercentage(statsData.qr), css: "text-yellow-600 bg-yellow-200" },
    { icon: UserSearch, value: statsData.guest, label: "Anonymous Reports", change: getPercentage(statsData.guest), css: "text-violet-600 bg-violet-200" },
  ];

=======

const stats = [
  { icon: Search, value: 248, label: "Total Lost Items", change: "+12%", css: "text-red-500 bg-red-200" },
  { icon: Waves, value: 192, label: "Total Found Items", change: "+8%", css: "text-green-600 bg-green-200" },
  { icon: Clock, value: 89, label: "Successful Claims", change: "+15%", css: "text-blue-700 bg-blue-200" },
  { icon: SquaresExclude, value: 156, label: "AI Matches", change: "+22%", css: "text-purple-600 bg-purple-200" },
  { icon: QrCode, value: 73, label: "QR Verified items", change: "+5%", css: "text-yellow-600 bg-yellow-200" },
  { icon: UserSearch, value: 45, label: "Guest Found Reports", change: "-3%", css: "text-violet-600 bg-violet-200" },
];

export default function StatCards() {
>>>>>>> a5afc5cb (ADMIN to QR. QR not yet finished)
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
