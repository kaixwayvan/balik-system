import { Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import UserDashboardHeader from "../user-dashboard/UserDashboardHeader";
import UserDashboardSidebar from "../user-dashboard/UserDashboardSidebar";

export default function UserDashboardLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      const role = user.user_metadata?.role?.toLowerCase();
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      }
    } else if (!loading && !user) {
      navigate('/login', { replace: true });
    }
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