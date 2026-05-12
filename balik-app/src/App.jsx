import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import RootLayout from "./shared/components/layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import DashboardHome from "./pages/user-dashboard/DashboardHome";
import DashboardSearch from "./components/UserDashboard/SearchItems/SearchItems";
import DashboardtTrack from "./components/UserDashboard/TrackItems/TrackItems";
import DashboardReport from "./components/UserDashboard/ActiveReports/ActiveReports";
import DashboardFound from "./components/UserDashboard/FoundItems/FoundItems";
import DashboardClaims from "./components/UserDashboard/MyClaims/MyClaims";
import DashboardHistory from "./components/UserDashboard/ActivityHistory/ActivityHistory";
import DashboardProfile from "./components/UserDashboard/UserProfile/UserProfile";

import AdminDashboardHome from "./pages/admin-dashboard/AdminDashboardHome";
import LostItems from "./components/AdminDashboard/LostItems/LostItems";
import FoundItems from "./components/AdminDashboard/FoundItems/FoundItems";
import AIMatches from "./components/AdminDashboard/AIMatches/AIMatches";
import QRVerification from "./components/AdminDashboard/QRVerification/QRVerification";
import TrackItems from "./components/AdminDashboard/TrackItems/ItemTrackingPage";
import UserManagement from "./components/AdminDashboard/UserManagement/UsersPage";
import Gamification from "./components/AdminDashboard/Gamification/GamificationPage";
import ActivityLogs from "./components/AdminDashboard/ActivityLogs/ActivityLogs";
import SettingsPage from "./components/AdminDashboard/Settings/SettingsPage";

import UserDashboardLayout from "./shared/components/layouts/UserDashboardLayout";
import AdminDashboardLayout from "./shared/components/layouts/AdminDashboardLayout";

import SubmitReport from "./components/UserDashboard/Home/SubmitReport";
import AdminReport from "./components/AdminDashboard/AdminHome/AdminReport";
import ComingSoonPage from "./pages/ComingSoonPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import AboutUs from "./pages/AboutUs";

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Pages with layout */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Pages without layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/comingsoon" element={<ComingSoonPage />} />
        <Route path="/submitreport" element={<SubmitReport />} />
        <Route path="/adminreport" element={<AdminReport />} />

        {/* Footer Routes */}
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfUse />} />

        {/* Dashboard with its own layout */}
        <Route element={<UserDashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/search" element={<DashboardSearch />} />
          <Route path="/dashboard/track" element={<DashboardtTrack />} />
          <Route path="/dashboard/reports" element={<DashboardReport />} />
          <Route path="/dashboard/found" element={<DashboardFound />} />
          <Route path="/dashboard/myclaims" element={<DashboardClaims />} />
          <Route path="/dashboard/history" element={<DashboardHistory />} />
          <Route path="/dashboard/profile" element={<DashboardProfile />} />
        </Route>

        <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route index element={<AdminDashboardHome />} />
          <Route path="/admin/lost-manage" element={<LostItems />} />
          <Route path="/admin/found-manage" element={<FoundItems />} />
          <Route path="/admin/matching" element={<AIMatches />} />
          <Route path="/admin/qr-verify" element={<QRVerification />} />
          <Route path="/admin/track-items" element={<TrackItems />} />
          <Route path="/admin/users-manage" element={<UserManagement />} />
          <Route path="/admin/gamification" element={<Gamification />} />
          <Route path="/admin/logs" element={<ActivityLogs />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
