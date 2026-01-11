import { Routes, Route } from "react-router-dom";
import RootLayout from "./shared/components/layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import DashboardHome from "./pages/user-dashboard/DashboardHome";
import UserDashboardLayout from "./shared/components/layouts/UserDashboardLayout";
import SubmitReport from "./components/UserDashboardHome/SubmitReport";
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
      <Route
        path="/dashboard"
        element={
          <UserDashboardLayout>
            <DashboardHome />
          </UserDashboardLayout>
        }
      />
    </Routes>
  );
}

export default App;
