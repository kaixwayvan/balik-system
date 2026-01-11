import UserDashboardHeader from "./UserDashboardHeader";
import UserDashboardSidebar from "./UserDashboardSidebar";

export default function UserDashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <UserDashboardSidebar />
      <div className="flex-1 flex flex-col">
        <UserDashboardHeader />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}