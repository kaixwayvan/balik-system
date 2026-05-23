import { useEffect } from "react";
import WelcomeBanner from "../../components/UserDashboard/Home/WelcomeBanner";
import StatsCards from "../../components/UserDashboard/Home/StatsCards";
import QuickActions from "../../components/UserDashboard/Home/QuickActions";
import PointsPanel from "../../components/UserDashboard/Home/PointsPanel";
import RecentActivity from "../../components/UserDashboard/Home/RecentActivity";
import AchievementsPanel from "../../components/UserDashboard/Home/AchievementsPanel";

export default function DashboardHome() {
  useEffect(() => {
    document.title = "Dashboard Home - BALIK System";
    
    return () => {
      document.title = "Balik System"; 
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F1E6] p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Welcome Banner */}
        <div className="lg:col-span-12">
          <WelcomeBanner />
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-12">
          <StatsCards />
        </div>

        {/* Content */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          <QuickActions />
          <RecentActivity />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          <PointsPanel />
          <AchievementsPanel />
        </div>
        
      </div>
    </div>
  );
}