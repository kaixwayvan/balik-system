import { X, ShieldCheck, Database, GitMerge, Info, Clock, User, Activity, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function ActivityDetailsModal({ log, onClose }) {
  if (!log) return null;

  const oldDataObj = typeof log.oldData === "string" ? JSON.parse(log.oldData || "{}") : log.oldData;
  const newDataObj = typeof log.newData === "string" ? JSON.parse(log.newData || "{}") : log.newData;
  const hasChanges = oldDataObj && newDataObj && log.rawType === 'UPDATED';

  const formatKey = (key) => key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const renderDataList = (dataObj, compareObj = null, type = "default") => {
    if (!dataObj || Object.keys(dataObj).length === 0) {
      return (
        <div className="py-8 flex justify-center items-center text-zinc-400 italic text-sm">
          No data recorded
        </div>
      );
    }

    const entriesToRender = Object.entries(dataObj).filter(([key, value]) => {
      if (key === 'description_embedding' || key === 'id' || key === 'metadata') return false;
      if (compareObj) {
        if (!(key in compareObj) && !(key in dataObj)) return false;
        if (!(key in compareObj)) return false;
        return JSON.stringify(value) !== JSON.stringify(compareObj[key]);
      }
      return true;
    });

    if (entriesToRender.length === 0) {
      return (
        <div className="py-8 flex justify-center items-center text-zinc-400 italic text-sm">
          No visible changes
        </div>
      );
    }

    const getRowClass = (isChanged) => {
      if (!isChanged) return "bg-white border-b border-zinc-100 last:border-0";
      if (type === "removed") return "bg-rose-50/40 border-b border-rose-100/50 last:border-0";
      if (type === "added") return "bg-emerald-50/40 border-b border-emerald-100/50 last:border-0";
      return "bg-white border-b border-zinc-100 last:border-0";
    };

    return (
      <div className="flex flex-col w-full">
        {entriesToRender.map(([key, value]) => {
          const isChanged = compareObj && JSON.stringify(value) !== JSON.stringify(compareObj[key]);
          let displayValue = typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value);

          return (
            <div key={key} className={`flex flex-col sm:flex-row sm:items-center py-3 px-4 sm:px-5 transition-colors ${getRowClass(isChanged)}`}>
              <span className="text-xs font-medium text-zinc-500 w-full sm:w-1/3 mb-1 sm:mb-0 shrink-0">
                {formatKey(key)}
              </span>
              <span className={`text-sm break-words w-full sm:w-2/3 ${isChanged && type === 'removed' ? 'text-rose-700 line-through decoration-rose-300' : isChanged && type === 'added' ? 'text-emerald-700 font-medium' : 'text-zinc-800'}`}>
                {displayValue || <span className="text-zinc-400 italic">Empty</span>}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/40 backdrop-blur-md p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 15 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} // Luxurious easing curve
        className="bg-white rounded-4xl w-full max-w-4xl flex flex-col max-h-[90vh] shadow-xl shadow-zinc-200/50 overflow-hidden ring-1 ring-zinc-200/60"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 bg-white">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-2xl border border-blue-100/50">
              <ShieldCheck size={22} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 tracking-tight">Audit Record</h2>
              <p className="text-sm font-bold text-zinc-500 font-mono mt-0.5 tracking-wide">ID: {log.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="cursor-pointer p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 rounded-full transition-all"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-zinc-50/30">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm shadow-zinc-100">
            <div className="flex items-start gap-3 p-4 border-b sm:border-b-0 lg:border-r border-zinc-100">
              <Clock className="text-zinc-400 mt-0.5" size={16} />
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">Timestamp</span>
                <span className="text-sm font-medium text-zinc-800">{log.datetime}</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 border-b sm:border-b-0 lg:border-r border-zinc-100">
              <Activity className="text-zinc-400 mt-0.5" size={16} />
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">Action</span>
                <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-xs font-semibold uppercase tracking-wide border border-blue-100/50">
                  {log.rawType || 'Unknown'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border-b sm:border-b-0 lg:border-r border-zinc-100">
              <User className="text-zinc-400 mt-0.5" size={16} />
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">Actor</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-800">{log.actor}</span>
                  <span className="text-[10px] font-medium text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded-md">
                    {log.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4">
              <MapPin className="text-zinc-400 mt-0.5" size={16} />
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">IP Address</span>
                <span className="text-sm font-mono text-zinc-800">{log.ip || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Context Banner */}
          <div className="bg-blue-50/50 border-l-2 border-blue-500 rounded-r-xl p-4 flex gap-3 items-start shadow-sm shadow-blue-100/20">
            <Info size={18} className="text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-blue-900 leading-relaxed">
                <span className="font-medium">{log.actor}</span> performed <span className="font-semibold">{log.activity}</span> on target <span className="font-mono text-blue-700 bg-blue-100/50 px-1.5 py-0.5 rounded text-xs">{log.target}</span>.
              </p>
            </div>
          </div>

          {/* Data Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Database size={16} className="text-zinc-400" />
              <h3 className="text-base font-bold text-zinc-800">Payload Overview</h3>
            </div>
            
            {hasChanges ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Previous State */}
                <div className="bg-white border border-rose-100 rounded-xl overflow-hidden shadow-sm shadow-rose-50">
                  <div className="bg-rose-50/50 px-4 py-3 border-b border-rose-100 flex items-center gap-2">
                    <GitMerge size={14} className="text-rose-500" />
                    <h4 className="text-sm font-bold text-rose-700 uppercase tracking-wide">Previous State</h4>
                  </div>
                  {renderDataList(oldDataObj, newDataObj, "removed")}
                </div>

                {/* New State */}
                <div className="bg-white border border-emerald-100 rounded-xl overflow-hidden shadow-sm shadow-emerald-50">
                  <div className="bg-emerald-50/50 px-4 py-3 border-b border-emerald-100 flex items-center gap-2">
                    <GitMerge size={14} className="rotate-180 text-emerald-600" />
                    <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-wide">New State</h4>
                  </div>
                  {renderDataList(newDataObj, oldDataObj, "added")}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {oldDataObj && Object.keys(oldDataObj).length > 0 && (
                  <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-zinc-50 px-4 py-3 border-b border-zinc-100">
                      <h4 className="text-sm font-bold text-zinc-600 uppercase tracking-wide">Captured State</h4>
                    </div>
                    {renderDataList(oldDataObj)}
                  </div>
                )}
                {newDataObj && Object.keys(newDataObj).length > 0 && (
                  <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-zinc-50 px-4 py-3 border-b border-zinc-100">
                      <h4 className="text-sm font-bold text-zinc-600 uppercase tracking-wide">Applied Data</h4>
                    </div>
                    {renderDataList(newDataObj)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 bg-white flex justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="cursor-pointer px-7 py-2.5 bg-zinc-900 text-white rounded-2xl hover:bg-zinc-800 font-medium transition-all text-base shadow-sm hover:shadow-md focus:ring-2 focus:ring-zinc-900/20 focus:outline-none"
          >
            Close Record
          </button>
        </div>
      </motion.div>
    </div>
  );
}