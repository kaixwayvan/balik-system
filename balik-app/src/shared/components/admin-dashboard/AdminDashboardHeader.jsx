import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, User, Bell, Settings, LogOut, Eye, Menu, Sparkles } from "lucide-react";

// Auth Simulation
const useAuth = () => ({
  user: { user_metadata: { full_name: "Admin User", role: "admin", avatar_url: "" }, role: "admin" },
  switchRole: (role) => console.log("Switched to", role)
});
// ------------------------------

const getPageDetails = (pathname) => {
  const routes = {
    "/admin": { title: "Dashboard Overview", desc: "Monitor and Manage lost & found reports" },
    "/admin/lost-manage": { title: "Lost Items", desc: "Admin-only access for managing lost item reports" },
    "/admin/found-manage": { title: "Found Items", desc: "Manage found items from registered users and guest submissions" },
    "/admin/matching": { title: "AI Matches", desc: "AI-generated matches between lost and found items" },
    "/admin/qr-verify": { title: "QR Verification", desc: "Scan and validate QR codes for item return verification" },
    "/admin/claim-requests": { title: "Claim Requests", desc: "Manage and verify item claim applications" },
    "/admin/track-items": { title: "Item Tracking", desc: "Monitor, review, and manage all reports" },
    "/admin/users-manage": { title: "Users Management", desc: "Manage registered users across the platform" },
    "/admin/gamification": { title: "Gamification Engine", desc: "Motivate users through interactive challenges and rewards" },
    "/admin/activity-logs": { title: "Activity Logs", desc: "Track user actions and system events for security purposes" },
    "/admin/settings": { title: "System Settings", desc: "Configure system preferences and behavior" },
  };
  return routes[pathname] || { title: "Admin Portal", desc: "System Administration" };
};

export default function AdminDashboardHeader({ onMenuClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, switchRole } = useAuth();

  const { title, desc } = getPageDetails(location.pathname);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="mx-4 sm:mx-6 lg:mx-1 lg:mr-4 mt-4 sm:mt-6 bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] px-5 sm:px-5 py-6 flex items-center justify-between z-30 transition-all duration-300">
      
      <div className="flex items-center gap-4 min-w-0">
        <button 
          onClick={onMenuClick}
          className="cursor-pointer lg:hidden p-2.5 bg-white border border-[#E2DCD0] text-[#2A0808] hover:bg-[#FDFBF7] rounded-3xl transition-colors shadow-sm shrink-0"
        >
          <Menu size={20} strokeWidth={2.5} />
        </button>
        
        <div className="min-w-0 flex flex-col justify-center lg:pl-2 pl-0">
          <h1 className="text-2xl sm:text-3xl font-black text-[#570903] tracking-tight flex items-center gap-2.5">
            {title} 
          </h1>
          <p className="hidden sm:block text-md font-semibold text-slate-500 truncate mt-0.5">
            {desc}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
        
        <button className="cursor-pointer relative p-2.5 text-slate-400 hover:text-[#2A0808] bg-white border border-[#E2DCD0] shadow-sm rounded-full transition-all duration-300">
          <Bell size={19} strokeWidth={2.5} />
          <span className="absolute top-0 right-0 w-3 h-3 bg-[#E8B86D] rounded-full border-2 border-white shadow-sm"></span>
        </button>

        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 cursor-pointer p-1.5 px-2 md:px-3 bg-white border border-[#E2DCD0] shadow-sm hover:shadow-md rounded-full transition-all duration-300 group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2A0808] to-[#4A1515] overflow-hidden flex items-center justify-center shadow-inner">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" alt="avatar" />
              ) : (
                <span className="text-[#E8B86D] font-bold text-sm">
                  {user?.user_metadata?.full_name?.charAt(0) || "A"}
                </span>
              )}
            </div>
            <div className="hidden md:block text-left p-1">
              <p className="text-md font-extrabold text-slate-800 leading-none group-hover:text-[#2A0808] transition-colors">
                {user?.user_metadata?.full_name || "Admin"}
              </p>
              <p className="text-[10px] font-bold text-[#E8B86D] uppercase tracking-wider mt-1">
                System Admin
              </p>
            </div>
            <ChevronDown
              size={16}
              className={`hidden md:block text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-[0_20px_50px_-15px_rgba(42,8,8,0.15)] border border-[#E2DCD0] overflow-hidden z-50 flex flex-col"
              >
                <div className="p-5 border-b border-[#E2DCD0] bg-gradient-to-b from-[#FDFBF7] to-white">
                  <p className="text-lg font-extrabold text-[#2A0808]">{user?.user_metadata?.full_name || "Admin"}</p>
                  <p className="text-sm font-semibold text-slate-500 mt-0.5">{user?.email || "admin@balik.system"}</p>
                </div>

                <div className="p-3 space-y-1">
                  <MenuItem icon={User} label="View Profile" onClick={() => navigate("/admin/profile")} />
                  <MenuItem icon={Settings} label="System Settings" onClick={() => navigate("/admin/settings")} />
                  <MenuItem icon={Eye} label="View as User" onClick={() => { switchRole("user"); navigate("/dashboard"); }} />
                </div>

                <div className="p-3 border-t border-[#E2DCD0] bg-slate-50/50">
                  <button
                    onClick={() => { window.location.href = "/"; }}
                    className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-3 text-md bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-700 rounded-2xl font-bold transition-all duration-200"
                  >
                    <LogOut size={16} strokeWidth={2.5} /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function MenuItem({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-md font-bold text-slate-600 hover:text-[#2A0808] hover:bg-[#FDFBF7] transition-all duration-200"
    >
      <Icon size={18} strokeWidth={2.5} className="text-slate-400" /> {label}
    </button>
  );
}