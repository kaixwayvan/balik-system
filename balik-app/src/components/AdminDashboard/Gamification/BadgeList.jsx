import { Medal, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function BadgeList({ badges, loading }) {
  if (loading) {
    return (
      <div className="w-full bg-slate-50/50 rounded-3xl p-5 border border-slate-100 animate-pulse h-48" />
    );
  }

  return (
    <div className="w-full rounded-3xl p-5 sm:p-6 border border-slate-100/80">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
        <h2 className="font-black text-orange-800 text-sm sm:text-lg tracking-tight uppercase tracking-wider text-xs">
          Most Earned Achievements
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-3 sm:gap-4">
        {badges.map((badge, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -2 }}
            className="flex items-center justify-between bg-white border border-slate-200/70 shadow-xs rounded-3xl p-6 transition-all duration-200"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-gradient-to-br from-white via-amber-50 to-amber-100 text-amber-600 rounded-2xl shrink-0 border border-amber-100/50 shadow-[inset_0_2px_4px_rgba(255,255,255,1),inset_0_-3px_6px_rgba(251,191,36,0.2),0_10px_20px_-4px_rgba(245,158,11,0.2)]">
                <Medal className="w-7 h-7 drop-shadow-[0_3px_3px_rgba(217,119,6,0.3)]" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-800 text-lg">{badge.title}</p>
                <p className="text-sm text-slate-500 block mt-0.5">
                  {badge.description}
                </p>
              </div>
            </div>

            <div className="ml-3 shrink-0 text-right">
              <span className="text-xs sm:text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-2xl">
                {badge.users} users
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}