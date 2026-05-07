import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminDashboardHeader from "../admin-dashboard/AdminDashboardHeader";
import AdminDashboardSidebar from "../admin-dashboard/AdminDashboardSidebar";

export default function AdminDashboardLayout() {
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user && !loading) {
        const lastRefresh = sessionStorage.getItem('last_admin_refresh');
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;

        if (!lastRefresh || (now - parseInt(lastRefresh)) > fiveMinutes) {
          console.log("Admin Tab visible - refreshing...");
          sessionStorage.setItem('last_admin_refresh', now.toString());
          window.location.reload();
        } else {
          console.log("Admin Tab visible - performing silent update...");
          window.dispatchEvent(new CustomEvent('silent-refresh'));
        }
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user, loading]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminDashboardSidebar />
      <div className="flex flex-col flex-1">
        <AdminDashboardHeader />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}