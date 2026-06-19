import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, FileText } from "lucide-react";
import QuickActions from "../../components/AdminDashboard/AdminHome/QuickActions";
import StatCards from "../../components/AdminDashboard/AdminHome/StatCards";
import RecentReports from "../../components/AdminDashboard/AdminHome/RecentReports";
import OverviewCards from "../../components/AdminDashboard/AdminHome/OverviewCards";

export default function AdminDashboardHome() {
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (activeTab === "overview") {
      document.title = "Overview | BALIK Admin";
    } else if (activeTab === "reports") {
      document.title = "Recent Reports | BALIK Admin";
    }
  }, [activeTab]);

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] space-y-6 overflow-y-auto custom-scrollbar select-none">
      {/* Animated Slider Toggle Container */}
      <div className="flex justify-center sm:justify-start shrink-0">
        <div className="relative flex items-center bg-slate-100/80 p-1.5 rounded-3xl w-full sm:w-auto shadow-inner border border-slate-200/60">
          <button
            onClick={() => setActiveTab("overview")}
            className={`cursor-pointer relative flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-2.5 px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl text-sm sm:text-base font-bold transition-colors duration-300 z-10 ${
              activeTab === "overview"
                ? "text-[#5C1313]"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {activeTab === "overview" && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-[#FFF7E8] rounded-2xl shadow-[0_4px_12px_rgba(92,19,19,0.05)] border border-[#FCF1D9]"
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
              />
            )}
            <LayoutDashboard
              className="relative z-10 w-8 h-8 sm:w-[18px] sm:h-[18px]"
              strokeWidth={2.5}
            />
            <span className="relative z-10 tracking-tight">
              Overview & Actions
            </span>
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`cursor-pointer relative flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-2.5 px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl text-sm sm:text-base font-bold transition-colors duration-300 z-10 ${
              activeTab === "reports"
                ? "text-[#5C1313]"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {activeTab === "reports" && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-[#FFF7E8] rounded-2xl shadow-[0_4px_12px_rgba(92,19,19,0.05)] border border-[#FCF1D9]"
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
              />
            )}
            <FileText
              className="relative z-10 w-7 h-7 sm:w-[18px] sm:h-[18px]"
              strokeWidth={2.5}
            />
            <span className="relative z-10 tracking-tight">Recent Reports</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="space-y-6 w-full"
          >
            <StatCards />
            <QuickActions />
            <OverviewCards />
          </motion.div>
        ) : (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full"
          >
            <RecentReports />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
