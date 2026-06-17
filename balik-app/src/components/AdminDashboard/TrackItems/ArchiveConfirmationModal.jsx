import { motion } from "framer-motion";
import { Archive, AlertTriangle, CheckCircle, X, Loader2 } from "lucide-react";

export default function ArchiveConfirmationModal({ report, isOpen, isLoading, status, onConfirm, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 rounded-xl text-rose-600">
              <Archive size={18} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Archive Report</h2>
          </div>
          <button onClick={onClose} disabled={isLoading} className="cursor-pointer p-2 rounded-full hover:bg-slate-200/50 text-slate-400 transition-colors disabled:opacity-50">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {status === 'idle' && (
            <div className="space-y-6">
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3">
                <AlertTriangle size={20} className="text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-rose-900 text-sm">Proceed with archiving?</p>
                  <p className="text-rose-700/80 text-xs font-medium mt-1 leading-relaxed">This removes the report from the active tracking view. Data is safely stored and can be restored via admin panel.</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Report ID</p>
                  <p className="text-xs text-slate-700 font-bold font-mono bg-white border border-slate-200 px-2 py-1 rounded inline-block">{report?.id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Item Details</p>
                  <p className="text-sm text-slate-800 font-bold truncate">{report?.item}</p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Reporter</p>
                  <p className="text-sm text-slate-800 font-bold truncate">{report?.user}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="cursor-pointer flex-1 px-2 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onConfirm(report?.id)}
                  disabled={isLoading}
                  className="cursor-pointer flex-1 px-8 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all disabled:opacity-70 text-sm flex items-center justify-center gap-2 shadow-md"
                >
                  {isLoading ? (
                    <><Loader2 size={16} className="animate-spin" /> Archiving...</>
                  ) : (
                    <><Archive size={16} /> Confirm Archive</>
                  )}
                </button>
              </div>
            </div>
          )}

          {status === 'success' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4 ring-8 ring-emerald-50">
                <CheckCircle size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Archived Successfully</h3>
              <p className="text-slate-500 text-sm font-medium mt-2">The record is now hidden from the main view.</p>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4 ring-8 ring-rose-50">
                <AlertTriangle size={32} className="text-rose-600" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Action Failed</h3>
              <p className="text-slate-500 text-sm font-medium mt-2">An error occurred while moving the file.</p>
              <button onClick={onClose} className="w-full mt-6 px-4 py-3 rounded-xl bg-slate-900 text-white font-bold transition hover:bg-slate-800">
                Dismiss
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}