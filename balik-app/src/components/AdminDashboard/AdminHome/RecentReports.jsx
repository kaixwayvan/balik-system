import { useState, useEffect } from "react";
import { Search, Sparkles, Filter, Eye, Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function RecentReports() {
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setItems([
        { id: 1, date: "Jun 10, 2026", item: "MacBook Pro M3", desc: "Space Gray, 14-inch", type: "Lost", location: "Library 2nd Floor", name: "Alex Reyes", status: "Pending", aiMatch: "92% Match" },
        { id: 2, date: "Jun 09, 2026", item: "HydroFlask", desc: "Blue with stickers", type: "Found", location: "Cafeteria", name: "Samira Cruz", status: "Resolved", aiMatch: "AI Processed" },
        { id: 3, date: "Jun 08, 2026", item: "Car Keys", desc: "Honda keyfob", type: "Found", location: "Parking Lot B", name: "John Doe", status: "Verified", aiMatch: "No Match" },
        { id: 4, date: "Jun 08, 2026", item: "Leather Wallet", desc: "Brown, contains IDs", type: "Lost", location: "Engineering Bldg", name: "Mike Tan", status: "Pending", aiMatch: "75% Match" },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const styles = {
    type: { Lost: "bg-rose-50 text-rose-700 border-rose-200/60", Found: "bg-emerald-50 text-emerald-700 border-emerald-200/60" },
    status: { Pending: "bg-amber-50 text-amber-700 border-amber-200/60", Verified: "bg-blue-50 text-blue-700 border-blue-200/60", Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200/60" },
    ai: { "No Match": "bg-slate-50 text-slate-500 border-slate-200/60", "AI Processed": "bg-emerald-50 text-emerald-700 border-emerald-200/60", default: "bg-purple-50 text-purple-700 border-purple-200/60" }
  };

  const getAiStyle = (match) => match === "No Match" ? styles.ai["No Match"] : match === "AI Processed" ? styles.ai["AI Processed"] : styles.ai.default;

  const filteredItems = items.filter(item => filter === "All" || item.status === filter);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-200/60 w-full"
    >
      
      {/* Table Header Layout */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6 sm:mb-8 w-full">
        <h2 className="font-black text-xl sm:text-2xl md:text-3xl text-slate-800 tracking-wide uppercase">
          RECENT REPORTS
        </h2>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:items-center gap-3 w-full xl:w-auto">
          
          {/* Search Box */}
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:ring-2 focus-within:ring-[#5C1313]/20 focus-within:border-[#5C1313] transition-all w-full md:w-60 lg:w-72">
            <Search size={18} className="text-slate-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search records..." 
              className="w-full bg-transparent text-sm md:text-base font-bold outline-none text-slate-700 placeholder-slate-400" 
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative flex items-center w-full md:w-56">
            <Filter size={15} className="absolute left-4 text-slate-400 pointer-events-none" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)} 
              className="cursor-pointer appearance-none w-full pl-10 pr-10 py-3 border border-slate-200 rounded-2xl bg-white text-sm md:text-base font-extrabold text-slate-600 focus:ring-2 focus:ring-[#5C1313]/20 outline-none hover:bg-slate-50 transition-colors"
            >
              <option value="All">All Status Options</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
            </select>
            <div className="absolute right-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500 w-0 h-0" />
          </div>

          {/* NLP Parse Action Action Trigger Button */}
          <button className="cursor-pointer sm:col-span-2 md:flex-none flex items-center justify-center gap-2 bg-[#5C1313] hover:bg-[#4A0F0F] active:scale-95 text-white px-6 py-3 rounded-2xl text-sm md:text-base font-black shadow-sm transition-all duration-200">
            <Sparkles size={16} strokeWidth={2.5} /> <span>NLP Parse</span>
          </button>
        </div>
      </div>

      {/* Responsive View Switcher: Stack list for Small Mobile screens */}
      <div className="block lg:hidden space-y-4 w-full">
        {loading ? (
          <div className="py-12 text-center text-sm font-bold text-slate-400 animate-pulse">Syncing Mobile Matrix...</div>
        ) : filteredItems.length === 0 ? (
          <div className="py-12 text-center text-sm font-bold text-slate-400">No entries found.</div>
        ) : filteredItems.map((item) => (
          <div key={item.id} className="bg-slate-50/70 border border-slate-200/60 p-4 sm:p-5 rounded-2xl space-y-4 relative group">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="font-black text-slate-800 text-base sm:text-lg leading-snug">{item.item}</p>
                <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black border uppercase tracking-wider shrink-0 ${styles.type[item.type]}`}>
                {item.type}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-slate-500 border-t border-b border-slate-200/40 py-3">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-400 shrink-0" />
                <span>{item.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-slate-400 shrink-0" />
                <span>{item.location}</span>
              </div>
              <div className="sm:col-span-2 text-slate-600 font-bold">
                Reporter: <span className="text-slate-800">{item.name}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-1 gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black border uppercase ${styles.status[item.status]}`}>
                  {item.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1 ${getAiStyle(item.aiMatch)}`}>
                  {item.aiMatch}
                </span>
              </div>
              
              <button className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-[#5C1313] px-4 py-2 rounded-xl text-xs sm:text-sm font-black shadow-2xs transition-all">
                <Eye size={14} strokeWidth={2.5} />
                <span>View Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop/Tablet Table Structure */}
      <div className="hidden lg:block overflow-x-auto custom-scrollbar w-full">
        <table className="w-full text-left min-w-[900px] border-collapse">
          <thead className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-wider border-b border-slate-200/60 bg-slate-50/50">
            <tr>
              <th className="py-4 px-4 rounded-tl-xl">Date</th>
              <th className="py-4 px-4">Item details</th>
              <th className="py-4 px-4">Type</th>
              <th className="py-4 px-4">Reporter context</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">AI Intelligence</th>
              <th className="py-4 px-4 text-right rounded-tr-xl">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm md:text-base">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-16 text-center font-bold text-slate-400 animate-pulse">
                  Syncing System Reports...
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-16 text-center font-bold text-slate-400">
                  No records match your selected criteria.
                </td>
              </tr>
            ) : filteredItems.map((item) => (
              <tr key={item.id} className="border-b border-slate-100/80 hover:bg-slate-50/40 transition-colors group">
                <td className="py-5 px-4 font-bold text-slate-500 whitespace-nowrap">
                  {item.date}
                </td>
                <td className="py-5 px-4 max-w-[240px]">
                  <p className="font-black text-slate-800 tracking-tight truncate">{item.item}</p>
                  <p className="text-xs md:text-sm font-medium text-slate-400 truncate mt-0.5">{item.desc}</p>
                </td>
                <td className="py-5 px-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-black border uppercase tracking-wider ${styles.type[item.type]}`}>
                    {item.type}
                  </span>
                </td>
                <td className="py-5 px-4 max-w-[180px]">
                  <p className="font-bold text-slate-700 truncate">{item.name}</p>
                  <p className="text-xs md:text-sm font-medium text-slate-400 truncate mt-0.5">{item.location}</p>
                </td>
                <td className="py-5 px-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-black border uppercase tracking-wider ${styles.status[item.status]}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-5 px-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-black border flex items-center w-max gap-1.5 ${getAiStyle(item.aiMatch)}`}>
                    {item.aiMatch.includes("%") && <Sparkles size={12} strokeWidth={2.5} />}
                    <span>{item.aiMatch}</span>
                  </span>
                </td>
                <td className="py-5 px-4 text-right whitespace-nowrap">
                  <button className="cursor-pointer inline-flex items-center gap-1.5 bg-white hover:bg-[#5C1313] hover:text-white border border-slate-200 text-[#5C1313] px-4 py-2 rounded-xl text-xs md:text-sm font-black shadow-2xs hover:shadow-sm focus:ring-2 focus:ring-[#5C1313]/20 transition-all duration-200">
                    <Eye size={14} strokeWidth={2.5} />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}