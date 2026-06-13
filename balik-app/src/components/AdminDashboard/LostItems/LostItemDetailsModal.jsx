import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X, ScanSearch, ScanEye, SearchCheck, ArchiveRestore, Image as ImageIcon } from "lucide-react";

const statusStyles = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Approved: "bg-blue-100 text-blue-700 border-blue-200",
  Matched: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Ready for Release": "bg-rose-100 text-rose-700 border-rose-200",
  Claimed: "bg-purple-100 text-purple-700 border-purple-200",
  Released: "bg-indigo-100 text-indigo-700 border-indigo-200",
  Archived: "bg-slate-200 text-slate-600 border-slate-300",
  Unclaimed: "bg-orange-100 text-orange-700 border-orange-200",
};

export default function LostItemDetailsModal({ item, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  if (!item) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="bg-white w-full max-w-[1000px] rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 sm:p-8 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight">Record Intelligence</h2>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">System ID: {item.id}</p>
          </div>
          <button 
            onClick={onClose} 
            className="cursor-pointer p-2 sm:p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors outline-none focus:ring-2 focus:ring-slate-200 active:scale-95 shrink-0"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* IMAGE COLUMN */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Visual Evidence</h3>
              <div className="w-full aspect-square rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner flex items-center justify-center">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-300">
                    <ImageIcon size={48} strokeWidth={1.5} className="mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest">No Image Attached</span>
                  </div>
                )}
              </div>
            </div>

            {/* INFO COLUMN */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* ITEM CONTEXT */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-[#5C1313] uppercase tracking-widest border-b border-[#5C1313]/10 pb-2">Item Context</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Item Title</p>
                    <p className="font-black text-slate-800 text-base sm:text-lg tracking-tight">{item.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Detailed Description</p>
                    <p className="font-bold text-slate-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Category Profile</p>
                    <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-wider">{item.category}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Location Logged</p>
                    <p className="font-bold text-slate-700 text-sm">{item.location}</p>
                  </div>
                </div>
              </div>

              {/* OWNER CONTEXT */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-[#5C1313] uppercase tracking-widest border-b border-[#5C1313]/10 pb-2">Owner Profile</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Registered Name</p>
                    <p className="font-black text-slate-800 text-base tracking-tight break-words">{item.owner}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact Email</p>
                    <p className="font-bold text-blue-600 text-sm truncate" title={item.email}>{item.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Verification Status</p>
                    <p className="font-bold text-emerald-600 text-sm">Receipts & Photos Validated</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current System Status</p>
                    <span className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border ${statusStyles[item.status] || "bg-slate-100 text-slate-600"}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 p-6 sm:p-8 border-t border-slate-100 bg-slate-50 shrink-0">
          
          {item.status === "Pending" && (
            <button 
              onClick={() => { onClose(); navigate('/admin/matching', { state: { runAI: true } }); }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all active:scale-95"
            >
              <ScanSearch size={18} strokeWidth={2.5} /> NLP Match Protocol
            </button>
          )}

          {item.status === "Matched" && (
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all active:scale-95">
              <ScanEye size={18} strokeWidth={2.5} /> Inspect Match
            </button>
          )}

          {item.status === "Claimed" && (
            <span className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-black text-white uppercase tracking-wider bg-purple-700 rounded-2xl shadow-sm">
              <SearchCheck size={18} strokeWidth={2.5} /> Asset Claimed
            </span>
          )}

          {item.status === "Archived" && (
            <span className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-black text-slate-100 uppercase tracking-wider bg-slate-600 rounded-2xl shadow-sm">
              <ArchiveRestore size={18} strokeWidth={2.5} /> Asset Archived
            </span>
          )}

          <button
            onClick={onClose}
            className="w-full sm:w-auto cursor-pointer border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 px-8 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-sm transition-all active:scale-95"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}