export default function StatusBadge({ status }) {
  const styles = {
    Approved: "bg-emerald-100 text-emerald-700 border-emerald-200 shadow-emerald-500/10",
    Pending: "bg-amber-100 text-amber-700 border-amber-200 shadow-amber-500/10",
    Rejected: "bg-rose-100 text-rose-700 border-rose-200 shadow-rose-500/10",
    Released: "bg-blue-100 text-blue-700 border-blue-200 shadow-blue-500/10",
    Ready: "bg-indigo-100 text-indigo-700 border-indigo-200 shadow-indigo-500/10",
  };

  const styleClass = styles[status] || "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <span
      className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border shadow-sm ${styleClass}`}
    >
      {status}
    </span>
  );
}