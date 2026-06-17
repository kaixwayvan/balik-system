import { motion } from "framer-motion";
import ReportCard from "./ReportCard";
import { FolderSearch } from "lucide-react";

export default function ReportsList({ reports = [], loading = false, onViewReport, onArchive }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600" />
        <p className="text-sm font-bold text-slate-400 animate-pulse tracking-wide">Loading records...</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 bg-white/50 border border-dashed border-slate-300 rounded-[2rem]">
        <FolderSearch size={48} className="text-slate-300 mb-4" />
        <p className="text-lg font-bold text-slate-600">No reports found</p>
        <p className="text-sm text-slate-400 mt-1 font-medium">Try adjusting your filters or search query.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-extrabold text-slate-800 tracking-tight ml-2">Recent Reports</h2>
      <motion.div layout className="grid grid-cols-1 gap-4">
        {reports.map((r) => (
          <ReportCard key={r.id} report={r} onViewReport={onViewReport} onArchive={onArchive} />
        ))}
      </motion.div>
    </div>
  );
}