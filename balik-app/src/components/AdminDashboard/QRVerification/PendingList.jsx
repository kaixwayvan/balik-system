import { motion, AnimatePresence } from "framer-motion";
import PendingItemCard from "./PendingItemCard";
import { Clock } from "lucide-react";

export default function PendingList({ items, loading }) {
  return (
    <div className="bg-white rounded-4xl shadow-sm border border-slate-200/60 p-6 sm:p-8 flex flex-col h-full">
      <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-black text-2xl text-slate-800 tracking-tight uppercase">Pending Verification</h3>
          <p className="text-sm font-bold text-slate-500">Items queued for QR validation.</p>
        </div>
        <div className="bg-amber-100 text-amber-600 p-2 rounded-xl">
          <Clock size={20} strokeWidth={2.5} />
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
        <AnimatePresence mode="popLayout">
          {loading ? (
             [...Array(3)].map((_, i) => (
               <motion.div key={i} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="bg-slate-50 border border-slate-100 h-28 rounded-2xl animate-pulse" />
             ))
          ) : items.length === 0 ? (
            <motion.p initial={{opacity: 0}} animate={{opacity: 1}} className="text-center text-slate-400 font-bold py-10">No pending items in queue.</motion.p>
          ) : (
            items.map((item, index) => (
              <PendingItemCard key={item.id} item={item} index={index} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}