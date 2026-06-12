import { Search, Waves, Clock, SquaresExclude, QrCode, UserSearch, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function StatCards() {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setStatsData([
        { 
          icon: Search, value: "1,245", label: "Total Lost Items", change: "+12%", trend: "up", 
          grad: "from-rose-100 to-rose-50 border-rose-200/80 shadow-rose-900/5", 
          iconCss: "text-rose-600 bg-white shadow-sm" 
        },
        { 
          icon: Waves, value: "892", label: "Total Found Items", change: "+5%", trend: "up", 
          grad: "from-emerald-100 to-emerald-50 border-emerald-200/80 shadow-emerald-900/5", 
          iconCss: "text-emerald-600 bg-white shadow-sm" 
        },
        { 
          icon: Clock, value: "430", label: "Successful Claims", change: "+18%", trend: "up", 
          grad: "from-blue-100 to-blue-50 border-blue-200/80 shadow-blue-900/5", 
          iconCss: "text-blue-600 bg-white shadow-sm" 
        },
        { 
          icon: SquaresExclude, value: "156", label: "AI Matches", change: "+8%", trend: "up", 
          grad: "from-purple-100 to-purple-50 border-purple-200/80 shadow-purple-900/5", 
          iconCss: "text-purple-600 bg-white shadow-sm" 
        },
        { 
          icon: QrCode, value: "89", label: "QR Verified", change: "-2%", trend: "down", 
          grad: "from-amber-100 to-amber-50 border-amber-200/80 shadow-amber-900/5", 
          iconCss: "text-amber-600 bg-white shadow-sm" 
        },
        { 
          icon: UserSearch, value: "312", label: "Guest Reports", change: "+24%", trend: "up", 
          grad: "from-indigo-100 to-indigo-50 border-indigo-200/80 shadow-indigo-900/5", 
          iconCss: "text-indigo-600 bg-white shadow-sm" 
        },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } }
  };

  const cardItem = {
    hidden: { opacity: 0, scale: 0.96, y: 8 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 25 } }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-slate-100/80 rounded-[2rem] p-5 h-36 shadow-sm border border-slate-200/60 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statsData.map((s, i) => {
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
              <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[12px] font-black tracking-tight border ${
                s.trend === "up" ? "bg-emerald-500/8 text-emerald-700 border-emerald-500/20" : "bg-rose-500/8 text-rose-700 border-rose-500/20"
              }`}>
                {s.trend === "up" ? <TrendingUp size={10} strokeWidth={3} /> : <TrendingDown size={10} strokeWidth={3} />}
                <span>{s.change}</span>
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