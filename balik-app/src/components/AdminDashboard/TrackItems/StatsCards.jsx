import { Package, Search, Archive, CheckCircle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsCards({ stats = {}, loading = false }) {
  const statsData = [
    { 
      icon: Package, value: stats.total ?? 0, label: "Total Reports", change: "Active", 
      grad: "from-indigo-100 to-indigo-50 border-indigo-200/80 shadow-indigo-900/5", 
      iconCss: "text-indigo-600 bg-white shadow-sm" 
    },
    { 
      icon: Search, value: stats.lost ?? 0, label: "Lost Items", change: "Tracking", 
      grad: "from-rose-100 to-rose-50 border-rose-200/80 shadow-rose-900/5", 
      iconCss: "text-rose-600 bg-white shadow-sm" 
    },
    { 
      icon: Archive, value: stats.found ?? 0, label: "Found Items", change: "Secured", 
      grad: "from-amber-100 to-amber-50 border-amber-200/80 shadow-amber-900/5", 
      iconCss: "text-amber-600 bg-white shadow-sm" 
    },
    { 
      icon: CheckCircle, value: stats.claimed ?? 0, label: "Successfully Claimed", change: "Resolved", 
      grad: "from-emerald-100 to-emerald-50 border-emerald-200/80 shadow-emerald-900/5", 
      iconCss: "text-emerald-600 bg-white shadow-sm" 
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardItem = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-100/60 rounded-[2rem] p-5 h-36 shadow-sm border border-slate-200/50 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statsData.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={i}
            variants={cardItem}
            className={`cursor-pointer bg-gradient-to-br ${s.grad} border rounded-[2rem] p-5 sm:p-6 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between`}
          >
            <div className="flex justify-between items-start w-full">
              <div className={`p-3 rounded-2xl ${s.iconCss} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                <Icon size={20} strokeWidth={2.5} />
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border bg-white/40 border-white/60 text-slate-700 shadow-sm">
                <TrendingUp size={12} strokeWidth={2.5} className="text-emerald-500" />
                <span>{s.change}</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight leading-none">{s.value}</h3>
              <p className="mt-2 text-[11px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-widest block truncate">{s.label}</p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}