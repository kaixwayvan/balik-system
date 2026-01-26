import {
  MapPin,
  Clock,
  ChevronDown,
  CheckCircle,
  ScanEye,
} from "lucide-react";

import { STATUS_STYLES } from "./ActiveReports";
import AIMatches from "./AIMatches";

export default function ReportCard({
  report,
  openReportId,
  setOpenReportId,
  onClaim,
}) {
  const styles = STATUS_STYLES[report.status];
  const isOpen = openReportId === report.id;

  return (
    <div className={`rounded-xl border p-5 ${styles.border} ${styles.cardBg}`}>
      {/* TOP */}
      <div className="flex gap-4">
        <img
          src={report.image}
          alt={report.title}
          className="w-24 h-24 rounded-lg object-cover border shadow bg-white"
        />

        <div className="flex-1">
          <div className="flex">
            <div>
              <h3 className="text-lg font-semibold">{report.title}</h3>
              <p className="text-sm text-gray-600">{report.description}</p>

              <div className="flex gap-6 text-xs text-gray-500 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {report.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {report.timeAgo}
                </span>
              </div>
            </div>

            <span
              className={`ml-auto self-start whitespace-nowrap text-xs px-3 py-1 rounded-full border ${styles.badge}`}
            >
              {styles.label}
            </span>
          </div>

          {/* PROGRESS */}
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-1">Search progress</p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${styles.progress}`}
                style={{ width: `${report.progress}%` }}
              />
            </div>
            <p className="text-right text-xs text-gray-500 mt-1">
              {report.progress}%
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 mt-4">
            {report.status === "matches" && (
              <button
                onClick={() =>
                  setOpenReportId(isOpen ? null : report.id)
                }
                className="cursor-pointer font-extrabold flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded-md"
              >
                <ScanEye size={16} />
                View 2 AI Matches
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}

            <button className="cursor-pointer border border-gray-300 text-sm px-4 py-2 rounded-md hover:bg-gray-100"> Update Description </button>

            {report.status === "claimed" && (
              <span className="flex items-center gap-2 text-green-700 font-medium text-sm">
                <CheckCircle size={18} />
                Item Claimed
              </span>
            )}
          </div>
        </div>
      </div>

      {isOpen && report.status === "matches" && (
        <AIMatches onClaim={onClaim} />
      )}
    </div>
  );
}