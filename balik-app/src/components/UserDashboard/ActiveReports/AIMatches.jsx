import { Brain, MapPin, CircleCheckBig } from "lucide-react";
import Id from "../../../assets/home-assets/img-items/id.png";

export default function AIMatches({ matches, onClaim }) {
  if (!matches || matches.length === 0) return null;

  return (
    <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-8 shadow-inner animate-in slide-in-from-top-4 duration-500">
      <h4 className="font-black text-slate-900 flex items-center gap-3 mb-6 uppercase tracking-tight text-lg">
        <Brain size={24} className="text-yellow-600" /> AI-Powered Match Suggestions
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matches.map((match, i) => {
          // Calculate confidence based on similarity (0 to 1)
          const confidence = Math.round((match.similarity || 0) * 100);

          return (
            <div key={match.id || i} className="bg-white border-2 border-slate-50 rounded-[2rem] p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex gap-4">
                <div className="relative">
                  <img
                    src={match.image_url || "https://images.unsplash.com/photo-1544391439-1dfdc422e178?auto=format&fit=crop&q=80&w=400"}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-50 shadow-sm transition-transform group-hover:scale-105"
                    alt={match.title}
                  />
                  <div className="absolute -top-2 -left-2 bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
                    {match.category}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-black text-slate-900 truncate uppercase tracking-tighter text-base">{match.title}</h5>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence</p>
                      <p className="text-yellow-600 font-black text-lg leading-none">
                        {confidence}%
                      </p>
                    </div>
                  </div>

                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${confidence}%`,
                        background: "linear-gradient(to right, #FFB639, #E30000)",
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                      <MapPin size={12} className="text-slate-400" /> {match.location}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Reported on {new Date(match.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={onClaim}
                  className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-black py-3 rounded-xl shadow-lg shadow-green-200 transition-all active:scale-95 uppercase tracking-widest"
                >
                  <CircleCheckBig size={14} />
                  Claim Item
                </button>

                <button className="cursor-pointer flex-1 border-2 border-slate-100 text-slate-400 font-black text-[10px] py-3 rounded-xl hover:bg-slate-50 transition-all uppercase tracking-widest">
                  Not My Item
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
