import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import AdminDashboardHeader from "../admin-dashboard/AdminDashboardHeader";
import AdminDashboardSidebar from "../admin-dashboard/AdminDashboardSidebar";

// Auth Simulation
const useAuth = () => ({
  user: { user_metadata: { full_name: "Admin User", role: "admin", avatar_url: "" }, role: "admin" },
  loading: false,
  activeRole: "admin",
  switchRole: (role) => console.log("Switched to", role)
});

export default function AdminDashboardLayout() {
  const { user, loading, activeRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const actualRole = user?.role || user?.user_metadata?.role;

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
    else if (!loading && user && actualRole !== "admin") navigate("/dashboard", { replace: true });
  }, [user, loading, actualRole, navigate]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5C1313] mx-auto mb-4" />
      </div>
    );
  }

  if (!user || actualRole !== "admin") return null;

  return (
    <div className="flex h-screen bg-[#F0E6DD] overflow-hidden selection:bg-[#E8B86D]/30 relative">
      
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-900/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-[#120202]/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <AdminDashboardSidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />

      <div className="flex flex-col flex-1 h-full w-full overflow-hidden relative z-10">
        <AdminDashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 flex flex-col overflow-hidden p-6 sm:p-5 lg:p-4 lg:pl-1 mb-2 rounded-[3rem]">
          <motion.div 
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mx-auto max-w-[1400px] h-full w-full flex flex-col overflow-hidden"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}