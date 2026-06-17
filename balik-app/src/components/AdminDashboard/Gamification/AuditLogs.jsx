import { History, Terminal } from "lucide-react";

export default function AuditLogs({ logs }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-4xl p-5 sm:p-6 w-full">
      <div className="flex items-center gap-2 mb-2">
        <History className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">Gamification Audit Trail</h3>
      </div>
      <p className="text-sm text-slate-400 mb-5 leading-relaxed">
        Gamification activities, including points and level changes, arerecorded automatically for auditing.
      </p>

      <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/20">
        {logs.map((log, index) => (
          <div 
            key={index} 
            className="flex items-start gap-3 p-3.5 hover:bg-slate-50/60 transition-colors duration-150"
          >
            <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg shrink-0 mt-0.5">
              <Terminal className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <p className="text-xs sm:text-base text-slate-600 font-bold tracking-tight leading-relaxed">
              {log}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}