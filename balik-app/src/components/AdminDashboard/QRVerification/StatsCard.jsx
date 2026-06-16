import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatsCards({ stats, loading }) {
  const styleConfig = {
    "Total Scans": {
      grad: "from-blue-100 to-blue-50 border-blue-200/80 shadow-blue-900/5",
      iconCss: "text-blue-600 bg-white shadow-sm",
      trend: "up",
      change: "+14%",
    },
    "Approved": {
      grad: "from-emerald-100 to-emerald-50 border-emerald-200/80 shadow-emerald-900/5",
      iconCss: "text-emerald-600 bg-white shadow-sm",
      trend: "up",
      change: "+8%",
    },
    "Rejected": {
      grad: "from-rose-100 to-rose-50 border-rose-200/80 shadow-rose-900/5",
      iconCss: "text-rose-600 bg-white shadow-sm",
      trend: "down",
      change: "-2%",
    },
    "Pending": {
      grad: "from-amber-100 to-amber-50 border-amber-200/80 shadow-amber-900/5",
      iconCss: "text-amber-600 bg-white shadow-sm",
      trend: "up",
      change: "+5%",
    },
  };

  const fallbackStyle = {
    grad: "from-slate-100 to-slate-50 border-slate-200/80 shadow-slate-900/5",
    iconCss: "text-slate-600 bg-white shadow-sm",
    trend: "up",
    change: "+0%",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 8 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 25 } }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 shrink-0 w-full">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-100/80 rounded-[2rem] p-5 h-[140px] shadow-sm border border-slate-200/60 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 shrink-0 w-full"
    >
      {stats.map((item, i) => {
        const Icon = item.icon;
        const config = styleConfig[item.label] || fallbackStyle;

        return (
          <motion.div
            key={i}
            variants={cardVariants}
            className={`cursor-pointer bg-gradient-to-br ${config.grad} border rounded-[2rem] p-5 sm:p-6 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between`}
          >
            <div className="flex justify-between items-start w-full">
              <div className={`p-2.5 sm:p-3 rounded-2xl ${config.iconCss} group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                <Icon size={22} strokeWidth={2.5} />
              </div>
              
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-black tracking-tight border ${
                config.trend === "up" 
                  ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" 
                  : "bg-rose-500/10 text-rose-700 border-rose-500/20"
              }`}>
                {config.trend === "up" ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
                <span>{config.change}</span>
              </div>
            </div>

            <div className="mt-5 sm:mt-6">
              <p className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight leading-none mb-1.5">{item.value}</p>
              <p className="text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-widest block truncate">{item.label}</p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}