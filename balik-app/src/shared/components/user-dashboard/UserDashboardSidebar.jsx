import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  MapPin,
  FileText,
  Package,
  ClipboardCheck,
  History,
  Award,
  CircleStar,
} from "lucide-react";
import BALIKLogo from "../../../assets/BALIK.png";
import { useAuth } from "../../context/AuthContext";
import { User as UserIcon } from "lucide-react";

export default function UserDashboardSidebar() {
  const { user } = useAuth();
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${isActive ? "bg-red-100 text-red-700" : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-72 bg-white border-r border-gray-200 p-4 flex flex-col h-full">
      {/* Logo */}
      <NavLink to="/" end>
        <img src={BALIKLogo} className="h-30 mb-6 mx-auto -translate-y-3 translate-y-3" alt="BALIK Logo" />
      </NavLink>

      <nav className="space-y-6">
        {/* OVERVIEW */}
        <div>
          <p className="text-lg font-extrabold text-yellow-700 mb-2 uppercase">
            Overview
          </p>
          <div className="space-y-1">
            <NavLink to="/dashboard" end className={linkClass}>
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            <NavLink to="/dashboard/search" end className={linkClass}>
              <Search size={18} />
              Search Items
            </NavLink>

            <NavLink to="/dashboard/track" end className={linkClass}>
              <MapPin size={18} />
              Track Items
            </NavLink>

            <NavLink to="/dashboard/reports" end className={linkClass}>
              <FileText size={18} />
              Active Reports
            </NavLink>

            <NavLink to="/dashboard/found" end className={linkClass}>
              <Package size={18} />
              Found Items
            </NavLink>
          </div>
        </div>

        {/* MY ACTIVITY */}
        <div>
          <p className="text-lg font-extrabold text-yellow-700 mb-2 uppercase">
            My Activity
          </p>
          <div className="space-y-1">
            <NavLink to="/dashboard/claims" className={linkClass}>
              <ClipboardCheck size={18} />
              My Claims
            </NavLink>

            <NavLink to="/dashboard/history" className={linkClass}>
              <History size={18} />
              Activity History
            </NavLink>
          </div>
        </div>

        {/* ACHIEVEMENTS */}
        <div>
          <p className="text-lg font-extrabold text-yellow-700 mb-2 uppercase">
            Achievements
          </p>

          <div className="cursor-not-allowed flex items-start gap-3 bg-yellow-100 p-3 rounded-lg mb-2">
            <Award className="text-yellow-600 mt-1" size={20} />
            <div>
              <p className="font-medium text-yellow-700">Helper Badge</p>
              <p className="text-xs text-yellow-600">5 items helped return</p>
            </div>
          </div>

          <div className="cursor-not-allowed flex items-start gap-3 bg-blue-100 p-3 rounded-lg">
            <CircleStar className="text-blue-800 mt-1" size={20} />
            <div>
              <p className="font-medium text-blue-800">Active Reporter</p>
              <p className="text-xs text-blue-800">10+ reports submitted</p>
            </div>
          </div>
        </div>
      </nav>

      {/* User Profile at Bottom */}
      <div className="mt-auto pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={20} className="text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-bold text-gray-900 truncate">
              {user?.user_metadata?.full_name || "Guest User"}
            </p>
            <p className="text-[10px] text-gray-500 truncate uppercase tracking-wider font-semibold">
              ISKOLAR NG BAYAN
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
