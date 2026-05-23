import { Award, Zap } from "lucide-react";

export default function PointsPanel() {
  return (
    <div className="group relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-indigo-950">
      
      {/* Vector background flair */}
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-yellow-400/10 rounded-full blur-xl group-hover:bg-yellow-400/20 transition-all duration-500" />

      {/* Header Container */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-yellow-400 animate-bounce duration-1000" style={{ animationDuration: '3s' }} />
          <h2 className="font-bold text-gray-200 tracking-wide text-sm uppercase">Your Points</h2>
        </div>
        <span className="bg-indigo-700/50 text-indigo-200 text-xs px-2.5 py-1 rounded-full font-medium border border-indigo-600/30">
          Rank #12
        </span>
      </div>

      {/* Numerical readouts */}
      <div className="mt-4 flex items-baseline gap-2">
        <p className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-yellow-200 tracking-tight">
          450
        </p>
        <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider bg-yellow-400/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
          <Zap size={10} fill="currentColor" /> PTS
        </span>
      </div>

      {/* Status Details */}
      <p className="text-sm font-semibold text-indigo-200 mt-1.5 sm:mt-2">
        Level 1: <span className="text-yellow-400 font-bold">Seeker Status</span>
      </p>

      {/* Progress Section */}
      <div className="mt-5 sm:mt-6">
        <div className="relative h-2.5 bg-indigo-950 rounded-full overflow-hidden p-[2px] border border-indigo-800/40">
          {/* Animated loading pulse bar filler */}
          <div 
            className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full w-1/3 relative shadow-[0_0_12px_rgba(234,179,8,0.4)] transition-all duration-500 group-hover:brightness-110" 
          >
            {/* Inner glow line */}
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-indigo-300/90 font-medium">
            <span className="text-white font-semibold">890</span> more points to go
          </p>
          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
            33% Complete
          </p>
        </div>
      </div>
      
    </div>
  );
}