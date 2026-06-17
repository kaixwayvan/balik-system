import { Users, CheckCircle, Gift, BarChart, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsCard({ title, value, type, change, trend, loading = false }) {
  const styles = {
    users: {
      icon: Users,
      grad: "from-blue-100 to-blue-50 border-blue-200/80 shadow-blue-900/5", 
      iconCss: "text-blue-600 bg-white shadow-sm"
    },
    active: {
      icon: CheckCircle,
      grad: "from-emerald-100 to-emerald-50 border-emerald-200/80 shadow-emerald-900/5", 
      iconCss: "text-emerald-600 bg-white shadow-sm"
    },
    rewards: {
      icon: Gift,
      grad: "from-purple-100 to-purple-50 border-purple-200/80 shadow-purple-900/5", 
      iconCss: "text-purple-600 bg-white shadow-sm"
    },
    completion: {
      icon: BarChart,
      grad: "from-rose-100 to-rose-50 border-rose-200/80 shadow-rose-900/5", 
      iconCss: "text-rose-600 bg-white shadow-sm"
    },
  };

  const currentStyle = styles[type] || styles.users;
  const Icon = currentStyle.icon;

  if (loading) {
    return (
      <div className="bg-slate-100/80 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-5 h-[120px] sm:h-[140px] animate-pulse border border-slate-200/50 w-full" />
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`cursor-default bg-gradient-to-br ${currentStyle.grad} border rounded-[1.5rem] sm:rounded-[2rem] p-3.5 sm:p-6 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.02)] hover:shadow-xl transition-shadow duration-300 group flex flex-col justify-between overflow-hidden w-full`}
    >
      <div className="flex flex-row justify-between items-start w-full gap-2">
        <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${currentStyle.iconCss} group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 w-fit shrink-0`}>
          <Icon className="w-4 h-4 sm:w-[22px] sm:h-[22px]" strokeWidth={2.5} />
        </div>
        
        <div className={`flex items-center gap-0.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-black tracking-tight border w-fit shrink-0 ${
          trend === "down" ? "bg-rose-500/10 text-rose-700 border-rose-500/20" : "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
        }`}>
          {trend === "down" ? <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={3} /> : <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={3} />}
          <span>{change}</span>
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        <div className="flex items-baseline gap-0.5 block truncate">
          <span className="text-xl sm:text-4xl font-black text-slate-800 tracking-tight leading-none">
            {value}
          </span>
          {type === "completion" && <span className="text-sm sm:text-xl font-black text-slate-800">%</span>}
        </div>
        
        <p className="text-[9px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-widest block truncate mt-1 sm:mt-1.5">
          {title}
        </p>

        {type === "completion" && (
          <div className="w-full bg-slate-200/60 h-1 sm:h-1.5 rounded-full mt-2 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-rose-500 rounded-full"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}