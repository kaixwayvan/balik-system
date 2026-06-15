import { useState, useEffect } from "react";
import { X, Info, Search, Package, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RunAIMatchingModal({
  open,
  onClose,
  onStart,
  isProcessing,
  counts
}) {
  const [elapsedTime, setElapsedTime] = useState(0);

  // Live timer logic
  useEffect(() => {
    let interval;
    if (isProcessing && open) {
      setElapsedTime(0);
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 0.1);
      }, 100);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [isProcessing, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          key="run-ai-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
        >
          <motion.div 
            key="run-ai-content"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="bg-white w-full max-w-[600px] rounded-[2rem] shadow-2xl overflow-hidden"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Run AI Matching</h2>
              <button
                onClick={() => !isProcessing && onClose()}
                className="cursor-pointer p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors outline-none focus:ring-2 focus:ring-slate-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isProcessing}
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* ANIMATED CONTENT SWITCHER */}
            <AnimatePresence mode="wait">
              {!isProcessing ? (
                <motion.div 
                  key="setup-state"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 space-y-6"
                >
                  {/* INFO BOX */}
                  <div className="border border-indigo-200/60 bg-indigo-50/50 rounded-2xl p-5 text-indigo-800">
                    <p className="flex items-center gap-2 font-black mb-3 text-indigo-900 uppercase tracking-widest text-lg">
                      <Info size={16} strokeWidth={2.5} /> How AI Matching Works
                    </p>
                    <ul className="list-disc ml-5 text-md font-medium space-y-1.5 opacity-80">
                      <li>Analyzes all pending lost and found items</li>
                      <li>Uses NLP text embeddings + CLIP image processing</li>
                      <li>Cross-references descriptions, visual data, location, and dates</li>
                      <li>Generates neural confidence scores for admin review</li>
                    </ul>
                  </div>

                  {/* COUNTERS */}
                  <div className="space-y-3">
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="bg-rose-100 text-rose-600 p-2.5 rounded-xl">
                          <Search size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-slate-800 tracking-tight">Pending Lost Items</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Awaiting extraction</p>
                        </div>
                      </div>
                      <span className="text-2xl font-black text-slate-800">{counts?.lost || 0}</span>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-xl">
                          <Package size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-slate-800 tracking-tight">Pending Found Items</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available targets</p>
                        </div>
                      </div>
                      <span className="text-2xl font-black text-slate-800">{counts?.found || 0}</span>
                    </div>
                  </div>

                  {/* START BUTTON */}
                  <button
                    onClick={onStart}
                    className="cursor-pointer w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-4 rounded-2xl flex justify-center items-center gap-2 font-black uppercase tracking-wider shadow-md shadow-indigo-500/20 active:scale-[0.98] transition-all"
                  >
                    <Sparkles size={18} strokeWidth={2.5} />
                    Execute AI Match
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="processing-state"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="p-16 flex flex-col items-center text-center space-y-8"
                >
                  {/* CIRCLING GRADIENT & LIVE TIMER */}
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-8 border-slate-100"></div>
                    <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-indigo-600 border-r-purple-600 border-b-fuchsia-500 animate-spin"></div>
                    <div className="text-3xl font-black text-slate-800 tracking-tighter tabular-nums z-10 bg-white/50 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center">
                      {elapsedTime.toFixed(1)}<span className="text-base text-slate-400 ml-0.5">s</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                      Processing Vectors...
                    </h3>
                    <p className="text-slate-500 font-bold text-sm mt-2">
                      Running item comparisons and compiling match matrices.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}