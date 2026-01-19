import { IoNotifications } from "react-icons/io5";

export default function UserDashboardHeader() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div className="font-semibold text-gray-700">BALIK Dashboard</div>
      <div className="flex items-center gap-4 p-6">
        <button className="cursor-pointer text-gray-500">
          <IoNotifications size={18} className="text-gray-500" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-slate-300" />
          <div className="text-sm">
            <p className="font-medium">Mike Wazowski</p>
            <p className="text-xs text-gray-500">Registered User</p>
          </div>
        </div>
      </div>
    </header>
  );
}
