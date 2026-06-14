import { useEffect } from "react";
import { X, CircleCheck, SquaresExclude, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const statusStyles = {
  Approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Matched: "bg-blue-100 text-blue-700 border-blue-200",
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Claimed: "bg-purple-100 text-purple-700 border-purple-200",
  Archived: "bg-slate-200 text-slate-600 border-slate-300",
};

const statusButtons = {
  Approved: ["ai"],
  Matched: ["check", "reject"],
  Pending: ["check", "reject", "ai"],
  Claimed: [],
  Archived: [],
};

const submittedStyles = {
  "Registered User": "bg-blue-100 text-blue-700 border-blue-200",
  "Anonymous User": "bg-amber-100 text-amber-700 border-amber-200",
};

export default function FoundItemDetailsModal({ item, onClose, onApprove, onReject }) {
  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!item) return null;

  const buttons = statusButtons[item.status] || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 sm:p-8 border-b border-slate-100 shrink-0 bg-slate-50/50">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight uppercase">Found Item Context</h2>
          <button 
            onClick={onClose}
            className="cursor-pointer p-2 bg-slate-200 hover:bg-rose-100 text-slate-500 hover:text-rose-600 rounded-full transition-colors outline-none focus:ring-2 focus:ring-slate-300"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="overflow-y-auto custom-scrollbar p-6 sm:p-8">
          
          {/* TITLE HEADER */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-md border border-slate-200 shrink-0"
            />
            <div className="flex flex-col items-start text-left">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">{item.name}</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1 mb-3">{item.category}</p>
              <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase border ${statusStyles[item.status]}`}>
                {item.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            
            {/* LEFT - Item Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Item Intelligence</h3>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Description Matrix</p>
                <p className="text-sm md:text-base font-bold text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {item.raw?.description || "No specific context provided."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location Found</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{item.location}</p>
                </div>
                <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Registered</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{item.time}</p>
                </div>
              </div>
            </div>

            {/* RIGHT - Finder Info */}
            <div className="space-y-6">
               <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Origin Profile</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submission Class</p>
                  <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border ${submittedStyles[item.submittedType]}`}>
                    {item.submittedType}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity Alias</p>
                  <p className="text-base font-black text-slate-700">{item.submittedBy}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 p-6 sm:p-8 border-t border-slate-100 bg-slate-50/50 shrink-0">
          
          <button
            onClick={onClose}
            className="w-full sm:w-auto cursor-pointer font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200 px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Cancel
          </button>

          {buttons.includes("reject") && (
            <button 
              onClick={onReject}
              className="w-full sm:w-auto cursor-pointer flex justify-center items-center gap-2 bg-rose-100 hover:bg-rose-200 text-rose-700 px-6 py-3 rounded-xl font-black text-sm transition-all active:scale-95"
            >
              <XCircle size={16} strokeWidth={3} />
              Reject Log
            </button>
          )}

          {buttons.includes("check") && (
            <button 
              onClick={onApprove}
              className="w-full sm:w-auto cursor-pointer flex justify-center items-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-6 py-3 rounded-xl font-black text-sm transition-all active:scale-95"
            >
              <CircleCheck size={16} strokeWidth={3} />
              Approve Record
            </button>
          )}

          {buttons.includes("ai") && (
            <button 
              onClick={() => console.log("Navigate to /admin/matching")}
              className="w-full sm:w-auto cursor-pointer flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-black text-sm shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              <SquaresExclude size={16} strokeWidth={3} />
              Trigger Matrix
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}