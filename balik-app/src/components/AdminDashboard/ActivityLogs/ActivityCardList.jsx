import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ActivityCard from "./ActivityCard";

export default function ActivityCardList({ logs, onView }) {
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [logs]);
  const paginatedLogs = logs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col gap-4">
      <motion.div layout className="space-y-3">
        <AnimatePresence mode="popLayout">
          {paginatedLogs.map((log, i) => (
            <ActivityCard key={log.id} log={log} onView={onView} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination Container */}
      <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
        <span className="text-xs font-semibold text-slate-500">
          Page <span className="text-slate-800">{page}</span> of {totalPages || 1}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages || totalPages === 0}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}