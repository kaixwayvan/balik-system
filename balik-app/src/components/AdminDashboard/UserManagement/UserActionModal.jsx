import {
  X,
  AlertTriangle,
  UserX,
  ShieldCheck,
  Mail,
  Award,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function UserActionModal({
  user,
  type,
  onClose,
  onRefresh,
  supabaseMock,
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleAction = async () => {
    setLoading(true);
    try {
      if (type === "ban") {
        await supabaseMock
          .from("profiles")
          .update({ is_restricted: true })
          .eq("id", user.id);
      } else if (type === "warn") {
        await new Promise((r) => setTimeout(r, 800));
      }
      onRefresh();
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  };

  if (type === "view") {
    return (
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      >
        <motion.div
          variants={modalVariants}
          className="bg-white max-w-md w-full rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="bg-slate-50 p-6 flex justify-between items-start border-b border-slate-100 shrink-0">
            <div className="flex gap-4 items-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-sm"
                />
              ) : (
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-sm border-4 border-white ${user.color}`}
                >
                  {user.initials}
                </div>
              )}
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">
                  {user.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-3 py-0.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${user.role === "Admin" ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}
                  >
                    {user.role}
                  </span>
                  <span
                    className={`px-3 py-0.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${user.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"}`}
                  >
                    {user.status}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors shadow-sm active:scale-95 outline-none"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                Contact Info
              </h3>
              <div className="flex items-center gap-3 text-sm text-slate-700 font-bold bg-slate-50 p-3 rounded-xl border border-slate-100 overflow-hidden">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <span className="truncate">
                  {user.email || "No email provided"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                Platform Activity
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <Award size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                      Points
                    </span>
                  </div>
                  <span className="text-2xl font-black text-emerald-700 tracking-tight">
                    {user.points}
                  </span>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={16} className="text-blue-500" />
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                      Badges
                    </span>
                  </div>
                  <span className="text-2xl font-black text-blue-700 tracking-tight">
                    {user.badges}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                Reports Overview
              </h3>
              <div className="flex justify-between items-center bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="text-center w-full">
                  <p className="text-2xl font-black text-slate-700">
                    {user.reports.lost}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Lost
                  </p>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div className="text-center w-full">
                  <p className="text-2xl font-black text-slate-700">
                    {user.reports.found}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Found
                  </p>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div className="text-center w-full">
                  <p className="text-2xl font-black text-slate-700">
                    {user.reports.claims}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Claims
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Ban or Warn Actions
  const isBan = type === "ban";
  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
    >
      <motion.div
        variants={modalVariants}
        className="bg-white max-w-sm w-full rounded-[2rem] shadow-2xl p-8 text-center"
      >
        <div
          className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ring-8 ${isBan ? "bg-rose-100 text-rose-600 ring-rose-50" : "bg-amber-100 text-amber-600 ring-amber-50"}`}
        >
          {isBan ? (
            <UserX size={36} strokeWidth={2.5} />
          ) : (
            <AlertTriangle size={36} strokeWidth={2.5} />
          )}
        </div>

        <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
          {isBan ? "Restrict User?" : "Send Warning?"}
        </h2>

        <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">
          {isBan ? (
            <>
              Are you sure you want to restrict access for{" "}
              <strong className="font-black text-slate-800">{user.name}</strong>
              ? They will no longer be able to use the platform.
            </>
          ) : (
            <>
              Are you sure you want to issue an official warning to{" "}
              <strong className="font-black text-slate-800">{user.name}</strong>
              ? An email will be sent.
            </>
          )}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer flex-1 py-3.5 border border-slate-200 bg-white text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleAction}
            disabled={loading}
            className={`cursor-pointer flex-1 py-3.5 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-70 ${
              isBan
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                : "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Processing
              </>
            ) : isBan ? (
              "Yes, Restrict"
            ) : (
              "Yes, Warn"
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}