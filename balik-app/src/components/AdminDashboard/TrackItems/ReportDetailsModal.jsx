import { useEffect } from "react";
import { motion } from "framer-motion";
import { X, Eye, Clock, Calendar, Box, UserCircle, MapPin, Hash } from "lucide-react";

export default function ReportDetailsModal({ report, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const statusStyles = {
    Claimed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Pending: "bg-slate-100 text-slate-700 border-slate-200",
    Rejected: "bg-rose-100 text-rose-700 border-rose-200",
    Flagged: "bg-amber-100 text-amber-700 border-amber-200",
    Verified: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const isRecent = report.time.includes("minute") || report.time.includes("hour") || report.time.includes("now");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-white z-10 shrink-0">
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Report Details</h2>
          <button onClick={onClose} className="cursor-pointer p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
          {report.image && (
            <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative group">
              <img src={report.image} alt={report.item} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none" />
            </div>
          )}

          <div className="grid gap-6">
            <section>
              <h3 className="font-bold text-sm text-orange-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Box size={16} /> Item Identity
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Hash size={12}/> Report ID</p>
                  <p className="text-sm font-bold text-slate-800 break-all">{report.id}</p>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Box size={12}/> Item Name</p>
                  <p className="text-sm font-bold text-slate-800">{report.item}</p>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin size={12}/> Location</p>
                  <p className="text-sm font-medium text-slate-700">{report.location || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-widest border ${statusStyles[report.status] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                    {report.status}
                  </span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-bold text-sm text-orange-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                <UserCircle size={16} /> Reporter Info
              </h3>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
                <p className="text-sm font-bold text-slate-800">{report.user}</p>
              </div>
            </section>

            <section>
              <h3 className="font-bold text-sm text-orange-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Clock size={16} /> Activity Log
              </h3>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-800">{report.activity}</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                  {isRecent ? <Clock size={14} className="text-blue-500" /> : <Calendar size={14} className="text-slate-400" />}
                  <span className="text-xs font-bold text-slate-600">{report.time}</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50 shrink-0">
          <button onClick={onClose} className="cursor-pointer px-8 py-2.5 rounded-2xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-200 transition-colors order-2 sm:order-1 text-md">
            Close
          </button>
          {report.status === "Pending" && (
            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all font-bold order-1 sm:order-2 text-sm">
              <Eye size={16} /> Review Report
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}