import { Eye, Check, X, Bell, QrCode } from "lucide-react";
import { motion } from "framer-motion";

// --- SIMULATED HELPERS ---
const STATUS_ACTIONS = {
  Pending: ["view", "approve", "reject"],
  Approved: ["view", "notify", "qr"],
  Rejected: ["view"],
  Matched: ["view", "notify", "qr"],
};

const ACTION_MAP = {
  view: { icon: Eye, color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100 ring-emerald-500/30", label: "View Details" },
  approve: { icon: Check, color: "text-indigo-600 bg-indigo-50 hover:bg-indigo-100 ring-indigo-500/30", label: "Approve Match" },
  reject: { icon: X, color: "text-rose-500 bg-rose-50 hover:bg-rose-100 ring-rose-500/30", label: "Reject Match" },
  notify: { icon: Bell, color: "text-sky-500 bg-sky-50 hover:bg-sky-100 ring-sky-500/30", label: "Send Alert" },
  qr: { icon: QrCode, color: "text-violet-500 bg-violet-50 hover:bg-violet-100 ring-violet-500/30", label: "Generate QR" },
};

export default function ActionIcons({ status, onAction, match }) {
  const actions = STATUS_ACTIONS[status] || STATUS_ACTIONS.Pending;

  return (
    <div className="flex items-center justify-start gap-2">
      {actions.map((action) => {
        const { icon: Icon, color, label } = ACTION_MAP[action];
        
        const isApproved = status === "Approved" || status === "Matched";
        const isRejected = status === "Rejected";
        
        const isDisabled =
          (isApproved && (action === "approve" || action === "reject")) ||
          (isRejected && (action === "approve" || action === "reject"));

        return (
          <div key={action} className="relative group/tooltip flex items-center justify-center">
            <motion.button
              whileHover={!isDisabled ? { scale: 1.05 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
              disabled={isDisabled}
              onClick={() => !isDisabled && onAction(action, match)}
              className={`p-2.5 rounded-xl transition-all duration-200 outline-none focus:ring-2 ${
                isDisabled
                  ? "text-slate-300 bg-slate-50 cursor-not-allowed border border-transparent"
                  : `${color} cursor-pointer border border-transparent`
              }`}
              aria-label={label}
            >
              <Icon size={18} strokeWidth={isApproved && action === "approve" ? 3 : 2} />
            </motion.button>

            {/* Tooltip */}
            {!isDisabled && (
              <span className="absolute z-50 -top-10 whitespace-nowrap bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity shadow-sm pointer-events-none tracking-wide">
                {label}
                {/* Tooltip Triangle */}
                <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 border-[4px] border-transparent border-t-slate-800"></div>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}