import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import {
  loginWithMicrosoft,
  loginWithPassword,
} from "../auth/services/authService";

import BALIKLogo from "../../assets/BALIK.png";
import StudentSupportImg from "../../assets/auth-assets/studentsupport.png";

export default function Login() {
  useEffect(() => {
    document.title = "Sign In - BALIK";
  }, []);

  const { instance } = useMsal();
  const [form, setForm] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isMobile = (value) => /^(09|\+639)\d{9}$/.test(value);

  const validateForm = () => {
    const newErrors = {};
    if (!form.identifier) newErrors.identifier = "Required.";
    else if (!isEmail(form.identifier) && !isMobile(form.identifier))
      newErrors.identifier = "Invalid format.";
    if (!form.password) newErrors.password = "Required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePUPLogin = async () => {
    setLoading(true);
    try {
      const result = await instance.loginPopup({
        scopes: ["User.Read"],
        extraQueryParameters: { domain_hint: "iskolarngbayan.pup.edu.ph" },
      });

      const userEmail = result.account.username.toLowerCase();
      if (userEmail.endsWith("@iskolarngbayan.pup.edu.ph")) {
        await loginWithMicrosoft(result.accessToken);
      } else {
        await instance.logoutPopup();
        setError("Unauthorized. Please use your official PUP Webmail.");
      }
    } catch (e) {
      setError("Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await loginWithPassword(form);
    } catch {
      setError("Invalid credentials.");
    }
    setLoading(false);
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#FAF7F5] selection:bg-[#520000] selection:text-white">
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0">
        {/* Base Mesh Gradient */}
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, #FDF4F0 0%, transparent 40%),
              radial-gradient(circle at 80% 0%, #FFE8D6 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, #FAF7F5 0%, transparent 100%),
              radial-gradient(circle at 10% 90%, #E9D5CA 0%, transparent 40%),
              radial-gradient(circle at 90% 90%, #F5E3D6 0%, transparent 40%)
            `,
          }}
        />

        {/* Animated Glow Orbs */}
        <div
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-crimson-500/10 blur-[120px] animate-pulse"
          style={{ backgroundColor: "rgba(165, 42, 42, 0.08)" }}
        />
        <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-[#B0570C]/10 blur-[130px] animate-bounce duration-[10s]" />

        {/* Glassmorphism Blobs */}
        <div className="absolute top-[20%] right-[15%] w-64 h-64 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl border border-white/20 animate-spin-slow opacity-60" />

        {/* Geometric Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#B0570C]/5 rounded-full shadow-sm pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] border border-[#B0570C]/5 rounded-full shadow-sm pointer-events-none" />

        {/* Glow Orbs */}
        <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-[#B0570C]/10 to-transparent blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-[#520000]/5 to-transparent blur-[100px]" />

        {/* Precision Rings - Bottom Left */}
        <div
          className="absolute top-[15%] left-[10%] w-40 h-40 md:w-72 md:h-72 
                  border-[1px] border-[#B0570C]/20 rounded-full 
                  flex items-center justify-center animate-pulse"
        >
          <div className="w-[80%] h-[80%] border-[1px] border-[#B0570C]/10 rounded-full" />
          <div
            className="absolute w-full h-full border-t-2 border-[#B0570C]/5 rounded-full animate-spin"
            style={{ animationDuration: "10s" }}
          />
        </div>

        <div
          className="absolute bottom-[5%] right-[7%] w-40 h-40 md:w-72 md:h-72 
                  border-[1px] border-[#B0570C]/20 rounded-full 
                  flex items-center justify-center animate-pulse"
        >
          <div className="w-[80%] h-[80%] border-[1px] border-[#B0570C]/10 rounded-full" />
          <div
            className="absolute w-full h-full border-t-2 border-[#B0570C]/5 rounded-full animate-spin"
            style={{ animationDuration: "10s" }}
          />
        </div>

        {/* Highlights */}
        <div className="absolute top-1/4 left-1/3 w-1 h-32 bg-gradient-to-b from-transparent via-[#B0570C]/20 to-transparent blur-sm" />
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
        {/* LEFT SIDE: BRANDING */}
        <section className="hidden lg:block w-1/2 text-left space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-12 bg-[#B0570C]" />
              <span className="text-xs font-bold tracking-[0.4em] text-[#B0570C] uppercase">
                Secure Ecosystem
              </span>
            </div>
            <h1 className="text-8xl font-black text-[#520000] leading-none tracking-tighter font-['Zalando_Sans_Expanded']">
              BALIK<span className="text-[#B0570C]"></span>
            </h1>
          </div>

          <div className="space-y-6">
            <p className="text-3xl font-light text-[#520000]/70 font-serif italic">
              "Find what matters, <br />
              <span className="text-[#2D1B13] font-bold not-italic">
                securely and effortlessly.
              </span>
              "
            </p>
            <p className="max-w-sm text-sm text-gray-500 font-medium leading-relaxed tracking-wide">
              A premium, AI-driven lost and found gateway designed for the PUP
              community. Built with precision, powered by integrity.
            </p>
          </div>

          {/* Metric Tags */}
          <div className="flex gap-8 pt-4">
            <div>
              <p className="text-xl font-bold text-[#2D1B13]">99.9%</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">
                Reliability
              </p>
            </div>
            <div className="w-[1px] h-10 bg-gray-200" />
            <div>
              <p className="text-xl font-bold text-[#2D1B13]">256-bit</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">
                Security
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE: LOGIN CARD */}
        <section className="w-full max-w-xl  mt-7 mb-7 lg:mt-2 lg:mb-2">
          <div className="relative group">
            {/* Card glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FF4324]/30 to-[#520000]/10 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

            <div className="relative bg-white/40 backdrop-blur-2xl rounded-[4rem] border border-white/50 p-10 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] transition-all duration-700">
              <Link
                to="/"
                className="block mb-6 hover:scale-105 transition-transform"
              >
                <img
                  src={BALIKLogo}
                  className="h-24 mx-auto drop-shadow-md"
                  alt="BALIK Logo"
                />
              </Link>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-[#520000] tracking-tight">
                  Portal Access
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Institutional authentication required
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-[10px] text-center font-bold uppercase tracking-widest">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="group/input">
                  <label className="text-[13px] lg:text-[10px] font-black text-[#B0570C] uppercase tracking-widest ml-2">
                    University Webmail
                  </label>
                  <input
                    type="email"
                    autoFocus
                    className="w-full bg-white/50 border border-gray-200/50 rounded-2xl px-6 py-4 text-[#520000] placeholder-gray-400 focus:bg-white focus:ring-4 focus:ring-[#B0570C]/5 focus:border-[#B0570C]/30 outline-none transition-all shadow-sm"
                    value={form.identifier}
                    onChange={(e) =>
                      setForm({ ...form, identifier: e.target.value })
                    }
                  />
                  {errors.identifier && (
                    <p className="text-red-400 text-[10px] mt-1 ml-4 uppercase font-bold">
                      {errors.identifier}
                    </p>
                  )}
                </div>

                <div className="group/input">
                  <label className="text-[13px] lg:text-[10px] font-black text-[#B0570C] uppercase tracking-widest ml-2">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full bg-white/50 border border-gray-200/50 rounded-2xl px-6 py-4 text-[#520000] placeholder-gray-400 focus:bg-white focus:ring-4 focus:ring-[#B0570C]/5 focus:border-[#B0570C]/30 outline-none transition-all shadow-sm"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                  {errors.password && (
                    <p className="text-red-400 text-[10px] mt-1 ml-4 uppercase font-bold">
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer w-full bg-[#520000] text-white py-4 rounded-2xl font-bold tracking-wide text-md hover:bg-[#3d0000] hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
                >
                  {loading ? "Authenticating..." : "Sign In"}
                </button>

                <div className="flex items-center justify-between px-2 py-1 text-xs lg:text-sm">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-500 font-medium select-none group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded-md border-gray-300 text-[#520000] focus:ring-[#B0570C]/30 accent-[#520000] cursor-pointer"
                      checked={form.rememberMe}
                      onChange={(e) =>
                        setForm({ ...form, rememberMe: e.target.checked })
                      }
                    />
                    <span className="group-hover:text-[#520000] transition-colors">
                      Remember me
                    </span>
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-[#B0570C] font-semibold hover:text-[#520000] hover:underline transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </form>

              <div className="my-8 flex items-center gap-4">
                <div className="flex-1 h-[1px] bg-yellow-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-500">
                  SSO
                </span>
                <div className="flex-1 h-[1px] bg-yellow-500" />
              </div>

              <button
                type="button"
                onClick={handlePUPLogin}
                disabled={loading}
                className="cursor-pointer w-full bg-white border border-gray-200 py-3.5 rounded-2xl font-bold text-gray-700 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                  alt=""
                  className="w-4"
                />
                University Webmail
              </button>

              <div className="mt-8 text-center">
                <Link
                  to="/signup"
                  className="text-xs text-gray-500 font-medium transition-colors"
                >
                  New to BALIK?{" "}
                  <span className="text-[#B0570C] font-bold hover:text-[#520000] ml-1">
                    Create your account
                  </span>
                </Link>
              </div>
              <p className="mt-6 text-center text-xs text-gray-500 font-medium">
                By signing up, you agree to our
                <Link
                  to="/terms-of-service"
                  target="_blank"
                  className="text-gray-600 font-black hover:text-[#520000] hover:underline ml-1"
                >
                  Terms of Service
                </Link>{" "}
                and
                <Link
                  to="/privacy-policy"
                  target="_blank"
                  className="text-gray-600 font-black hover:text-[#520000] hover:underline ml-1"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="absolute bottom-10 left-10 opacity-20 pointer-events-none">
        <p className="text-[10px] font-black tracking-[0.5em] text-[#520000] uppercase">
          Polytechnic University of the Philippines
        </p>
      </div>
    </main>
  );
}