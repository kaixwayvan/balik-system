import StatusBadge from "./shared/StatusBadge";
import RoleBadge from "./shared/RoleBadge";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, AlertCircle, Ban } from "lucide-react";

export default function UserRow({ user, index, onActionClick }) {
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, delay: index * 0.03 } },
  };

  return (
    <motion.tr variants={rowVariants} initial="hidden" animate="visible" exit="hidden" className="hover:bg-slate-50/50 transition-colors group align-middle">
      
      {/* User Info */}
      <td className="px-4 py-4 max-w-[250px]">
        <div className="flex items-center gap-4">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border border-slate-200 shadow-sm shrink-0" />
          ) : (
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0 ${user.color}`}>
              {user.initials}
            </div>
          )}
          <div className="truncate">
            <p className="font-black text-slate-800 tracking-tight text-sm sm:text-base truncate">{user.name}</p>
            <p className="text-xs font-bold text-slate-400 truncate mt-0.5">{user.email}</p>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-4 py-4 text-center">
        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${user.role === 'Admin' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
          {user.role}
        </span>
      </td>

      {/* Points */}
      <td className="px-4 py-4 text-center">
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-black text-emerald-600 text-base">{user.points} pts</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.badges} Badges</span>
        </div>
      </td>

      {/* Activity Logs */}
      <td className="px-4 py-4">
        <div className="flex items-center justify-center gap-2">
          
          <div className="bg-slate-50 border border-slate-100 rounded-xl py-1 px-2.5 flex flex-col items-center min-w-[3.5rem] shadow-sm">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lost</span>
            <span className="text-sm font-black text-slate-700 leading-tight">{user.reports.lost}</span>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl py-1 px-2.5 flex flex-col items-center min-w-[3.5rem] shadow-sm">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Found</span>
            <span className="text-sm font-black text-slate-700 leading-tight">{user.reports.found}</span>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl py-1 px-2.5 flex flex-col items-center min-w-[3.5rem] shadow-sm">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Claims</span>
            <span className="text-sm font-black text-slate-700 leading-tight">{user.reports.claims}</span>
          </div>

        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-4 text-center">
        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${user.status === 'Restricted' ? 'bg-rose-100 text-rose-700 border-rose-200 shadow-rose-500/10' : 'bg-emerald-100 text-emerald-700 border-emerald-200 shadow-emerald-500/10'}`}>
          {user.status}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-4 text-center">
        <div className="flex items-center justify-center gap-1.5">
          
          {/* VIEW */}
          <div className="relative group/btn">
            <button onClick={() => onActionClick(user, 'view')} className="cursor-pointer p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all active:scale-95 outline-none focus:ring-2 focus:ring-blue-200">
              <Eye size={18} strokeWidth={2.5} />
            </button>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/btn:opacity-100 transition-all duration-200 pointer-events-none z-10 flex flex-col items-center translate-y-1 group-hover/btn:translate-y-0">
              <span className="bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap tracking-wide">View Profile</span>
              <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-slate-800"></div>
            </div>
          </div>

          {user.role !== 'Admin' && (
            <>
              {/* WARN */}
              <div className="relative group/btn">
                <button onClick={() => onActionClick(user, 'warn')} className="cursor-pointer p-2 text-amber-500 hover:bg-amber-50 rounded-xl transition-all active:scale-95 outline-none focus:ring-2 focus:ring-amber-200">
                  <AlertCircle size={18} strokeWidth={2.5} />
                </button>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/btn:opacity-100 transition-all duration-200 pointer-events-none z-10 flex flex-col items-center translate-y-1 group-hover/btn:translate-y-0">
                  <span className="bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap tracking-wide">Issue Warning</span>
                  <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-slate-800"></div>
                </div>
              </div>

              {/* BAN */}
              <div className="relative group/btn">
                <button onClick={() => onActionClick(user, 'ban')} className="cursor-pointer p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-95 outline-none focus:ring-2 focus:ring-rose-200">
                  <Ban size={18} strokeWidth={2.5} />
                </button>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/btn:opacity-100 transition-all duration-200 pointer-events-none z-10 flex flex-col items-center translate-y-1 group-hover/btn:translate-y-0">
                  <span className="bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap tracking-wide">Restrict User</span>
                  <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-slate-800"></div>
                </div>
              </div>
            </>
          )}

        </div>
      </td>
    </motion.tr>
  );
}