import { Users, CheckCircle, Gift, BarChart } from "lucide-react";

export default function StatsCard({ title, value, type }) {
  const styles = {
    users: {
      icon: <Users size={20} />,
      bg: "bg-cyan-100",
      text: "text-cyan-700",
    },
    active: {
      icon: <CheckCircle size={20} />,
      bg: "bg-green-100",
      text: "text-green-700",
    },
    rewards: {
      icon: <Gift size={20} />,
      bg: "bg-purple-100",
      text: "text-purple-700",
    },
    completion: {
      icon: <BarChart size={20} />,
      bg: "bg-blue-100",
      text: "text-blue-700",
    },
  };

  const style = styles[type];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs hover:shadow-md p-6 flex items-center gap-4 w-full">
      <div className={`p-3 rounded-lg ${style.bg}`}>
        <div className={style.text}>{style.icon}</div>
      </div>

      <div>
        <p className="text-sm text-gray-500">{title}</p>

        {type === "completion" ? (
          <>
            <p className="text-xl font-bold">{value}%</p>
            <div className="w-32 h-2 bg-gray-200 rounded mt-1">
              <div
                className="h-2 bg-blue-500 rounded"
                style={{ width: `${value}%` }}
              />
            </div>
          </>
        ) : (
          <p className="text-xl font-bold">{value}</p>
        )}
      </div>
    </div>
  );
}