import { Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import UserDashboardHeader from "../user-dashboard/UserDashboardHeader";
import UserDashboardSidebar from "../user-dashboard/UserDashboardSidebar";

export default function UserDashboardLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Handle Redirects
    if (!loading && user) {
      const role = user.user_metadata?.role?.toLowerCase();
      if (role === 'admin' && !window.location.pathname.startsWith('/admin')) {
        navigate('/admin', { replace: true });
      }
    } else if (!loading && !user) {
      navigate('/login', { replace: true });
    }

    // 2. Handle Silent Refresh on focus/tab switch
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user && !loading) {
        const lastRefresh = sessionStorage.getItem('last_dashboard_refresh');
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;

        if (!lastRefresh || (now - parseInt(lastRefresh)) > fiveMinutes) {
          console.log("Tab visible & 5m passed - refreshing session...");
          sessionStorage.setItem('last_dashboard_refresh', now.toString());
          window.location.reload();
        } else {
          console.log("Tab visible - performing silent data update...");
          window.dispatchEvent(new CustomEvent('silent-refresh'));
        }
      }
    };
    
    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <UserDashboardSidebar />
      <div className="flex-1 flex flex-col">
        <UserDashboardHeader />
        <main className="flex-1 overflow-y-auto"><Outlet /></main>
      </div>
    </div>
  );
}