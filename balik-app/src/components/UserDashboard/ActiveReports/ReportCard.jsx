import { MapPin, Clock, ChevronDown, CheckCircle, ScanEye } from "lucide-react";
import { STATUS_STYLES } from "./simulation-mocks";
import AIMatches from "./AIMatches";

export default function ReportCard({ report, openReportId, setOpenReportId, onClaim }) {
  const styles = STATUS_STYLES[report.status] || STATUS_STYLES.searching;
  const isOpen = openReportId === report.id;

  return (
    <div className={`rounded-4xl sm:rounded-4xl border p-5 sm:p-5 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300 ${styles.border} ${styles.cardBg}`}>
      {/* Top */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
        <img
          src={report.image || "https://via.placeholder.com/150"}
          alt={report.title}
          className="w-full h-48 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-3xl object-cover border border-gray-200 shadow-md bg-white shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-2 sm:gap-4 mb-3 sm:mb-0">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 truncate uppercase">{report.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">{report.description}</p>

              <div className="flex flex-wrap gap-3 sm:gap-6 text-xs text-gray-500 mt-2 sm:mt-3 font-medium">
                <span className="flex items-center gap-1.5 truncate">
                  <MapPin size={14} className="text-slate-400" /> {report.location}
                </span>
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <Clock size={14} className="text-slate-400" /> {report.timeAgo || "Recently"}
                </span>
              </div>
            </div>

            <span className={`w-fit self-start whitespace-nowrap text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full border shadow-sm uppercase tracking-wider ${styles.badge}`}>
              {styles.label}
            </span>
          </div>

          {/* Progress */}
          <div className="mt-4 sm:mt-5">
            <div className="flex justify-between items-center mb-1.5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {report.type === 'found' ? 'Reunion progress' : 'Search progress'}
              </p>
              {report.status === "matches" && (
                <div className="flex items-center gap-1.5 animate-pulse bg-yellow-100 px-2 py-0.5 rounded text-yellow-700">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">AI Match Found!</p>
                </div>
              )}
            </div>
            <div className="h-2 sm:h-2.5 bg-gray-200/80 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full ${styles.progress} transition-all duration-1000 ease-out relative`}
                style={{ width: `${report.progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <p className="text-right text-[10px] sm:text-xs text-gray-500 mt-1.5 font-bold tracking-wider">
              {report.progress}%
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-4 sm:mt-5">
            {report.status === "matches" && (
              <button
                onClick={() => setOpenReportId(isOpen ? null : report.id)}
                className="w-full sm:w-auto cursor-pointer font-black flex justify-center items-center gap-2 bg-[#FFB639] hover:bg-[#f0a526] text-white text-shadow-xs text-sm sm:text-sm px-4 sm:px-8 py-3.5 sm:py-3 rounded-3xl shadow-lg shadow-yellow-200 transition-all hover:-translate-y-0.5 active:scale-95 uppercase tracking-wider"
              >
                <ScanEye size={16} />
                View {report.matches?.length || 0} Matches
                <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
              </button>
            )}

            {report.status === "claimed" && (
              <span className="w-full sm:w-auto flex justify-center items-center gap-2 text-green-700 font-black text-xs sm:text-sm bg-green-50 px-4 py-2.5 sm:py-3 rounded-xl border border-green-200 uppercase tracking-wider">
                <CheckCircle size={16} />
                Item Claimed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Animation Wrapper */}
      <div 
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen && report.status === "matches" 
            ? "grid-rows-[1fr] opacity-100 mt-6" 
            : "grid-rows-[0fr] opacity-0 mt-0"
        }`}
      >
        <div className="overflow-hidden rounded-[2.5rem]">
          {report.status === "matches" && (
            <div className="pt-2">
              <AIMatches matches={report.matches || []} onClaim={onClaim} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}