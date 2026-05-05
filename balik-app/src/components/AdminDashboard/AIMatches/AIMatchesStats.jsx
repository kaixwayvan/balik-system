import { Brain, CheckCircle2, Clock, Percent } from "lucide-react";

<<<<<<< HEAD
export default function AIMatchesStats({ matches = [] }) {
  const approved = matches.filter(m => m.status === 'Approved').length;
  const pending = matches.filter(m => m.status === 'Pending').length;
  const avgConf = matches.length ? Math.floor(matches.reduce((sum, current) => sum + current.confidence, 0) / matches.length) + "%" : "0%";

  const stats = [
    {
      label: "Total Matches",
      value: matches.length,
      icon: Brain,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
    {
      label: "Approved",
      value: approved,
      icon: CheckCircle2,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },
    {
      label: "Avg. Confidence",
      value: avgConf,
      icon: Percent,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
  ];
=======
const stats = [
  {
    label: "Total Matches",
    value: 127,
    icon: Brain,
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
  {
    label: "Approved",
    value: 89,
    icon: CheckCircle2,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  {
    label: "Pending",
    value: 23,
    icon: Clock,
    bg: "bg-yellow-100",
    color: "text-yellow-600",
  },
  {
    label: "Avg. Confidence",
    value: "87%",
    icon: Percent,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
];

export default function AIMatchesStats() {
>>>>>>> a5afc5cb (ADMIN to QR. QR not yet finished)
  return (
    <div className="grid grid-cols-4 gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;

        return (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 shadow-xs hover:shadow-md p-6 flex items-center gap-4"
          >
            <div className={`${stat.bg} p-3 rounded-lg`}>
              <Icon className={stat.color} size={22} />
            </div>

            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}