import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./shared/context/AuthContext";
import RootLayout from "./shared/components/layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AuthCallback from "./pages/auth/AuthCallback";

import DashboardHome from "./pages/user-dashboard/DashboardHome";
import DashboardSearch from "./components/UserDashboard/SearchItems/SearchItems"
import DashboardtTrack from "./components/UserDashboard/TrackItems/TrackItems"
import DashboardReport from "./components/UserDashboard/ActiveReports/ActiveReports"
import DashboardFound from "./components/UserDashboard/FoundItems/FoundItems"
import DashboardClaims from "./components/UserDashboard/MyClaims/MyClaims"
import DashboardProfile from "./components/UserDashboard/UserProfile/UserProfile";
import DashboardHistory from "./components/UserDashboard/ActivityHistory/ActivityHistory";

import UserDashboardLayout from "./shared/components/layouts/UserDashboardLayout";
import SubmitReport from "./components/UserDashboard/Home/SubmitReport";
import ComingSoonPage from "./pages/ComingSoonPage";

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

        {/* Dashboard with its own layout */}
        <Route element={<UserDashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/search" element={<DashboardSearch />} />
          <Route path="/dashboard/track" element={<DashboardtTrack />} />
          <Route path="/dashboard/reports" element={<DashboardReport />} />
          <Route path="/dashboard/found" element={<DashboardFound />} />
          <Route path="/dashboard/claims" element={<DashboardClaims />} />
          <Route path="/dashboard/myclaims" element={<DashboardClaims />} />
          <Route path="/dashboard/profile" element={<DashboardProfile />} />
          <Route path="/dashboard/history" element={<DashboardHistory />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
