import { Routes, Route } from "react-router-dom";
import RootLayout from "./shared/components/layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import DashboardHome from "./pages/user-dashboard/DashboardHome";
import DashboardSearch from "./components/UserDashboard/SearchItems/SearchItems"
import DashboardtTrack from "./components/UserDashboard/TrackItems/TrackItems"
import DashboardReport from "./components/UserDashboard/ActiveReports/ActiveReports"
import DashboardFound from "./components/UserDashboard/FoundItems/FoundItems"

import UserDashboardLayout from "./shared/components/layouts/UserDashboardLayout";
import SubmitReport from "./components/UserDashboard/Home/SubmitReport";
import ComingSoonPage from "./pages/ComingSoonPage";

function App() {
  return (
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

      {/* Dashboard with its own layout */}
      <Route element={<UserDashboardLayout />}>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/search" element={<DashboardSearch />} />
        <Route path="/dashboard/track" element={<DashboardtTrack />} />
        <Route path="/dashboard/reports" element={<DashboardReport />} />
        <Route path="/dashboard/found" element={<DashboardFound />} />
      </Route>
    </Routes>
  );
}

export default App;
