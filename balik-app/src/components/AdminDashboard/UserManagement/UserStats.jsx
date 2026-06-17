import { Users, ShieldCheck, User, MonitorDot, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

export default function UserStats({ users, loading }) {
  const total = users.length;
  const admins = users.filter((u) => u.role === "Admin").length;
  const regular = users.filter((u) => u.role === "User").length;
  const active = users.filter((u) => u.status === "Active").length;

  const statsData = [
    { 
      label: "Total Users", value: total, icon: Users, change: "+12%", trend: "up", 
      grad: "from-blue-100 to-blue-50 border-blue-200/80 shadow-blue-900/5", 
      iconCss: "text-blue-600 bg-white shadow-sm" 
    },
    { 
      label: "System Admins", value: admins, icon: ShieldCheck, change: "Stable", trend: "up", 
      grad: "from-rose-100 to-rose-50 border-rose-200/80 shadow-rose-900/5", 
      iconCss: "text-rose-600 bg-white shadow-sm" 
    },
    { 
      label: "Regular Users", value: regular, icon: User, change: "+15%", trend: "up", 
      grad: "from-indigo-100 to-indigo-50 border-indigo-200/80 shadow-indigo-900/5", 
      iconCss: "text-indigo-600 bg-white shadow-sm" 
    },
    { 
      label: "Active Status", value: active, icon: MonitorDot, change: "-2%", trend: "down", 
      grad: "from-emerald-100 to-emerald-50 border-emerald-200/80 shadow-emerald-900/5", 
      iconCss: "text-emerald-600 bg-white shadow-sm" 
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 shrink-0">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-100/80 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-5 h-[120px] sm:h-[140px] animate-pulse border border-slate-200/50" />
        ))}
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 shrink-0 w-full">
      {statsData.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={i}
            variants={cardVariants}
            className={`cursor-default bg-gradient-to-br ${s.grad} border rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between overflow-hidden`}
          >
            <div className="flex flex-row justify-between items-start w-full gap-2">
              <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${s.iconCss} group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 w-fit shrink-0`}>
                <Icon className="w-5 h-5 sm:w-[22px] sm:h-[22px]" strokeWidth={2.5} />
              </div>
              
              <div className={`flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-black tracking-tight border w-fit shrink-0 ${
                s.trend === "up" ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" : "bg-rose-500/10 text-rose-700 border-rose-500/20"
              }`}>
                {s.trend === "up" ? <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={3} /> : <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={3} />}
                <span>{s.change}</span>
              </div>
            </div>

            <div className="mt-4 sm:mt-6">
              <p className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight leading-none mb-1 sm:mb-1.5">{s.value}</p>
              <p className="text-[9px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-widest block truncate">{s.label}</p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}