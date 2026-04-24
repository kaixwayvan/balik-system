import StatusBadge from "./shared/StatusBadge";
import {
  Eye,
  ClipboardCheck,
  History,
  CheckCircle,
  Archive,
  Clock,
  Calendar,
} from "lucide-react";

export default function ReportCard({ report }) {
  const statusConfig = {
    Flagged: {
      badge: "bg-yellow-100 text-yellow-700",
      actions: ["Review Case", "Resolve"],
    },
    Rejected: {
      badge: "bg-red-100 text-red-700",
      actions: ["View History", "Archive"],
    },
    Claimed: {
      badge: "bg-green-100 text-green-700",
      actions: ["View Report", "Archive"],
    },
    Pending: {
      badge: "bg-gray-200 text-gray-700",
      actions: ["View Report"],
    },
  };

  const actionConfig = {
    "View Report": {
      icon: <Eye size={16} />,
      style: "bg-blue-600 text-white",
    },
    "Review Case": {
      icon: <ClipboardCheck size={16} />,
      style: "bg-yellow-400 text-white",
    },
    "View History": {
      icon: <History size={16} />,
      style: "bg-blue-600 text-white",
    },
    Resolve: {
      icon: <CheckCircle size={16} />,
      style: "bg-red-500 text-white",
    },
    Archive: {
      icon: <Archive size={16} />,
      style: "bg-gray-500 text-white",
    },
  };

  const isRecent = (time) => {
  return (
    time.includes("minute") ||
    time.includes("hour") ||
    time.includes("just now")
  );
};

  const config = statusConfig[report.status];

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 flex justify-between items-center mb-6">
      <div className="flex gap-4">
        <img
          src={report.image}
          alt=""
          className="w-20 h-20 object-cover rounded-lg"
        />

        <div>
          <h3 className="font-bold text-lg">
            ITEM - {report.id} · {report.item}
          </h3>

          <p className="text-sm mt-2"><b>User:</b> {report.user}</p>

          {report.location && (
            <p className="text-sm"><b>Location:</b> {report.location}</p>
          )}

          <p className="text-sm mb-2"><b>Activity:</b> {report.activity}</p>

          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            {isRecent(report.time) ? (
              <Clock size={14} />
            ) : (
              <Calendar size={14} />
            )}
            {report.time}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <StatusBadge status={report.status} />

        <div className="flex flex-col items-end ">
          {config.actions.map((action) => (
            <button
              key={action}
              className={`cursor-pointer flex items-center mb-2 gap-2 px-3 py-1 text-sm rounded ${
                actionConfig[action].style
              }`}
            >
              {actionConfig[action].icon}
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}