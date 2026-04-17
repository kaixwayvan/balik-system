import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  ShieldCheck,
  FileText,
  ScanQrCode,
  MapPinPen,
  Users,
  Trophy,
  ScrollText,
  Settings,
} from "lucide-react";
import BALIKLogo from "../../../assets/BALIK.png";

export default function AdminDashboardSidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-11 py-4 text-md font-bold transition ${
      isActive ? "bg-[#5C1313] text-white" : "text-gray-100 hover:bg-white/20"
    }`;

  return (
    <aside className="w-72 flex flex-col">
      <div className="bg-white p-4 flex-shrink-0">
        <NavLink to="/" end>
          <img
            src={BALIKLogo}
            className="cursor-alias h-25 mx-auto"
            alt="BALIK Logo"
          />
        </NavLink>
      </div>

      <nav className="flex-1 bg-[#3A3B67] border-t border-gray-300 shadow-lg overflow-y-auto -mt-[11px]">
        <div className="flex flex-col min-h-full">
          <p className="text-xl font-extrabold text-[#FAD098] px-9 pt-9 pb-3 uppercase">
            Overview
          </p>

          <div className="flex flex-col flex-1">
            <NavLink to="/admin" end className={linkClass}>
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            <NavLink to="/admin/lost-manage" end className={linkClass}>
              <Search size={18} />
              Lost Items
            </NavLink>

            <NavLink to="/admin/found-manage" end className={linkClass}>
              <ShieldCheck size={18} />
              Found Items
            </NavLink>

            <NavLink to="/admin/matching" end className={linkClass}>
              <FileText size={18} />
              AI Matches
            </NavLink>

            <NavLink to="/admin/qr-verify" end className={linkClass}>
              <ScanQrCode size={18} />
              QR Verification
            </NavLink>

            <NavLink to="/comingsoon" end className={linkClass}>
              <MapPinPen size={18} />
              Track Items
            </NavLink>

            <NavLink to="/comingsoon" end className={linkClass}>
              <Users size={18} />
              User Management
            </NavLink>

            <NavLink to="/comingsoon" end className={linkClass}>
              <Trophy size={18} />
              Gamification
            </NavLink>

            <NavLink to="/comingsoon" end className={linkClass}>
              <ScrollText size={18} />
              Activity Logs
            </NavLink>

            <NavLink to="/comingsoon" end className={linkClass}>
              <Settings size={18} />
              Settings
            </NavLink>
          </div>
        </div>
      </nav>
    </aside>
  );
}
