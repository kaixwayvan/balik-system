import { useEffect, useState } from "react";
import { Trophy, HeartHandshake, Search, Medal, TrendingUp } from "lucide-react";

export default function OverviewCards() {
  const [stats, setStats] = useState({ loading: true });

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalPoints: 124500,
        pointChange: "+14%",
        topFinder: { name: "Maria Clara", points: 8450 },
        badges: [
          { name: "Good Samaritan", count: 142, icon: HeartHandshake, color: "text-rose-500 bg-rose-50 border-rose-100" },
          { name: "Super Finder", count: 89, icon: Search, color: "text-blue-500 bg-blue-50 border-blue-100" },
          { name: "Campus Hero", count: 34, icon: Medal, color: "text-purple-500 bg-purple-50 border-purple-100" },
        ],
        loading: false
      });
    }, 600);
  }, []);

  if (stats.loading) return <div className="h-64 w-full bg-slate-50 rounded-[2rem] border border-slate-100 animate-pulse" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      
      {/* Metrics Card */}
      <div className="relative bg-gradient-to-br from-slate-50 via-white to-rose-50/40 rounded-[2rem] p-6 shadow-[0_12px_30px_rgba(92,19,19,0.05)] border border-slate-200/60 flex flex-col justify-between group overflow-hidden">
        
        {/* Glowing Orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#5C1313]/15 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Grid Texture Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:34px_44px] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <h3 className="font-extrabold text-lg text-slate-400 tracking-wider uppercase">System Pool Metrics</h3>
          <span className="cursor-pointer text-[11px] font-black text-[#5C1313] bg-[#5C1313]/10 px-3 py-1 rounded-full hover:bg-[#5C1313]/20 active:scale-95 transition-all backdrop-blur-md">
            Details
          </span>
        </div>
        
        <div className="relative z-10 py-5 flex flex-col items-start">
          <p className="text-4xl sm:text-5xl font-black text-[#5C1313] tracking-tighter group-hover:translate-x-1 transition-transform duration-300">
            {stats.totalPoints.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Total Points Distributed</p>
        </div>
        
        <div className="relative z-10 w-full">
          <div className="w-full bg-slate-200/70 h-2.5 rounded-full overflow-hidden border border-white mt-2 flex shadow-inner">
            <div className="bg-gradient-to-r from-[#5C1313] to-[#A33838] h-full rounded-full w-[78%] relative">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[size:1rem_1rem] animate-[pulse_2s_infinite]" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-slate-500 text-xs font-semibold">
            <TrendingUp className="text-emerald-600" size={14} strokeWidth={3} />
            <span className="text-emerald-600 font-bold">{stats.pointChange}</span>
            <span>activity index growth</span>
          </div>
        </div>
      </div>

      {/* Top Finder Card */}
      <div className="relative bg-gradient-to-b from-[#5C1313] via-[#4A0F0F] to-[#2A0808] rounded-[2rem] p-6 shadow-xl overflow-hidden flex flex-col justify-between group border border-black/20">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-amber-400 opacity-15 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between">
          <h3 className="font-extrabold text-lg text-red-200/60 tracking-wider uppercase">Top Finder</h3>
          <span className="cursor-pointer text-[11px] font-black text-[#E8B86D] bg-[#E8B86D]/20 px-3 py-1 rounded-full hover:bg-[#E8B86D]/30 active:scale-95 transition-all">Leaderboard</span>
        </div>
        
        <div className="relative z-10 py-4 flex items-center gap-4">
          <div className="w-17 h-17 rounded-2xl bg-gradient-to-br from-[#E8B86D] to-amber-600 flex items-center justify-center shadow-lg border border-white/20 group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300 shrink-0">
            <Trophy className="text-white drop-shadow-sm" size={26} strokeWidth={2.5} />
          </div>
          <div className="block truncate">
            <p className="font-black text-3xl text-white tracking-tight truncate">{stats.topFinder.name}</p>
            <p className="text-[13px] font-extrabold text-[#E8B86D] uppercase tracking-widest mt-0.5">{stats.topFinder.points.toLocaleString()} PTS AMASSED</p>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-3 flex items-center justify-between text-[10px] text-red-200/50 font-bold uppercase tracking-wider">
          <span>Active Streak</span>
          <span className="text-white font-black bg-white/10 px-2 py-0.5 rounded-md">14 Days</span>
        </div>
      </div>

      {/* Popular Badges Card */}
      <div className="relative bg-gradient-to-br from-white via-slate-50 to-blue-50/30 rounded-[2rem] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.03)] border border-slate-200/60 flex flex-col justify-between overflow-hidden">
        
        {/* Background Glows */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-10 -right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-lg text-slate-400 tracking-wider uppercase">Popular Badges</h3>
          <span className="cursor-pointer text-[11px] font-black text-slate-500 bg-slate-200/60 backdrop-blur-md px-3 py-1 rounded-full hover:bg-slate-200 active:scale-95 transition-all border border-white/40">Milestones</span>
        </div>
        
        <div className="relative z-10 space-y-2.5 w-full">
          {stats.badges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div 
                key={i} 
                className="cursor-pointer flex items-center justify-between p-3.5 rounded-2xl bg-white/70 border border-slate-100 hover:border-slate-300/80 hover:bg-white/95 transition-all duration-300 group shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 block truncate">
                  <div className={`p-2 rounded-xl border ${badge.color} group-hover:scale-110 group-hover:rotate-3 transition-transform shrink-0 shadow-sm`}>
                    <Icon size={15} strokeWidth={2.5} />
                  </div>
                  <span className="text-md font-black text-slate-700 tracking-tight truncate">{badge.name}</span>
                </div>
                <span className="text-[12px] font-black text-slate-600 bg-slate-50/90 px-2.5 py-1 rounded-lg border border-slate-100 shadow-2xs shrink-0 group-hover:bg-slate-100 transition-colors">
                  {badge.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}