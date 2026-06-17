import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, RefreshCw, FilterX, Shield, SlidersHorizontal } from "lucide-react";
import ActivityTable from "./ActivityTable";
import ActivityCardList from "./ActivityCardList";
import ActivityDetailsModal from "./ActivityDetailsModal";

// Simulated Backend
const mockActivityLogsService = {
  getStats: async () => new Promise(res => setTimeout(() => res([
    { label: "Total Logs", value: "24,592", change: "+12%", trend: "up", type: "total" },
    { label: "System Logins", value: "8,432", change: "+5%", trend: "up", type: "logins" },
    { label: "Items Reported", value: "1,245", change: "+18%", trend: "up", type: "reports" },
    { label: "Claims Resolved", value: "892", change: "+8%", trend: "up", type: "claims" },
    { label: "Security Alerts", value: "12", change: "-2%", trend: "down", type: "alerts" },
    { label: "Role Updates", value: "156", change: "+24%", trend: "up", type: "roles" },
  ]), 600)),
  
  getActivityLogs: async () => new Promise(res => setTimeout(() => res([
    { id: "log-1", datetime: "2026-06-17 16:30:00", actor: "Jane Doe", role: "admin", activity: "Updated System Settings", target: "System", rawType: "UPDATED", ip: "192.168.1.10", oldData: { maintenance_mode: false, max_upload_mb: 5 }, newData: { maintenance_mode: true, max_upload_mb: 10 } },
    { id: "log-2", datetime: "2026-06-17 15:45:12", actor: "John Smith", role: "admin", activity: "Approved found item", target: "Claim #1023", rawType: "UPDATED", ip: "192.168.1.22", oldData: { status: "pending" }, newData: { status: "approved" } },
    { id: "log-3", datetime: "2026-06-17 14:20:05", actor: "Alice Cooper", role: "user", activity: "Submitted lost item", target: "Lost Item", rawType: "CREATED", ip: "192.168.1.34", oldData: null, newData: { type: "lost", category: "Electronics", brand: "Apple" } },
    { id: "log-4", datetime: "2026-06-17 11:10:00", actor: "System", role: "admin", activity: "Daily Backup Completed", target: "Database", rawType: "SYSTEM", ip: "localhost", oldData: null, newData: { status: "success", size: "2.4GB" } },
    { id: "log-5", datetime: "2026-06-16 09:15:33", actor: "Mark Z.", role: "admin", activity: "Changed user role", target: "User Management", rawType: "UPDATED", ip: "192.168.1.55", oldData: { role: "user" }, newData: { role: "officer" } },
  ]), 800))
};

export default function ActivityLogs() {
  const [role, setRole] = useState("All");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [roles] = useState(["admin", "user"]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const fetchData = async () => {
    setLoading(true);
    try {
      const logs = await mockActivityLogsService.getActivityLogs();
      setActivityLogs(logs);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = activityLogs.filter((log) => {
    const matchesSearch = Object.values(log).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    );
    const matchesRole = role === "All" || log.role?.toLowerCase() === role.toLowerCase();
    const logDate = new Date(log.datetime);
    const matchesStart = startDate ? logDate >= new Date(startDate) : true;
    const matchesEnd = endDate ? logDate <= new Date(endDate + "T23:59:59") : true;
    return matchesSearch && matchesRole && matchesStart && matchesEnd;
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.1 } }
  };

  return (
    <motion.div 
      initial="hidden" animate="visible" variants={containerVariants}
      className="bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] overflow-y-auto h-full w-full flex flex-col gap-6 shadow-xl border border-white/40"
    >

      {/* Filter Section */}
      <div className="bg-slate-50/50 rounded-3xl p-5 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-3">
          <div className="bg-[#5C1313]/10 p-2.5 rounded-2xl text-[#5C1313]">
            <SlidersHorizontal size={20} strokeWidth={2.5} />
          </div>
          <h2 className="font-black text-xl sm:text-2xl text-[#5E0300] tracking-tight uppercase">Filter Logs</h2>
        </div>
          <button
            onClick={() => { setSearch(""); setRole("All"); setStartDate(""); setEndDate(""); }}
            className="cursor-pointer text-[11px] font-black text-[#5C1313] hover:text-red-900 hover:underline tracking-wide uppercase transition-colors outline-none"
          >
            Clear Filters
          </button>
        </div>

        {/* Grid Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-5 shrink-0">
          
          {/* SEARCH */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Search Keywords</label>
            <div className="relative flex items-center w-full">
              <Search size={15} className="absolute left-4 text-slate-400 pointer-events-none" />
              <input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Search records..." 
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl bg-white text-sm md:text-base font-extrabold text-slate-600 focus:ring-2 focus:ring-[#5C1313]/20 outline-none hover:bg-slate-50 transition-colors placeholder-slate-400" 
              />
            </div>
          </div>

          {/* ROLE / CATEGORY */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Role</label>
            <div className="relative flex items-center w-full">
              <Shield size={15} className="absolute left-4 text-slate-400 pointer-events-none" />
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                className="cursor-pointer appearance-none w-full pl-10 pr-10 py-3 border border-slate-200 rounded-2xl bg-white text-sm md:text-base font-extrabold text-slate-600 focus:ring-2 focus:ring-[#5C1313]/20 outline-none hover:bg-slate-50 transition-colors"
              >
                <option value="All">All Roles</option>
                {roles.map((r) => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
              <div className="absolute right-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500 w-0 h-0" />
            </div>
          </div>

          {/* FROM DATE */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">From Date</label>
            <div className="relative flex items-center w-full">
              <Calendar size={15} className="absolute left-4 text-slate-400 pointer-events-none z-10" />
              <input 
                type="date" 
                value={startDate} 
                min="2025-01-01" 
                max={todayStr} 
                onChange={(e) => setStartDate(e.target.value)} 
                onClick={(e) => e.target.showPicker?.()} 
                className="cursor-pointer w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl bg-white text-sm md:text-base font-extrabold text-slate-600 focus:ring-2 focus:ring-[#5C1313]/20 outline-none hover:bg-slate-50 transition-colors" 
              />
            </div>
          </div>

          {/* TO DATE */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">To Date</label>
            <div className="relative flex items-center w-full">
              <Calendar size={15} className="absolute left-4 text-slate-400 pointer-events-none z-10" />
              <input 
                type="date" 
                value={endDate} 
                min="2025-01-01" 
                max={todayStr} 
                onChange={(e) => setEndDate(e.target.value)} 
                onClick={(e) => e.target.showPicker?.()} 
                className="cursor-pointer w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl bg-white text-sm md:text-base font-extrabold text-slate-600 focus:ring-2 focus:ring-[#5C1313]/20 outline-none hover:bg-slate-50 transition-colors" 
              />
            </div>
          </div>

        </div>
      </div>

      {/* Data */}
      <div className="flex-1 h-auto">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
              <p className="text-sm font-semibold text-slate-500 tracking-wide animate-pulse">Synchronizing Logs...</p>
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-64 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
              <Search size={40} className="text-slate-300 mb-3" />
              <p className="font-bold text-slate-700">No logs match your criteria</p>
              <p className="text-sm text-slate-500 mt-1">Try adjusting your search terms or filters.</p>
            </motion.div>
          ) : (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                <span className="font-black text-lg text-slate-700">Activity Records</span>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full">
                    Showing <strong>{filtered.length}</strong> entries
                  </span>
                  <button 
                    onClick={fetchData} disabled={loading}
                    className="flex items-center justify-center gap-1.5 text-white px-5 py-2.5 rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all duration-300 font-semibold text-base disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    Refresh Data
                  </button>
                </div>
              </div>
              
              <div className="hidden md:block">
                <ActivityTable logs={filtered} onView={(log) => setSelectedLog(log)} />
              </div>
              <div className="block md:hidden p-4">
                <ActivityCardList logs={filtered} onView={(log) => setSelectedLog(log)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {selectedLog && (
              <ActivityDetailsModal log={selectedLog} onClose={() => setSelectedLog(null)} />
            )}
          </AnimatePresence>,
          document.body
        )}
    </motion.div>
  );
}