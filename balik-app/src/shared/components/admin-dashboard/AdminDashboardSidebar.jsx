import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Search, ShieldCheck, FileText,
  ScanQrCode, MapPin, Users, Trophy, ScrollText, ClipboardList,
  ArrowLeft, HelpCircle
} from "lucide-react";
import BALIKLogo from "../../../assets/BALIK.png";

export default function AdminDashboardSidebar({ isOpen, closeSidebar }) {
  const location = useLocation();

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/lost-manage", icon: Search, label: "Lost Items" },
    { path: "/admin/found-manage", icon: ShieldCheck, label: "Found Items" },
    { path: "/admin/matching", icon: FileText, label: "AI Matches" },
    { path: "/admin/qr-verify", icon: ScanQrCode, label: "QR Verify" },
    { path: "/admin/claim-requests", icon: ClipboardList, label: "Claims" },
    { path: "/admin/track-items", icon: MapPin, label: "Track Items" },
    { path: "/admin/users-manage", icon: Users, label: "Users" },
    { path: "/admin/gamification", icon: Trophy, label: "Gamification" },
    { path: "/admin/activity-logs", icon: ScrollText, label: "Activity Logs" },
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
      lg:relative lg:translate-x-0 flex flex-col w-[285px] shrink-0
      m-4 my-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(92,19,19,0.05)] 
      overflow-hidden border border-white/60
      bg-white/85 lg:bg-white/70 backdrop-blur-2xl
      ${isOpen ? "translate-x-0" : "-translate-x-[120%] lg:translate-x-0"}
    `}>
      
      {/* Layer 1 */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#E8B86D]/15 rounded-full blur-[4rem] pointer-events-none" />
      <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-[#5C1313]/10 rounded-full blur-[5rem] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-64 h-64 bg-slate-200/40 rounded-full blur-[3rem] pointer-events-none" />

      {/* Top Header: Logo & Mobile Back Button */}
      <div className="relative p-3 px-5 shrink-0 flex items-center justify-between lg:justify-center border-b border-[#E0CDBF] z-10">
        
        {/* Brand Logo */}
        <NavLink to="/admin" onClick={closeSidebar} className="relative z-10">
          <img 
            src={BALIKLogo} 
            className="h-25 object-contain transition-transform hover:scale-102 duration-500" 
            alt="BALIK Logo" 
          />
        </NavLink>
        
        {/* Back / Close Button */}
        <button
          onClick={closeSidebar}
          className="cursor-pointer lg:hidden p-2.5 text-slate-500 hover:text-[#5C1313] bg-white border border-slate-200 shadow-sm hover:shadow-md rounded-3xl transition-all duration-300 group flex items-center justify-center shrink-0"
          aria-label="Close menu"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" strokeWidth={2.5} />
        </button>
      </div>

      {/* Navigation Links Area */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar py-6 relative z-10 px-4">
        <div className="px-4 mb-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Core Modules
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className="relative flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[14px] font-bold transition-all group outline-none"
              >
                {/* Active Slider Item */}
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveIndicator"
                    className="absolute inset-0 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_12px_rgba(92,19,19,0.06)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}

                {/* Navigation Link Content */}
                <div className={`relative z-10 flex items-center gap-4 transition-all duration-300 ${
                  isActive 
                    ? "text-[#5C1313] translate-x-1" 
                    : "text-slate-600 group-hover:text-[#5C1313] group-hover:translate-x-1"
                }`}>
                  <div className={`transition-colors ${isActive ? '' : ''}`}>
                    <item.icon 
                      size={20} 
                      strokeWidth={isActive ? 2.5 : 2.5} 
                      className={isActive ? "text-[#5C1313]" : "text-slate-400 group-hover:text-[#5C1313] transition-colors"} 
                    />
                  </div>
                  <span className="tracking-tight">{item.label}</span>
                </div>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer Support & Version Panel */}
      <div className="relative p-5 shrink-0 border-t border-[#E0CDBF] z-10">
        <button 
          onClick={() => console.log("Open Help/Support")}
          className="cursor-pointer w-full flex items-center gap-3.5 px-4 py-3 bg-white/50 hover:bg-white backdrop-blur-md border border-slate-200/60 hover:border-[#5C1313]/20 rounded-4xl shadow-sm transition-all duration-300 group"
        >
          <div className="p-1.5 bg-slate-100 group-hover:bg-[#5C1313]/10 rounded-xl transition-colors">
            <HelpCircle size={18} className="text-slate-500 group-hover:text-[#5C1313] transition-colors" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[13px] font-bold text-slate-700 group-hover:text-[#5C1313] transition-colors tracking-tight">
              Help & Support
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              BALIK Version 1.0
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
}