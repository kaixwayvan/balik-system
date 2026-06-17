import { useState } from "react";
import { createPortal } from "react-dom";
import { FileBadge, ShieldCheck, HelpCircle, X, Cpu, Radio, Fingerprint, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Certificates({ certificates }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white border border-slate-200/80 rounded-4xl p-5 sm:p-6 space-y-4 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-slate-800 mb-2">
            <FileBadge className="w-5 h-5 text-indigo-600" />
            <h3 className="font-black text-lg sm:text-xl tracking-tight">System Endorsements</h3>
          </div>
          <p className="text-sm text-slate-400 mt-0.5">
            Certificates are issued through immediate background checks matching compliance values.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="cursor-pointer flex items-center justify-center gap-1.5 bg-white hover:bg-orange-50 hover:text-orange-800 border border-slate-200 hover:border-orange-200 text-slate-700 font-bold text-sm px-4 py-3 rounded-3xl transition-colors shrink-0 shadow-xs outline-none focus:ring-2 focus:ring-slate-100"
        >
          <HelpCircle className="w-5 h-5" />
          View System Rules
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((cert, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200/80 rounded-3xl p-5 flex flex-col justify-between gap-4 shadow-xs"
          >
            <div>
              <h4 className="font-bold text-slate-800 text-sm sm:text-lg tracking-tight border-b border-slate-50 pb-2">
                {cert.title}
              </h4>
              <p className="text-[11px] uppercase font-black tracking-widest text-slate-400 mt-3">
                Minimum Milestone Goals
              </p>
              <ul className="text-sm text-slate-600 space-y-2 mt-2 pl-1">
                {cert.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
              <span className="text-[10px] font-bold text-slate-400 italic">Issued Instantly</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-3 py-1 rounded-full text-[11px] font-black tracking-tight flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Validated Secure
              </span>
            </div>
          </div>
        ))}
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowModal(false)}
                  className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
                />

                {/* Modal Box */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  className="bg-white rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(15,23,42,0.15)] w-full max-w-md relative z-10 border border-slate-200/50 overflow-hidden flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100/50 shadow-xs">
                        <Cpu className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-[14px] font-black text-slate-800 text-base tracking-tight">
                          System Gamification Rules
                        </h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                          Engine Parameters
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setShowModal(false)}
                      className="cursor-pointer p-2 hover:bg-slate-100 active:scale-95 rounded-full transition-all text-slate-400 hover:text-slate-600 outline-none"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-5">
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                      These underlying variables run as isolated real-time processes. Profile adjustments complete inside encrypted records and bypass manual user intervention.
                    </p>

                    {/* System Core Metrics Panel */}
                    <div className="bg-slate-50/70 rounded-3xl p-4 border border-slate-200/40 shadow-md space-y-3.5">
                      <p className="font-black text-[11px] text-slate-400 uppercase tracking-widest">
                        System Core Metrics
                      </p>
                      
                      <div className="space-y-2.5">
                        {/* Metric Row 1 */}
                        <div className="flex items-center justify-between bg-white px-3 py-2.5 rounded-xl border border-slate-100 shadow-2xs">
                          <div className="flex items-center gap-2.5 text-sm font-bold text-slate-700">
                            <Radio className="w-5 h-5 text-emerald-500 animate-pulse" />
                            <span>Tracking Checks</span>
                          </div>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-xl">
                            Continuous
                          </span>
                        </div>

                        {/* Metric Row 2 */}
                        <div className="flex items-center justify-between bg-white px-3 py-2.5 rounded-xl border border-slate-100 shadow-2xs">
                          <div className="flex items-center gap-2.5 text-sm font-bold text-slate-700">
                            <Fingerprint className="w-5 h-5 text-indigo-500" />
                            <span>Tier Distribution</span>
                          </div>
                          <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-xl">
                            Dynamic
                          </span>
                        </div>

                        {/* Metric Row 3 */}
                        <div className="flex items-center justify-between bg-white px-3 py-2.5 rounded-xl border border-slate-100 shadow-2xs">
                          <div className="flex items-center gap-2.5 text-sm font-bold text-slate-700">
                            <History className="w-5 h-5 text-slate-500" />
                            <span>Event Ledger</span>
                          </div>
                          <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-xl">
                            Immutable
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => setShowModal(false)}
                      className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-7 py-2.5 rounded-2xl shadow-md transition-all active:scale-98 outline-none"
                    >
                      Dismiss Rules Panel
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}