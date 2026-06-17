import { motion } from "framer-motion";
import { Eye, ClipboardCheck, History, CheckCircle, Archive, Clock, Calendar, Package, MapPin, User } from "lucide-react";

export default function ReportCard({ report, onViewReport, onArchive }) {
  const handleActionClick = (action) => {
    if (action.includes("View")) onViewReport?.(report);
    if (action === "Archive") onArchive?.(report);
  };

  const statusConfig = {
    Flagged: { badge: "bg-amber-100 text-amber-700 border-amber-200", actions: ["Review Case", "Resolve"] },
    Rejected: { badge: "bg-rose-100 text-rose-700 border-rose-200", actions: ["View History", "Archive"] },
    Claimed: { badge: "bg-emerald-100 text-emerald-700 border-emerald-200", actions: ["View Report", "Archive"] },
    Pending: { badge: "bg-slate-100 text-slate-700 border-slate-200", actions: ["View Report"] },
    Verified: { badge: "bg-blue-100 text-blue-700 border-blue-200", actions: ["View Report", "Archive"] },
    Active: { badge: "bg-indigo-100 text-indigo-700 border-indigo-200", actions: ["View Report"] },
  };

  const actionStyles = {
    "View Report": "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300",
    "Review Case": "bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100",
    "View History": "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
    "Resolve": "bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100",
    "Archive": "bg-slate-800 border border-slate-800 text-white hover:bg-slate-700 shadow-sm",
  };

  const getIcon = (action) => {
    switch (action) {
      case "View Report": case "View History": return <Eye size={14} />;
      case "Review Case": return <ClipboardCheck size={14} />;
      case "Resolve": return <CheckCircle size={14} />;
      case "Archive": return <Archive size={14} />;
      default: return null;
    }
  };

  const isRecent = report.time.toLowerCase().includes("minute") || report.time.toLowerCase().includes("now");
  const config = statusConfig[report.status] || statusConfig.Pending;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border border-slate-200 rounded-4xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-4 sm:p-5 flex flex-col lg:flex-row justify-between gap-5 group"
    >
      <div className="flex flex-col sm:flex-row items-start gap-5 flex-1">
        <div className="relative shrink-0 w-full sm:w-28 h-40 sm:h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60">
          {report.image ? (
            <img src={report.image} alt={report.item} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
              <Package size={28} strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-widest mt-2 font-bold opacity-50">No Image</span>
            </div>
          )}
          <div className="absolute top-2 left-2 sm:hidden">
            <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${config.badge}`}>
              {report.status}
            </span>
          </div>
        </div>

        <div className="flex flex-col flex-1 min-w-0 py-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-md border bg-slate-50 text-slate-500 border-slate-200">
              ID: {report.id.slice(0, 8)}...
            </span>
            <span className={`hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-md border ${config.badge}`}>
              {report.status}
            </span>
          </div>
          
          <h3 className="font-extrabold text-lg sm:text-xl text-slate-800 truncate mb-3">{report.item}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <User size={14} className="text-slate-400 shrink-0" />
              <span className="truncate font-medium">{report.user}</span>
            </div>
            {report.location && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin size={14} className="text-slate-400 shrink-0" />
                <span className="truncate font-medium">{report.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-slate-600 sm:col-span-2">
              {isRecent ? <Clock size={14} className="text-blue-500 shrink-0" /> : <Calendar size={14} className="text-slate-400 shrink-0" />}
              <span className="font-medium text-slate-500">{report.activity} • {report.time}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row lg:flex-col items-center justify-end gap-2 lg:gap-3 lg:border-l lg:border-slate-100 lg:pl-6 shrink-0 mt-4 lg:mt-0">
        {config.actions.map((action) => (
          <button
            key={action}
            onClick={() => handleActionClick(action)}
            className={`cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 ${actionStyles[action]}`}
          >
            {getIcon(action)}
            {action}
          </button>
        ))}
      </div>
    </motion.div>
  );
}