import { Layers, MoveRight } from "lucide-react";

export default function LevelProgression({ rules }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-4xl p-5 sm:p-6 w-full">
      <div className="flex items-center gap-2 mb-2">
        <Layers className="w-5 h-5 text-indigo-600" />
        <h3 className="font-black text-slate-800 text-lg sm:text-xl tracking-tight">
          Level Progression Milestones
        </h3>
      </div>
      <p className="text-sm text-slate-400 mb-5 leading-relaxed">
        Levels increase automatically as users accrue score values and process valid notifications.
      </p>

      <div className="space-y-3 w-full">
        {rules.map((rule, index) => (
          <div
            key={index}
            className="border border-slate-200/60 bg-slate-50/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-slate-300/80 transition-colors"
          >
            <div className="flex items-center gap-2 text-sm sm:text-base font-black tracking-tight shrink-0">
              <span className="text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-xl text-sm font-bold">{rule.from}</span>
              <MoveRight className="w-4 h-4 text-slate-400" strokeWidth={2.5} />
              <span className="text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-xl text-sm font-black">{rule.to}</span>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 font-bold italic tracking-tight sm:text-right">
              {rule.requirement}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-50">
        <span className="inline-block text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-1 rounded-xl shadow-md border border-slate-100">
          Evaluated via Engine Runtime
        </span>
      </div>
    </div>
  );
}