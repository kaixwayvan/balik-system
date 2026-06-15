import { Brain, CheckCircle2, Clock, Percent, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function AIMatchesStats({ matches = [] }) {
  const approved = matches.filter((m) => m.status === "Approved").length;
  const pending = matches.filter((m) => m.status === "Pending").length;
  const avgConf = matches.length
    ? Math.floor(
        matches.reduce((sum, current) => sum + current.confidence, 0) /
          matches.length
      ) + "%"
    : "0%";

  const stats = [
    {
      label: "Total Matches",
      value: matches.length,
      icon: Brain,
      grad: "from-indigo-100 to-indigo-50 border-indigo-200/80 shadow-indigo-900/5",
      iconCss: "text-indigo-600 bg-white shadow-sm",
    },
    {
      label: "Approved",
      value: approved,
      icon: CheckCircle2,
      grad: "from-emerald-100 to-emerald-50 border-emerald-200/80 shadow-emerald-900/5",
      iconCss: "text-emerald-600 bg-white shadow-sm",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      grad: "from-amber-100 to-amber-50 border-amber-200/80 shadow-amber-900/5",
      iconCss: "text-amber-600 bg-white shadow-sm",
    },
    {
      label: "Avg. Confidence",
      value: avgConf,
      icon: Percent,
      grad: "from-purple-100 to-purple-50 border-purple-200/80 shadow-purple-900/5",
      iconCss: "text-purple-600 bg-white shadow-sm",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const cardItem = {
    hidden: { opacity: 0, scale: 0.96, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 25 } }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-4.5">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={i}
            variants={cardItem}
            className={`cursor-pointer bg-gradient-to-br ${s.grad} border rounded-[2rem] p-5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between`}
          >
            <div className="flex justify-between items-start w-full">
              <div className={`p-2.5 rounded-2xl ${s.iconCss} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                <Icon size={18} strokeWidth={2.5} />
              </div>
              <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[12px] font-black tracking-tight border bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                <TrendingUp size={10} strokeWidth={3} />
                <span>Live</span>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-none">{s.value}</h3>
              <p className="mt-2 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block truncate">{s.label}</p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}