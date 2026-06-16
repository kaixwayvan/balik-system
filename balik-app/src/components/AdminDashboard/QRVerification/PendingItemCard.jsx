import { motion } from "framer-motion";
import StatusBadge from "./shared/StatusBadge";
import { UserCircle2, QrCode } from "lucide-react";

export default function PendingItemCard({ item, index }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-md rounded-2xl flex flex-col overflow-hidden transition-all duration-300 group"
    >
      <div className="flex p-4 gap-4 items-center">
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-black text-slate-800 text-base truncate tracking-tight leading-tight">{item.name}</h4>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate mb-1">{item.category}</p>
          
          <div className="flex items-center gap-1.5 mt-2">
            <QrCode size={12} className="text-slate-400" />
            <p className="text-[11px] font-mono text-slate-500 tracking-wider bg-slate-100 px-1.5 py-0.5 rounded-md">{item.qr}</p>
          </div>
        </div>

        <div className="shrink-0 flex items-center justify-center">
          <StatusBadge status={item.status} />
        </div>
      </div>

      <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-100 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5">
          <UserCircle2 size={12} className="text-blue-500" />
          <p className="text-[10px] font-bold text-slate-600 uppercase truncate"><span className="text-slate-400">Owner:</span> {item.owner}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <UserCircle2 size={12} className="text-amber-500" />
          <p className="text-[10px] font-bold text-slate-600 uppercase truncate"><span className="text-slate-400">Claimer:</span> {item.claimer}</p>
        </div>
      </div>
    </motion.div>
  );
}