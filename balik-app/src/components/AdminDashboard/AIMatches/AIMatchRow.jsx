import { motion } from "framer-motion";
import ActionIcons from "./ActionIcons";

// --- SIMULATED HELPERS ---
const getConfidenceStyle = (conf) => {
  if (conf >= 80) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (conf >= 50) return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-red-100 text-red-700 border-red-200";
};

const getStatusStyle = (status) => {
  if (status === "Approved") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (status === "Rejected") return "bg-red-100 text-red-700 border-red-200";
  if (status === "Matched") return "bg-blue-100 text-blue-700 border-blue-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
};

export default function AIMatchRow({ match, onAction, index = 0 }) {
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: index * 0.05 } },
  };

  return (
    <motion.tr
      variants={rowVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="group hover:bg-slate-50/50 transition-colors align-middle"
    >
      {/* Lost */}
      <td className="px-6 py-5 max-w-[200px] sm:max-w-[250px] text-wrap">
        <p className="font-bold text-slate-800 text-base mb-1">{match.lost}</p>
        {match.lostDescription && (
          <p className="text-sm text-slate-500 line-clamp-2 leading-snug mb-2" title={match.lostDescription}>
            {match.lostDescription}
          </p>
        )}
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-medium text-slate-400">{match.lostEmail}</p>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lost: {match.lostDate}</p>
        </div>
      </td>

      {/* Found */}
      <td className="px-6 py-5 max-w-[200px] sm:max-w-[250px] text-wrap border-l border-slate-50/50">
        <p className="font-bold text-slate-800 text-base mb-1">{match.found}</p>
        {match.foundDescription && (
          <p className="text-sm text-slate-500 line-clamp-2 leading-snug mb-2" title={match.foundDescription}>
            {match.foundDescription}
          </p>
        )}
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-medium text-slate-400">{match.foundEmail}</p>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Found: {match.foundDate}</p>
        </div>
      </td>

      {/* Confidence */}
      <td className="px-6 py-5">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border tracking-wide ${getConfidenceStyle(
            match.confidence
          )}`}
        >
          {match.confidence}% Match
        </span>
      </td>

      {/* Status */}
      <td className="px-6 py-5">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusStyle(
            match.status
          )}`}
        >
          {match.status}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-5">
        <ActionIcons status={match.status} match={match} onAction={onAction} />
      </td>
    </motion.tr>
  );
}