import WelcomeBanner from "../../components/UserDashboardHome/WelcomeBanner";
import StatsCards from "../../components/UserDashboardHome/StatsCards.jsx";
import QuickActions from "../../components/UserDashboardHome/QuickActions";
import PointsPanel from "../../components/UserDashboardHome/PointsPanel";
import RecentActivity from "../../components/UserDashboardHome/RecentActivity";
import AchievementsPanel from "../../components/UserDashboardHome/AchievementsPanel";

export default function DashboardHome() {
  return (
    <div className="flex gap-6 p-6 bg-slate-100 min-h-screen">
      <div className="flex-1 space-y-6">
        <WelcomeBanner />
        <StatsCards />
        <QuickActions />
        <RecentActivity />
      </div>

      <div className="w-[320px] space-y-6">
        <PointsPanel />
        <AchievementsPanel />
      </div>
    </div>
  );
}