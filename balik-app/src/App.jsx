import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageWrapper } from "./pages/transition/PageWrapper";

import RootLayout from "./shared/components/layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";

import DashboardHome from "./pages/user-dashboard/DashboardHome";
import DashboardSearch from "./components/UserDashboard/SearchItems/SearchItems";
import DashboardtTrack from "./components/UserDashboard/TrackItems/TrackItems";
import DashboardReport from "./components/UserDashboard/ActiveReports/ActiveReports";
import DashboardFound from "./components/UserDashboard/FoundItems/FoundItems";
import DashboardClaims from "./components/UserDashboard/MyClaims/MyClaims";
import DashboardHistory from "./components/UserDashboard/ActivityHistory/ActivityHistory";
import DashboardProfile from "./components/UserDashboard/UserProfile/UserProfile";
import DashboardNotification from "./components/UserDashboard/UserProfile/NotificationPage";

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
import ClaimRequests from "./components/AdminDashboard/ClaimRequests/ClaimRequests";

import UserDashboardLayout from "./shared/components/layouts/UserDashboardLayout";
import AdminDashboardLayout from "./shared/components/layouts/AdminDashboardLayout";

import SubmitReport from "./components/UserDashboard/Home/SubmitReport";
import AdminReport from "./components/AdminDashboard/AdminHome/AdminReport";
import ComingSoonPage from "./pages/ComingSoonPage";
import HelpCenter from "./pages/HelpCenter";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import AboutUs from "./pages/AboutUs";

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* Pages with layout (Layout wraps internal outlets) */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<PageWrapper><AboutUs /></PageWrapper>} />
        </Route>

        {/* Independent standalone layouts wrap custom cards */}
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
        <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
        <Route path="/comingsoon" element={<PageWrapper><ComingSoonPage /></PageWrapper>} />
        <Route path="/submitreport" element={<PageWrapper><SubmitReport /></PageWrapper>} />
        <Route path="/admin/report" element={<PageWrapper><AdminReport /></PageWrapper>} />

        {/* Footer info pages */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfUse />} />
        <Route path="/help" element={<HelpCenter />} />

        {/* Dashboard layouts handle page wrapper switches seamlessly */}
        <Route element={<UserDashboardLayout />}>
          <Route path="/dashboard" element={<PageWrapper><DashboardHome /></PageWrapper>} />
          <Route path="/dashboard/search" element={<PageWrapper><DashboardSearch /></PageWrapper>} />
          <Route path="/dashboard/track" element={<PageWrapper><DashboardtTrack /></PageWrapper>} />
          <Route path="/dashboard/reports" element={<PageWrapper><DashboardReport /></PageWrapper>} />
          <Route path="/dashboard/found" element={<PageWrapper><DashboardFound /></PageWrapper>} />
          <Route path="/dashboard/myclaims" element={<PageWrapper><DashboardClaims /></PageWrapper>} />
          <Route path="/dashboard/history" element={<PageWrapper><DashboardHistory /></PageWrapper>} />
          <Route path="/dashboard/profile" element={<PageWrapper><DashboardProfile /></PageWrapper>} />
          <Route path="/dashboard/notifications" element={<PageWrapper><DashboardNotification /></PageWrapper>} />
        </Route>

        {/* Admin Dashboard layout sets layout wrappers */}
        <Route element={<AdminDashboardLayout />}>
          <Route path="/admin" element={<AdminDashboardHome />} />
          <Route path="/admin/lost-manage" element={<LostItems />} />
          <Route path="/admin/found-manage" element={<FoundItems />} />
          <Route path="/admin/matching" element={<AIMatches />} />
          <Route path="/admin/qr-verify" element={<QRVerification />} />
          <Route path="/admin/claim-requests" element={<ClaimRequests />} />
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