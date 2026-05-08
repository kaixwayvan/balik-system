import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminDashboardHeader from "../admin-dashboard/AdminDashboardHeader";
import AdminDashboardSidebar from "../admin-dashboard/AdminDashboardSidebar";

export default function AdminDashboardLayout() {
  const { user, loading } = useAuth();


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