import { Routes, Route } from "react-router-dom";
import RootLayout from "./shared/components/layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import RequireAuth from "./shared/components/RequireAuth";

function App() {
  return (
    <Routes>
      {/* Pages with layout */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Pages without layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      } />
    </Routes>
  );
}

export default App;
