import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoNotifications } from "react-icons/io5";
import {
  ChevronDown,
  User,
  Bell,
  HelpCircle,
  Settings,
  Moon,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getNotifications, markAsRead, markAllAsRead } from "../../services/notificationService";
import { formatDistanceToNow } from "date-fns";
import { Check } from "lucide-react";

export default function AdminDashboardHeader() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id]);

  const fetchNotifications = async () => {
    setLoading(true);
    const result = await getNotifications(user.id);
    if (result.success) {
      setNotifications(result.data);
    }
    setLoading(false);
  };

  const handleMarkAsRead = async (id) => {
    const result = await markAsRead(id);
    if (result.success) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    }
  };

  const handleMarkAllAsRead = async () => {
    const result = await markAllAsRead(user.id);
    if (result.success) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }
  };

  return (
    <header className="h-30 bg-white border-b border-gray-300 shadow-md flex items-center justify-between px-6 relative">
      <div>
        <div className="text-3xl font-bold text-red-700">Dashboard Overview</div>
      <div className="text-sm font-normal text-gray-700">Monitor and Manage lost & found reports</div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification */}
        <div ref={notifRef} className="relative">
          <button 
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsOpen(false);
            }}
            className="relative text-gray-500 hover:text-gray-700 cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <IoNotifications size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Check size={14} /> Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {loading ? (
                  <div className="p-10 text-center space-y-3">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-gray-400 font-medium italic">Finding updates...</p>
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer group relative ${!notif.is_read ? 'bg-indigo-50/30' : ''}`}
                        onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
                      >
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            notif.type === 'alert' ? 'bg-red-100 text-red-600' : 
                            notif.type === 'success' ? 'bg-green-100 text-green-600' : 
                            'bg-blue-100 text-blue-600'
                          }`}>
                            <Bell size={18} />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                              <p className={`text-sm ${!notif.is_read ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                                {notif.title}
                              </p>
                              {!notif.is_read && (
                                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                              {notif.message}
                            </p>
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                              {formatDistanceToNow(new Date(notif.created_at))} ago
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-300">
                      <IoNotifications size={32} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-800">All caught up!</p>
                      <p className="text-xs text-gray-500">No new notifications for you right now.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-gray-100 text-center bg-gray-50/50">
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer">
                  View all activity history
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={24} className="text-gray-50" />
              )}
            </div>
            <div className="text-left text-sm">
              <p className="font-medium">{user?.user_metadata?.full_name || "System Admin"}</p>
              <p className="text-xs text-gray-500">System Administrator</p>
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute right-0 mt-7 w-72 bg-white rounded-xl shadow-xl border border-gray-300 overflow-hidden z-50">
              {/* Profile Header */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-300">
                <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden">
                  {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} className="text-gray-50" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{user?.user_metadata?.full_name || "System Admin"}</p>
                  <p className="text-sm text-gray-500">System Administrator</p>
                </div>
              </div>

              {/* Menu */}
              <div className="p-2">
                <Link to="/dashboard/profile">
                  <MenuItem
                    icon={User}
                    label="View Profile"
                    className="cursor-pointer"
                  />
                </Link>
                <MenuItem icon={Bell} label="Notification" />
                <MenuItem icon={HelpCircle} label="Help Center" />
                <MenuItem icon={Settings} label="Settings" />
              </div>

              <div className="border-t border-gray-300" />

              {/* Dark Mode */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <Moon size={18} />
                  <span className="text-sm font-medium">Dark Mode</span>
                </div>
                <div
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                    darkMode ? "bg-gray-700" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                      darkMode ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </div>
              </div>

              <div className="border-t border-gray-300" />

              {/* Logout */}
              <button
                onClick={async () => {
                  try {
                    const { logoutSupabase } = await import("../../../pages/auth/services/supabaseAuthService");
                    await logoutSupabase();
                    window.location.href = "/";
                  } catch (err) {
                    console.error("Logout error:", err);
                    window.location.href = "/";
                  }
                }}
                className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 text-red-600 font-medium"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuItem({ icon: Icon, label }) {
  return (
    <button className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-100">
      <Icon size={18} />
      {label}
    </button>
  );
}
