import WelcomeBanner from "../../components/UserDashboardHome/WelcomeBanner";
import StatsCards from "../../components/UserDashboardHome/StatsCards";
import QuickActions from "../../components/UserDashboardHome/QuickActions";
import PointsPanel from "../../components/UserDashboardHome/PointsPanel";
import RecentActivity from "../../components/UserDashboardHome/RecentActivity";
import AchievementsPanel from "../../components/UserDashboardHome/AchievementsPanel";

export default function DashboardHome() {
  return (
    <div className="min-h-screen bg-slate-200 p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Welcome Banner – full width */}
        <div className="col-span-12">
          <WelcomeBanner />
        </div>

        {/* Stats Cards – full width */}
        <div className="col-span-12">
          <StatsCards />
        </div>

        {/* LEFT COLUMN */}
        <div className="col-span-8 space-y-6">
          <QuickActions />
          <RecentActivity />
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-4 space-y-6">
          <PointsPanel />
          <AchievementsPanel />
        </div>
      </div>
    </div>
  );
}
