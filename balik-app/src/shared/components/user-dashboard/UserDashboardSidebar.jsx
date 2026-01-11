import { NavLink } from "react-router-dom";

export default function UserDashboardSidebar() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg text-sm ${{ true: "bg-red-100 text-red-700", false: "text-gray-600 hover:bg-gray-100" }[isActive]}`;

  return (
    <aside className="w-64 bg-white border-r p-4">
      <div className="text-2xl font-bold text-red-700 mb-6">BALIK</div>

      <nav className="space-y-6">
        <div>
          <p className="text-xs text-gray-400 mb-2">OVERVIEW</p>
          <div className="space-y-1">
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/dashboard/search" className={linkClass}>Search Items</NavLink>
            <NavLink to="/dashboard/track" className={linkClass}>Track Items</NavLink>
            <NavLink to="/dashboard/active" className={linkClass}>Active Reports</NavLink>
            <NavLink to="/dashboard/found" className={linkClass}>Found Items</NavLink>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-2">MY ACTIVITY</p>
          <div className="space-y-1">
            <NavLink to="/dashboard/claims" className={linkClass}>My Claims</NavLink>
            <NavLink to="/dashboard/history" className={linkClass}>Activity History</NavLink>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-2">ACHIEVEMENTS</p>
          <div className="bg-yellow-50 p-3 rounded-lg text-sm">
            <p className="font-medium text-yellow-700">Helper Badge</p>
            <p className="text-xs text-yellow-600">5 items helped return</p>
          </div>
        </div>
      </nav>
    </aside>
  );
}