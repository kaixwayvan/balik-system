import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegMoon } from "react-icons/fa";
import {
  ChevronDown,
  User,
  HelpCircle,
  Bell,
  SunMedium,
  LogOut,
  Menu,
} from "lucide-react";
import BALIKLogo from "../../../assets/BALIK.png";

const PAGE_TITLES = {
  "/dashboard": {
    title: "Dashboard Home",
    description: "Welcome back! Here's an overview of your recent activity.",
  },
  "/dashboard/search": {
    title: "Recently Reported Items",
    description: "Browse all found items reported by the community. Click on any item to view details and submit a claim request.",
  },
  "/dashboard/track": {
    title: "Item Tracking Overview",
    description: "Track all your reported lost and found items in one place.",
  },
  "/dashboard/reports": {
    title: "Active Reports",
    description: "Track your reported lost items.",
  },
  "/dashboard/found": {
    title: "Found Reports",
    description: "Items you've reported and their claim status.",
  },
  "/dashboard/myclaims": {
    title: "My Claims",
    description: "Track all your claimed items and their status.",
  },
  "/dashboard/history": {
    title: "View History",
    description: "Review all reports, claims, and activity in one place.",
  },
  "/dashboard/profile": {
    title: "Profile Settings",
    description: "Manage your personal information and preferences.",
  },
  "/dashboard/notifications": {
    title: "Notifications Center",
    description: "Manage your real-time campus assets, system status updates, and match matrices.",
  },
  "/help": {
    title: "Help Center",
    description: "Find answers and support for your questions.",
  },
};

export default function UserDashboardHeader({ onMenuClick }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Local notification state
  const [notifications, setNotifications] = useState([
    {
      id: "drop-1",
      title: "Application Approved",
      message: "Your recent form submission has been verified and approved.",
      time: "10 mins ago",
      isRead: false,
    },
    {
      id: "drop-2",
      title: "Welcome to BALIK",
      message: "Please complete your profile to access all features.",
      time: "2 days ago",
      isRead: true,
    },
  ]);
  
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const location = useLocation();
  const currentPath = location.pathname;
  
  const currentPageInfo = PAGE_TITLES[currentPath] || {
    title: "Dashboard",
    description: "Manage your workspace and settings.",
  };

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prevNotifs) =>
      prevNotifs.map((n) => ({ ...n, isRead: true }))
    );
  };

  // Helper
  const handleMarkSingleRead = (id) => {
    setNotifications((prevNotifs) =>
      prevNotifs.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <header className="h-30 bg-[#F5EBE6]/90 backdrop-blur-sm border-b border-[#FFEEDE]/60 shadow-[0_4px_30px_rgba(74,21,27,0.12)] flex items-center justify-between px-4 sm:px-6 fixed top-0 left-0 right-0 lg:left-72 z-30 transition-all duration-300">
      
      {/* Left Area Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="cursor-pointer lg:hidden p-2 rounded-xl text-[#572C11] hover:text-[#4A151B] hover:scale-[1.04] active:scale-95 transition-all duration-200 focus:outline-none"
          aria-label="Open navigation sidebar"
        >
          <Menu
            className="w-[22px] h-[22px] sm:w-[25px] sm:h-[25px] md:w-[23px]"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        </button>

        {/* Brand Logo */}
        <div className="lg:hidden flex items-center">
          <Link  
            to="/dashboard"
            className="block"
            aria-label="Go to BALIK Dashboard home"
          >
            <img
              src={BALIKLogo}
              className="h-20 w-auto object-contain transition-transform duration-300 active:scale-98"
              alt="BALIK Logo"
            />
          </Link>
        </div>

        {/* Desktop Only */}
        <div className="hidden lg:block relative ml-2 w-[350px] xl:w-[500px] h-[54px] pointer-events-none">
          <AnimatePresence>
            <motion.div
              key={currentPath}
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 30,
                mass: 0.8, 
              }}
              className="absolute inset-0 flex flex-col justify-center"
            >
              <h1 className="text-[22px] font-extrabold text-[#4A151B] leading-tight truncate">
                {currentPageInfo.title}
              </h1>
              <p className="text-sm font-medium text-[#632813]/70 truncate">
                {currentPageInfo.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right Utilities Panel */}
      <div className="flex items-center gap-2 lg:gap-4 shrink-0">

        {/* Theme Toggler Component */}
        <motion.button
          onClick={() => setDarkMode(!darkMode)}
          className="hidden lg:flex cursor-pointer p-0.5 rounded-xl hover:bg-[#4A151B]/5
             focus:outline-none focus-visible:ring-2
             focus-visible:ring-[#4A151B]/30
             items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
        >
          <div className="relative w-10 h-10">
            <motion.div
              initial={false}
              animate={{ opacity: darkMode ? 0 : 1, scale: darkMode ? 0.4 : 1, rotate: darkMode ? -90 : 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <SunMedium size={25} className="text-[#632813]" aria-hidden="true" />
            </motion.div>

            <motion.div
              initial={false}
              animate={{ opacity: darkMode ? 1 : 0, scale: darkMode ? 1 : 0.4, rotate: darkMode ? 0 : 90 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <FaRegMoon size={18} className="fill-[#4A151B] text-[#4A151B]" aria-hidden="true" />
            </motion.div>
          </div>
        </motion.button>

        {/* Notification Window System */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            className={`cursor-pointer text-[#632813] hover:text-[#4A151B] p-2 rounded-xl active:scale-90 transition-all duration-200 relative ${isNotifOpen ? 'bg-[#4A151B]/10' : 'hover:bg-[#4A151B]/5'}`}
            aria-label="View unread notifications"
            aria-expanded={isNotifOpen}
          >
            <Bell size={22} aria-hidden="true" />
            {hasUnread && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#EDA661] rounded-full ring-2 ring-[#FDFBF7]" aria-label="New notification indicator"></span>
            )}
          </button>

          {/* Notification Dropdown Window */}
          <div
            role="menu"
            className={`absolute right-[-10px] sm:right-0 mt-3 w-[300px] sm:w-80 bg-[#FDFBF7]/99 backdrop-blur-3xl rounded-2xl shadow-[0_12px_40px_rgba(74,21,27,0.12)] border border-[#E6D0C5] overflow-hidden z-50 origin-top-right transition-all duration-200 ${
              isNotifOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }`}
          >
            <div className="flex items-center justify-between p-4 bg-[#4A151B]/5 border-b border-[#E6D0C5]/50">
              <h3 className="font-bold text-[#4A151B]">Notifications</h3>
              <button 
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-[#EDA661] hover:text-[#4A151B] transition-colors cursor-pointer focus:outline-none"
              >
                Mark all read
              </button>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
              {notifications.map((ntf) => (
                <div 
                  key={ntf.id}
                  onClick={() => handleMarkSingleRead(ntf.id)}
                  className={`p-3 rounded-xl transition-colors cursor-pointer relative ${
                    !ntf.isRead ? "bg-[#FFFBF7] hover:bg-[#F5EFE6]" : "hover:bg-[#F5EFE6]/70"
                  }`}
                >
                  {!ntf.isRead && (
                    <div className="absolute top-4 right-3 w-2 h-2 bg-[#EDA661] rounded-full"></div>
                  )}
                  <p className={`text-sm pr-4 text-gray-800 ${!ntf.isRead ? "font-bold" : "font-semibold"}`}>
                    {ntf.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{ntf.message}</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">{ntf.time}</p>
                </div>
              ))}
            </div>
            <div className="p-3 bg-[#4A151B]/5 border-t border-[#E6D0C5]/50 text-center">
              <Link 
                to="/dashboard/notifications" 
                onClick={() => setIsNotifOpen(false)}
                className="text-sm font-bold text-[#4A151B] hover:underline"
              >
                View all notifications
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Settings Workspace Controls */}
        <div ref={profileRef} className="hidden lg:block relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer p-1 rounded-xl hover:bg-[#F5EFE6]/50 active:scale-[0.99] transition-all duration-200 focus:outline-none"
            aria-expanded={isProfileOpen}
            aria-haspopup="menu"
            aria-label="User account management menu"
          >
            <img
              src="https://images.unsplash.com/photo-1527980965255-d3b416303d12"
              className="w-12 h-12 rounded-full object-cover shadow-sm border border-white"
              alt="Mike Wazowski profile pic"
            />
            <div className="text-left text-md">
              <p className="font-semibold text-gray-800">Mike Wazowski</p>
              <p className="text-xs text-red-800 font-medium">ISKOLAR NG BAYAN</p>
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>

          <div
            role="menu"
            className={`absolute right-0 mt-3 w-72 bg-[#FDFBF7]/99 backdrop-blur-3xl rounded-2xl shadow-[0_12px_40px_rgba(74,21,27,0.12)] border border-[#E6D0C5] overflow-hidden z-50 origin-top-right transition-all duration-200 ${
              isProfileOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }`}
          >
            <div className="flex items-center gap-3 p-4 bg-[#4A151B]/5">
              <img
                src="https://images.unsplash.com/photo-1527980965255-d3b416303d12"
                className="w-10 h-10 rounded-full object-cover shadow-sm border border-white"
                alt="Avatar"
              />
              <div>
                <p className="font-bold text-[#4A151B]">Mike Wazowski</p>
                <p className="text-xs text-gray-500 font-medium">Registered User</p>
              </div>
            </div>
            <div className="p-2 space-y-0.5 bg-[#4A151B]/5" role="none">
              <Link to="/dashboard/profile" onClick={() => setIsProfileOpen(false)} role="menuitem">
                <MenuItem icon={User} label="Profile Settings" />
              </Link>
              <Link to="/help" onClick={() => setIsProfileOpen(false)} role="menuitem">
                <MenuItem icon={HelpCircle} label="Help Center" />
              </Link>
            </div>
            <Link to="/login" onClick={() => setIsProfileOpen(false)} role="menuitem">
              <button className="cursor-pointer w-full flex items-center shadow-lg gap-3 px-5 py-3 text-sm font-bold text-[#4A151B] hover:bg-[#4A151B]/5 transition-colors duration-200 text-left">
                <LogOut size={18} aria-hidden="true" />
                Log Out
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuItem({ icon: Icon, label }) {
  return (
    <button className="cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-[#FFFBF7] hover:text-[#4A151B] transition-all duration-200 text-left">
      <Icon size={18} className="opacity-60 group-hover:opacity-100" aria-hidden="true" />
      {label}
    </button>
  );
}