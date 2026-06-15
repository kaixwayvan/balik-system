import { X, CheckCircle2, Clock, CheckCircle, AlertTriangle, Info, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MatchingCompleteModal({
  open,
  onViewMatches,
  onClose,
  matches = [],
  processingTime = null
}) {
  const total = matches.length;
  const high = matches.filter(m => m.confidence >= 90).length;
  const med = matches.filter(m => m.confidence >= 70 && m.confidence < 90).length;
  const low = matches.filter(m => m.confidence < 70).length;

  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          key="complete-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
        >
          <motion.div 
            key="complete-content"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="bg-white w-full max-w-[600px] rounded-[2rem] shadow-2xl overflow-hidden relative"
          >
            {/* HEADER / CLOSE BUTTON */}
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={onClose}
                className="cursor-pointer p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors outline-none focus:ring-2 focus:ring-slate-200 active:scale-95"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* ICON & TITLE */}
              <div className="flex flex-col items-center text-center space-y-4 pt-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-30 rounded-full"></div>
                  <div className="relative bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200 p-4 rounded-3xl text-emerald-600">
                    <CheckCircle2 size={40} strokeWidth={2.5} />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight">
                    Matching Complete!
                  </h2>
                  <p className="text-slate-500 font-bold text-sm mt-1">
                    AI has analyzed all items and generated new matches.
                  </p>
                </div>
              </div>

              {/* STATS GRID */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center">
                  <p className="text-emerald-700 font-black text-xs uppercase tracking-widest mb-1">
                    New Matches
                  </p>
                  <p className="text-4xl font-black text-emerald-600">{total}</p>
                </div>

                <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center">
                  <p className="text-indigo-700 font-black text-xs uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <Clock size={14} strokeWidth={3} /> Process Time
                  </p>
                  <p className="text-4xl font-black text-indigo-600">
                    {processingTime ? `${processingTime}s` : '—'}
                  </p>
                </div>
              </div>

              {/* CONFIDENCE SUMMARY */}
              <div className="space-y-2.5">
                <Row 
                  icon={CheckCircle} 
                  label="High Confidence (>90%)" 
                  value={`${high} ${high === 1 ? 'match' : 'matches'}`} 
                  textColor="text-emerald-700"
                  bgColor="bg-emerald-50/30"
                  borderColor="border-emerald-100/60"
                  iconColor="text-emerald-500"
                />
                <Row 
                  icon={AlertTriangle} 
                  label="Medium Confidence (70–90%)" 
                  value={`${med} ${med === 1 ? 'match' : 'matches'}`} 
                  textColor="text-amber-700"
                  bgColor="bg-amber-50/30"
                  borderColor="border-amber-100/60"
                  iconColor="text-amber-500"
                />
                <Row 
                  icon={Info} 
                  label="Low Confidence (<70%)" 
                  value={`${low} ${low === 1 ? 'match' : 'matches'}`} 
                  textColor="text-rose-700"
                  bgColor="bg-rose-50/30"
                  borderColor="border-rose-100/60"
                  iconColor="text-rose-500"
                />
              </div>

              {/* NEXT STEPS BOX */}
              <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-4 sm:p-5 text-amber-900">
                <h3 className="font-black text-sm uppercase tracking-widest text-amber-700 mb-2 flex items-center gap-2">
                  <Info size={16} strokeWidth={3} /> Next Steps
                </h3>
                <p className="text-sm font-bold opacity-80 leading-relaxed">
                  Review the new matches in the table below. Approve high-confidence matches and verify medium/low confidence matches manually before notifying owners.
                </p>
              </div>

              {/* ACTION BUTTON */}
              <button
                onClick={onViewMatches}
                className="cursor-pointer w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 rounded-2xl flex justify-center items-center gap-2 font-black uppercase tracking-wider shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all outline-none focus:ring-2 focus:ring-emerald-400"
              >
                View Matches <ArrowRight size={18} strokeWidth={3} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Sub-component
function Row({ icon: Icon, label, value, textColor, bgColor, borderColor, iconColor }) {
  return (
    <div className={`flex items-center justify-between border ${borderColor} ${bgColor} rounded-xl px-4 py-3 transition-colors hover:bg-slate-50`}>
      <div className="flex items-center gap-3">
        <Icon size={16} strokeWidth={2.5} className={iconColor} />
        <span className="font-bold text-slate-600 text-sm">{label}</span>
      </div>
      <span className={`${textColor} font-black text-sm`}>{value}</span>
    </div>
  );
}