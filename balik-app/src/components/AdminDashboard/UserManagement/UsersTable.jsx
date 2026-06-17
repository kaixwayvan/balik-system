import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import UserRow from "./UserRow";

export default function UsersTable({ users, loading, onActionClick }) {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [users]);

  const totalPages = Math.ceil((users?.length || 0) / usersPerPage);
  
  const currentUsers = useMemo(() => {
    if (!users) return [];
    const start = (currentPage - 1) * usersPerPage;
    return users.slice(start, start + usersPerPage);
  }, [users, currentPage]);

  const headers = ["User Profile", "Role", "Reputation", "Activity Logs", "Status", "Actions"];

  // Handlers
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="w-full flex flex-col">
      <div className="w-full overflow-x-auto overflow-y-visible pb-4 shrink-0 [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-track]:bg-slate-100/50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">
        <table className="w-full text-sm text-left min-w-[950px] border-collapse">
          <thead className="bg-slate-50/80 text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest border-y border-slate-200/60 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              {headers.map((h, i) => (
                <th key={h} className={`px-4 py-4 ${i === 0 ? 'text-left' : 'text-center'} first:rounded-tl-xl last:rounded-tr-xl`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.tr key="loading-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm font-bold text-slate-400 animate-pulse tracking-wide">
                    Fetching directory...
                  </td>
                </motion.tr>
              ) : currentUsers.length === 0 ? (
                <motion.tr key="empty-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <td colSpan={6} className="px-6 py-16 text-center text-base font-bold text-slate-500 italic">
                    No users matched your criteria.
                  </td>
                </motion.tr>
              ) : (
                currentUsers.map((u, idx) => (
                  <UserRow key={u.id} user={u} index={idx} onActionClick={onActionClick} />
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {!loading && users?.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between py-4 px-2 gap-4 mt-2 border-t border-slate-100">
          
          <span className="text-xs sm:text-sm font-medium text-slate-500 text-center sm:text-left">
            Showing <span className="font-black text-slate-800">{(currentPage - 1) * usersPerPage + 1}</span> to <span className="font-black text-slate-800">{Math.min(currentPage * usersPerPage, users.length)}</span> of <span className="font-black text-slate-800">{users.length}</span> users
          </span>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all outline-none 
                disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-slate-400
                enabled:cursor-pointer enabled:text-slate-700 enabled:bg-white enabled:border enabled:border-slate-200 enabled:hover:bg-slate-50 enabled:active:scale-95 enabled:shadow-sm"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Prev</span>
            </button>

            <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-sm font-black text-slate-700 select-none">
              {currentPage} <span className="text-slate-400 font-medium mx-0.5">/</span> {totalPages}
            </div>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all outline-none 
                disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-slate-400
                enabled:cursor-pointer enabled:text-slate-700 enabled:bg-white enabled:border enabled:border-slate-200 enabled:hover:bg-slate-50 enabled:active:scale-95 enabled:shadow-sm"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}