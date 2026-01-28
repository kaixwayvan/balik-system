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

export default function UserDashboardHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-20 bg-white border-b border-gray-300 shadow-md flex items-center justify-between px-6 relative">
      <div className="font-semibold text-gray-700">BALIK Dashboard</div>

      <div className="flex items-center gap-4">
        {/* Notification */}
        <button className="text-gray-500 hover:text-gray-700">
          <IoNotifications size={18} />
        </button>

        {/* User */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-slate-300" />
            <div className="text-left text-sm">
              <p className="font-medium">Mike Wazowski</p>
              <p className="text-xs text-gray-500">Registered User</p>
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
                <div className="w-10 h-10 rounded-full bg-slate-300" />
                <div>
                  <p className="font-semibold">Mike Wazowski</p>
                  <p className="text-sm text-gray-500">Registered User</p>
                </div>
              </div>

              {/* Menu */}
              <div className="p-2">
                <MenuItem
                  icon={User}
                  label="View Profile"
                  className="cursor-pointer"
                />
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
              <Link to="/login">
                <button className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50">
                  <LogOut size={18} />
                  Log Out
                </button>
              </Link>
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
