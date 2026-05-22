import { useState } from "react";
import { Outlet } from "react-router-dom";
import UserDashboardHeader from "../user-dashboard/UserDashboardHeader";
import UserDashboardSidebar from "../user-dashboard/UserDashboardSidebar";

export default function UserDashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-800 antialiased flex flex-col selection:bg-[#4A151B]/10 selection:text-[#4A151B]">
      <UserDashboardSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <UserDashboardHeader 
        onMenuClick={() => setIsSidebarOpen(true)} 
      />
      <div className="flex-1 pt-30 lg:pl-72 transition-all duration-300 ease-in-out">
        <main className="max-w-7xl mx-auto min-h-[calc(100vh-5rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}