import { Brain, MapPin, CircleCheckBig, Sparkles, XCircle } from "lucide-react";

export default function AIMatches({ matches, onClaim, onNotMine }) {
  if (!matches || matches.length === 0) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-100/50 via-amber-50/70 to-rose-100 border border-[#D1B5A5]/50 p-6 sm:p-8 md:p-10 shadow-[0_30px_70px_-15px_rgba(165,180,252,0.25)] animate-in slide-in-from-top-6 duration-700 ease-out rounded-[2.5rem]">

      {/* Gradients */}
      <div className="absolute top-0 right-10 w-[350px] h-[350px] bg-gradient-to-br from-amber-300/50 to-orange-400/30 blur-[90px] rounded-full pointer-events-none mix-blend-multiply animate-pulse duration-[6000ms]" />
      <div className="absolute -bottom-10 left-10 w-[450px] h-[450px] bg-gradient-to-tr from-indigo-300/40 via-purple-300/30 to-transparent blur-[110px] rounded-full pointer-events-none mix-blend-multiply animate-pulse duration-[8000ms]" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-rose-300/30 blur-[80px] rounded-full pointer-events-none mix-blend-screen animate-bounce [animation-duration:14s]" />

      {/* Hairline vector */}
      <div className="absolute inset-0 border border-[#FAE3CF] pointer-events-none rounded-[2.5rem] m-[1px rounded-[2.5rem]" />
      
      {/* Header Section */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 border-b border-white pb-4 sm:pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-50 border border-amber-200 text-amber-600 shadow-inner">
            <Brain size={22} className="animate-pulse" />
          </div>
          <div>
            <h4 className="font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-amber-600 to-slate-800 uppercase tracking-wider text-xl sm:text-xl">
              AI-Powered Suggestions
            </h4>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-wide mt-0.5">
              Neural matching engine evaluation against active repository
            </p>
          </div>
        </div>

        {/* Smart Badge */}
        <div className="self-start sm:self-center flex items-center gap-1.5 bg-white/80 backdrop-blur-md border border-slate-200 px-3 py-1 rounded-full shadow-sm">
          <Sparkles
            size={12}
            className="text-amber-500 animate-spin [animation-duration:4s]"
          />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
            {matches.length} {matches.length === 1 ? "Match" : "Matches"} Found
          </span>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {matches.map((match, i) => {
          const confidence = Math.round((match.similarity || 0) * 100);

          return (
            <div
              key={match.id || i}
              className="group relative flex flex-col h-full bg-white/60 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-lg hover:shadow-xl hover:border-slate-300 hover:bg-white transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex gap-4 flex-1">
                {/* Image Container */}
                <div className="relative shrink-0">
                  <img
                    src={
                      match.image_url ||
                      "https://images.unsplash.com/photo-1544391439-1dfdc422e178?auto=format&fit=crop&q=80&w=400"
                    }
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border border-slate-100 shadow-sm transition-transform duration-500 group-hover:scale-105"
                    alt={match.title}
                  />
                  <div className="absolute -top-2 -left-2 z-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-md uppercase tracking-wide border border-blue-400/30">
                    {match.category}
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2 gap-3">
                    <h5 className="font-bold text-slate-800 truncate uppercase tracking-wide text-sm sm:text-base group-hover:text-amber-700 transition-colors">
                      {match.title}
                    </h5>

                    {/* Confidence Indicator */}
                    <div className="text-right shrink-0">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                        Confidence
                      </p>
                      <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 font-black text-base sm:text-lg leading-none">
                        {confidence}%
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3 border border-slate-200/50 shadow-inner">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out relative"
                      style={{
                        width: `${confidence}%`,
                        background:
                          "linear-gradient(to right, #F59E0B, #EF4444)",
                      }}
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-white/30 to-transparent w-full h-full animate-[shimmer_2s_infinite]" />
                    </div>
                  </div>

                  {/* Metadata fields */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1.5 font-medium truncate">
                      <MapPin size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate">{match.location}</span>
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      Processed:{" "}
                      {new Date(
                        match.created_at || Date.now(),
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
                <button
                  onClick={() => onClaim(match)}
                  className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-[10px] sm:text-xs font-black py-2.5 sm:py-3 rounded-3xl shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 active:scale-95 uppercase tracking-widest border border-emerald-400/20"
                >
                  <CircleCheckBig size={13} className="shrink-0" />
                  Claim
                </button>

                <button
                  onClick={() => onNotMine && onNotMine(match.id)}
                  className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 bg-white border-2 border-slate-100 text-slate-500 font-black text-[10px] sm:text-xs py-2.5 sm:py-3 rounded-3xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all uppercase tracking-widest active:scale-95"
                >
                  <XCircle size={13} className="shrink-0" />
                  Not Mine
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}