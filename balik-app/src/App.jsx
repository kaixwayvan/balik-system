import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./shared/context/AuthContext";
import RootLayout from "./shared/components/layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AuthCallback from "./pages/auth/AuthCallback";

import DashboardHome from "./pages/user-dashboard/DashboardHome";
import DashboardSearch from "./components/UserDashboard/SearchItems/SearchItems";
import DashboardTrack from "./components/UserDashboard/TrackItems/TrackItems";
import DashboardReport from "./components/UserDashboard/ActiveReports/ActiveReports";
import DashboardFound from "./components/UserDashboard/FoundItems/FoundItems";
import DashboardClaims from "./components/UserDashboard/MyClaims/MyClaims";
import DashboardHistory from "./components/UserDashboard/ActivityHistory/ActivityHistory";
import DashboardProfile from "./components/UserDashboard/UserProfile/UserProfile";

import UserDashboardLayout from "./shared/components/layouts/UserDashboardLayout";
import AdminDashboardLayout from "./shared/components/layouts/AdminDashboardLayout";

import AdminDashboardHome from "./pages/admin-dashboard/AdminDashboardHome";
import LostItems from "./components/AdminDashboard/LostItems/LostItems";
import FoundItems from "./components/AdminDashboard/FoundItems/FoundItems";
import AIMatches from "./components/AdminDashboard/AIMatches/AIMatches";
import QRVerification from "./components/AdminDashboard/QRVerification/QRVerification";
import ItemTrackingPage from "./components/AdminDashboard/TrackItems/ItemTrackingPage";
import AdminReport from "./components/AdminDashboard/AdminHome/AdminReport";

import SubmitReport from "./components/UserDashboard/Home/SubmitReport";
import ComingSoonPage from "./pages/ComingSoonPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";

import AdminRoute from "./shared/components/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Pages with layout */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Pages without layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/comingsoon" element={<ComingSoonPage />} />
        <Route path="/submitreport" element={<SubmitReport />} />
        <Route path="/adminreport" element={<AdminReport />} />

        {/* Footer Routes */}
        <Route path="/about-us" element={<ComingSoonPage />} />
        <Route path="/contact" element={<ComingSoonPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfUse />} />
        <Route path="/cookie-policy" element={<ComingSoonPage />} />
        <Route path="/help-center" element={<ComingSoonPage />} />
        <Route path="/safety-tips" element={<ComingSoonPage />} />
        <Route path="/community-guidelines" element={<ComingSoonPage />} />
        <Route path="/report-abuse" element={<ComingSoonPage />} />

        {/* User Dashboard */}
        <Route element={<UserDashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/search" element={<DashboardSearch />} />
          <Route path="/dashboard/track" element={<DashboardTrack />} />
          <Route path="/dashboard/reports" element={<DashboardReport />} />
          <Route path="/dashboard/found" element={<DashboardFound />} />
          <Route path="/dashboard/claims" element={<DashboardClaims />} />
          <Route path="/dashboard/history" element={<DashboardHistory />} />
          <Route path="/dashboard/profile" element={<DashboardProfile />} />
        </Route>

        {/* Admin Dashboard (protected) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboardHome />} />
          <Route path="lost-manage" element={<LostItems />} />
          <Route path="found-manage" element={<FoundItems />} />
          <Route path="matching" element={<AIMatches />} />
          <Route path="qr-verify" element={<QRVerification />} />
          <Route path="track-items" element={<ItemTrackingPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;