import { SlidersHorizontal, Search, Filter, X } from "lucide-react";
import { motion } from "framer-motion";

export default function UserFilterBar({ search, setSearch, roleFilter, setRoleFilter }) {
  const clearFilters = () => {
    setRoleFilter("All");
    setSearch("");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-md rounded-[2rem] shadow-sm border border-slate-200/70 p-5 sm:p-6 shrink-0"
    >
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
            <SlidersHorizontal size={18} />
          </div>
          <h2 className="font-extrabold text-xl text-slate-800 tracking-tight uppercase">Filter Directory</h2>
        </div>
        {(search !== "" || roleFilter !== "All") && (
          <button onClick={clearFilters} className="cursor-pointer flex items-center gap-1.5 font-bold text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-full transition-colors">
            <X size={14} strokeWidth={3} /> Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        {/* Search Field */}
        <div className="md:col-span-8 flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Search Keywords</label>
          <div className="relative flex items-center w-full group">
            <Search size={15} className="absolute left-4 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user name or email..."
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl bg-slate-50 text-sm md:text-base font-extrabold text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none hover:bg-slate-50 transition-colors placeholder-slate-400"
            />
          </div>
        </div>

        {/* Role Select Field */}
        <div className="md:col-span-4 flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Role Type</label>
          <div className="relative flex items-center w-full group">
            <Filter size={15} className="absolute left-4 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="cursor-pointer appearance-none w-full pl-10 pr-10 py-3 border border-slate-200 rounded-2xl bg-slate-50 text-sm md:text-base font-extrabold text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none hover:bg-slate-50 transition-colors"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Administrators</option>
              <option value="User">Regular Users</option>
            </select>
            <div className="absolute right-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500 w-0 h-0" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}