import { motion, AnimatePresence } from "framer-motion";
import StatusBadge from "./shared/StatusBadge";
import { UserCircle2 } from "lucide-react";

export default function RecentVerificationsTable({ data, loading }) {
  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden shrink-0">
      <div className="p-6 border-b border-slate-100">
        <h3 className="font-black text-2xl text-slate-800 tracking-tight uppercase">Recent Verifications</h3>
        <p className="text-xs font-bold text-slate-500">QR Verification Logs.</p>
      </div>

      <div className="w-full overflow-x-auto overflow-y-visible [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-track]:bg-slate-100/50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">
        <table className="w-full text-sm text-left min-w-[800px]">
          <thead className="text-[11.5px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/80 border-b border-slate-200/60">
            <tr>
              <th className="p-5">Asset Detail</th>
              <th className="p-5 text-center">Security Hash</th>
              <th className="p-5 text-left">Involved Parties</th>
              <th className="p-5 text-center">Status</th>
              <th className="p-5 text-center">Timestamp</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            <AnimatePresence>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-sm font-bold text-slate-400 animate-pulse">Loading Logs...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-sm font-bold text-slate-400">No verifications logged yet.</td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <motion.tr 
                    key={item.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-5 flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm shrink-0">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-slate-800 tracking-tight truncate">{item.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate mt-0.5">{item.category}</p>
                      </div>
                    </td>

                    <td className="p-5 text-center">
                       <span className="font-mono text-xs font-bold text-slate-500 tracking-wider bg-slate-100 px-2.5 py-1 rounded-lg">{item.qr}</span>
                    </td>

                    <td className="p-5">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <UserCircle2 size={14} className="text-blue-500" />
                          <p className="text-xs font-bold text-slate-700 truncate">{item.owner}</p>
                        </div>
                        <div className="flex items-center gap-2 opacity-60">
                          <UserCircle2 size={14} className="text-slate-400" />
                          <p className="text-[10px] font-bold text-slate-500 uppercase truncate">{item.claimer}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-5 text-center">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="p-5 text-center">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{item.verifiedAt}</p>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}