import { useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  X,
  CircleArrowLeft,
  LayoutDashboard,
  Search,
  MapPin,
  FileText,
  Package,
  ClipboardCheck,
  History,
  Award,
  CircleStar,
  User,
  HelpCircle,
  Settings,
  LogOut,
} from "lucide-react";
import BALIKLogo from "../../../assets/BALIK.png";

export default function UserDashboardSidebar({ isOpen, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) onClose();
  };

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[14px] font-semibold relative transition-all duration-300 ${
      isActive
        ? "text-[#4A151B] bg-[#4A151B]/8 border-l-4 border-[#4A151B] shadow-[0_2px_10px_rgba(74,21,27,0.03)]"
        : "text-gray-500 hover:text-[#4A151B] hover:bg-[#4A151B]/5"
    }`;

  const mobileUtilityLinkClass =
    "flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[14px] font-semibold text-gray-500 hover:text-[#4A151B] hover:bg-[#4A151B]/5 transition-all duration-300 w-full text-left";

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/10 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Frame */}
      <aside
        className={`w-72 bg-[#FAF1EB] border-r border-[#F5EFE6] fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-[4px_0_30px_rgba(74,21,27,0.03)] flex flex-col`}
      >
        {/* Background Layers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#4A151B]/[0.05] blur-[60px]" />
          <div className="absolute -bottom-10 -left-20 w-72 h-72 rounded-full bg-[#A64B2A]/[0.06] blur-[60px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#4A151B_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.04] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]" />
        </div>

        {/* Single Scrollable Container */}
        <div className="relative z-10 w-full h-full overflow-y-auto p-5 pb-8 flex-1 space-y-6">
          <div>
            {/* (Desktop) Standard Brand Logo */}
            <div className="hidden lg:block mb-2">
              <NavLink to="/dashboard" end onClick={handleLinkClick} className="block">
                <img
                  src={BALIKLogo}
                  className="h-23 object-contain mx-auto transition-transform duration-300 hover:scale-[1.04]"
                  alt="BALIK Logo"
                />
              </NavLink>
            </div>

            {/* (Mobile) Menu "X" Home Button */}
            <div className="lg:hidden w-full flex justify-end">
              <button
                onClick={onClose}
                className="cursor-pointer p-2 rounded-full text-gray-500 hover:text-[#4A151B] hover:bg-[#4A151B]/2 active:scale-95 transition-all duration-200"
                aria-label="Close menu"
              >
                <CircleArrowLeft size={23} />
              </button>
            </div>
          </div>

          {/* Mobile Only */}
          <div className="lg:hidden p-5 bg-white/[0.35] backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] flex flex-col items-center text-center transition-all duration-300">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1527980965255-d3b416303d12"
                className="w-16 h-16 rounded-full object-cover border-[2.5px] border-white/90 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                alt="User Profile"
              />
              <span className="absolute bottom-0 right-1 block h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white/90 shadow-xs" />
            </div>

            <h4 className="font-semibold text-orange-900 text-base mt-3.5 tracking-tight leading-none">
              Mike
            </h4>
            <p className="text-[11px] text-red-800/90 font-medium mt-1.5 tracking-wide uppercase">
              ISKOLAR NG BAYAN
            </p>
          </div>

          <nav className="space-y-6">
            <div>
              <p className="text-[13px] font-black text-[#69301B] uppercase tracking-[0.15em] px-4 mb-2 opacity-80">
                Overview
              </p>
              <div className="space-y-0.5">
                <NavLink
                  to="/dashboard"
                  end
                  className={linkClass}
                  onClick={handleLinkClick}
                >
                  {({ isActive }) => (
                    <>
                      <LayoutDashboard
                        size={16}
                        className={`transition-colors duration-300 ${isActive ? "text-[#4A151B]" : "text-gray-400 group-hover:text-gray-700"}`}
                      />
                      <span>Dashboard</span>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/dashboard/search"
                  end
                  className={linkClass}
                  onClick={handleLinkClick}
                >
                  {({ isActive }) => (
                    <>
                      <Search
                        size={16}
                        className={`transition-colors duration-300 ${isActive ? "text-[#4A151B]" : "text-gray-400 group-hover:text-gray-700"}`}
                      />
                      <span>Search Items</span>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/dashboard/track"
                  end
                  className={linkClass}
                  onClick={handleLinkClick}
                >
                  {({ isActive }) => (
                    <>
                      <MapPin
                        size={16}
                        className={`transition-colors duration-300 ${isActive ? "text-[#4A151B]" : "text-gray-400 group-hover:text-gray-700"}`}
                      />
                      <span>Track Items</span>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/dashboard/reports"
                  end
                  className={linkClass}
                  onClick={handleLinkClick}
                >
                  {({ isActive }) => (
                    <>
                      <FileText
                        size={16}
                        className={`transition-colors duration-300 ${isActive ? "text-[#4A151B]" : "text-gray-400 group-hover:text-gray-700"}`}
                      />
                      <span>Active Reports</span>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/dashboard/found"
                  end
                  className={linkClass}
                  onClick={handleLinkClick}
                >
                  {({ isActive }) => (
                    <>
                      <Package
                        size={16}
                        className={`transition-colors duration-300 ${isActive ? "text-[#4A151B]" : "text-gray-400 group-hover:text-gray-700"}`}
                      />
                      <span>Found Items</span>
                    </>
                  )}
                </NavLink>
              </div>
            </div>

            <div>
              <p className="text-[13px] font-black text-[#69301B] uppercase tracking-[0.15em] px-4 mb-2 opacity-80">
                My Activity
              </p>
              <div className="space-y-0.5">
                <NavLink
                  to="/dashboard/myclaims"
                  className={linkClass}
                  onClick={handleLinkClick}
                >
                  {({ isActive }) => (
                    <>
                      <ClipboardCheck
                        size={16}
                        className={`transition-colors duration-300 ${isActive ? "text-[#4A151B]" : "text-gray-400 group-hover:text-gray-700"}`}
                      />
                      <span>My Claims</span>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/dashboard/history"
                  className={linkClass}
                  onClick={handleLinkClick}
                >
                  {({ isActive }) => (
                    <>
                      <History
                        size={16}
                        className={`transition-colors duration-300 ${isActive ? "text-[#4A151B]" : "text-gray-400 group-hover:text-gray-700"}`}
                      />
                      <span>Activity History</span>
                    </>
                  )}
                </NavLink>
              </div>
            </div>

            <div>
              <p className="text-[13px] font-black text-[#69301B] uppercase tracking-[0.15em] px-4 mb-2.5 opacity-80">
                Achievements
              </p>
              <div className="space-y-3 px-4 pt-0.5">
                <div className="flex items-center gap-3 group/item cursor-default">
                  <div className="p-1.5 rounded-lg bg-[#A64B2A]/5 border border-[#A64B2A]/10 text-[#A64B2A] transition-colors duration-300">
                    <Award size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700 leading-none">
                      Helper Badge
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium mt-1">
                      5 items returned
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 group/item cursor-default">
                  <div className="p-1.5 rounded-lg bg-[#A64B2A]/5 border border-[#A64B2A]/10 text-[#A64B2A] transition-colors duration-300">
                    <CircleStar size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700 leading-none">
                      Active Reporter
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium mt-1">
                      10+ submissions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Only */}
            <div className="lg:hidden pt-4 border-t border-[#F5EFE6]/70 space-y-0.5">
              <Link
                to="/dashboard/profile"
                onClick={handleLinkClick}
                className={mobileUtilityLinkClass}
              >
                <User
                  size={16}
                  className="text-gray-400 group-hover:text-[#4A151B]"
                />
                <span>Profile Settings</span>
              </Link>

              <Link
                to="/help"
                onClick={handleLinkClick}
                className={mobileUtilityLinkClass}
              >
                <HelpCircle
                  size={16}
                  className="text-gray-400 group-hover:text-[#4A151B]"
                />
                <span>Help Center</span>
              </Link>

              <Link
                to="/login"
                onClick={handleLinkClick}
                className={`${mobileUtilityLinkClass} !text-[#4A151B] hover:bg-[#4A151B]/8 pt-2.5 mt-1`}
              >
                <LogOut size={16} className="text-[#4A151B]" />
                <span className="font-bold">Log Out</span>
              </Link>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}