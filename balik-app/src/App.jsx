import { Routes, Route } from "react-router-dom";
import RootLayout from "./shared/components/layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

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
    </Routes>
  );
}

export default App;
