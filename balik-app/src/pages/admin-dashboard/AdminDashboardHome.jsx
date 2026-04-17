import QuickActions from "../../components/AdminDashboard/AdminHome/QuickActions";
import StatCards from "../../components/AdminDashboard/AdminHome/StatCards";
import RecentReports from "../../components/AdminDashboard/AdminHome/RecentReports";
import OverviewCards from "../../components/AdminDashboard/AdminHome/OverviewCards";

export default function AdminDashboardHome() {
  return (
    <div className="flex flex-col h-screen bg-slate-200 p-6 space-y-6 overflow-y-auto">
          <QuickActions />
          <StatCards />
          <RecentReports />
          <OverviewCards />
    </div>
  );
}