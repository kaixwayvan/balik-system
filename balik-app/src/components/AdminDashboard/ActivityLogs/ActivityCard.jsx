import { Eye, Clock, ShieldCheck, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function ActivityCard({ log, onView, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 relative"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-indigo-500 rounded-l-2xl" />
      
      <div className="flex justify-between items-start pl-2">
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 text-sm">{log.actor}</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.role || "User"}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 text-slate-500 px-2.5 py-1 rounded-full border border-slate-100">
          <Clock size={12} />
          <span className="text-[10px] font-bold">{log.datetime.split(" ")[1] || log.datetime}</span>
        </div>
      </div>

      <div className="pl-2 space-y-2">
        <div className="flex items-start gap-2 text-sm text-slate-700">
          <ShieldCheck size={16} className="text-indigo-500 mt-0.5 shrink-0" />
          <span className="font-medium leading-tight">{log.activity}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Target size={14} className="text-rose-400 shrink-0" />
          <span className="truncate max-w-[200px]">{log.target}</span>
        </div>
      </div>

      <div className="pt-3 mt-1 border-t border-slate-50 flex justify-end pl-2 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(log);
          }}
          className="flex items-center gap-2 text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-xl transition-all w-full sm:w-auto justify-center cursor-pointer"
        >
          <Eye size={14} strokeWidth={2.5} />
          View Details
        </button>
      </div>
    </motion.div>
  );
}