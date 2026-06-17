import { useState, useEffect } from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ActivityTable({ logs, onView }) {
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [logs]);

  const paginatedLogs = logs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <div className="w-full flex flex-col h-full">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4 rounded-tl-xl">Date & Time</th>
              <th className="px-6 py-4">Actor</th>
              <th className="px-6 py-4">Activity</th>
              <th className="px-6 py-4">Target</th>
              <th className="px-6 py-4 text-center rounded-tr-xl">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence mode="popLayout">
              {paginatedLogs.map((log) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">
                    {log.datetime}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">
                        {log.actor}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        {log.role || "User"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {log.activity}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-md text-xs font-semibold border border-slate-200">
                      {log.target}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="relative inline-block group/tooltip">
                      <button
                        onClick={() => onView(log)}
                        className="cursor-pointer inline-flex items-center justify-center p-2 text-purple-600 hover:text-purple-800 transition-all duration-200"
                      >
                        <Eye size={18} strokeWidth={2.5} />
                      </button>

                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-slate-800 rounded-md whitespace-nowrap opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50">
                        View Details
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination Container */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white mt-auto">
        <span className="text-sm font-semibold text-slate-500">
          Page <span className="text-slate-800">{page}</span> of{" "}
          <span className="text-slate-800">{totalPages || 1}</span>
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages || totalPages === 0}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
