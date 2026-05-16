import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useMsal } from "@azure/msal-react";
import { loginWithMicrosoft } from "../auth/services/authService";

import BALIKLogo from "../../assets/BALIK.png";
import StudentSupportImg from "../../assets/auth-assets/studentsupport.png";

export default function Signup() {
  useEffect(() => {
    document.title = "Create Account - BALIK";
  }, []);

  const { instance } = useMsal();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [captchaValue, setCaptchaValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isMobile = (value) => /^(09|\+639)\d{9}$/.test(value);

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        return value ? "" : "Full Name is required.";
      case "email":
        if (!value) return "Email is required.";
        if (!isEmail(value)) return "Enter a valid email.";
        if (!value.endsWith("@iskolarngbayan.pup.edu.ph"))
          return "Must be @iskolarngbayan.pup.edu.ph";
        return "";
      case "contact":
        if (!value) return "Contact is required.";
        if (!isMobile(value)) return "Enter a valid PH mobile number.";
        return "";
      case "password":
        if (!value) return "Password is required.";

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!passwordRegex.test(value)) {
          return "Requirements not met.";
        }

        return "";

      case "confirmPassword":
        if (!value) return "Confirm your password.";
        if (value !== form.password) return "Passwords do not match.";
        return "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    for (const field in form) {
      const errorMsg = validateField(field, form[field]);
      if (errorMsg) newErrors[field] = errorMsg;
    }
    if (!captchaValue) newErrors.captcha = "Verify you are human.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePUPSignup = async () => {
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
      console.log("Signup data:", form); // backend
    } catch {
      setError("Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
    setErrors({ ...errors, [id]: validateField(id, value) });
  };

  // background colors

  const [colors, setColors] = useState([
    "#FDF4F0",
    "#FFE8D6",
    "#FAF7F5",
    "#E9D5CA",
    "#F5E3D6",
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setColors((prevColors) => {
        const newColors = [...prevColors];
        const lastColor = newColors.pop();
        newColors.unshift(lastColor);
        return newColors;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden selection:bg-[#520000] selection:text-white">
      <div className="absolute inset-0 z-0">
        {/* Base Mesh Gradient */}
        <div
          className="absolute inset-0 opacity-80 transition-all duration-1000 ease-in-out"
          style={{
            background: `
          radial-gradient(circle at 20% 20%, ${colors[0]} 0%, transparent 40%),
          radial-gradient(circle at 80% 0%, ${colors[1]} 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, ${colors[2]} 0%, transparent 100%),
          radial-gradient(circle at 10% 90%, ${colors[3]} 0%, transparent 40%),
          radial-gradient(circle at 90% 90%, ${colors[4]} 0%, transparent 40%)
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
          className="absolute top-[25%] left-[10%] w-40 h-40 md:w-72 md:h-72 
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

        {/* Gold Highlights */}
        <div className="absolute top-1/4 left-1/3 w-1 h-32 bg-gradient-to-b from-transparent via-[#B0570C]/20 to-transparent blur-sm" />
      </div>

      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10 py-12">
        {/* LEFT SIDE: BRANDING */}
        <section className="hidden lg:block w-1/2 text-left space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-12 bg-[#B0570C]" />
              <span className="text-xs font-bold tracking-[0.4em] text-[#B0570C] uppercase">
                Onboarding Gateway
              </span>
            </div>
            <h1 className="text-8xl font-black text-[#520000] leading-none tracking-tighter font-['Zalando_Sans_Expanded']">
              BALIK<span className="text-[#B0570C]"></span>
            </h1>
          </div>

          <div className="space-y-6">
            <p className="text-3xl font-light text-[#520000]/70 font-serif italic">
              "Join the network, <br />
              <span className="text-[#2D1B13] font-bold not-italic">
                reconnect what is lost.
              </span>
              "
            </p>
            <p className="max-w-sm text-sm text-gray-500 font-medium leading-relaxed tracking-wide">
              Establish your verified community profile within PUP's premium
              lost and found ecosystem. Built for transparency, powered by
              integrity.
            </p>
          </div>

          {/* Luxury Metric Tags */}
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

        {/* Right Side: Signup Card */}
        <section className="w-full max-w-xl">
          <div className="bg-white/20 backdrop-blur rounded-[3rem] border border-white/30 p-8 shadow-2xl">
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
              <h2 className="text-3xl lg:text-2xl font-black text-[#520000] tracking-tight">
                Get Started
              </h2>
              <p className="text-gray-500 text-md lg:text-sm mt-1">
                Enter your details to get started
              </p>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-white text-[10px] text-center font-bold uppercase tracking-widest leading-tight">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
              noValidate
            >
              <div className="space-y-1 md:col-span-2">
                <label className="text-[13px] lg:text-[10px] font-black text-[#B0570C] uppercase tracking-widest ml-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoFocus
                  className="w-full bg-white/50 border border-gray-200/50 rounded-2xl px-6 py-4 text-[#520000] placeholder-gray-400 focus:bg-white focus:ring-4 focus:ring-[#B0570C]/5 focus:border-[#B0570C]/30 outline-none transition-all shadow-sm"
                  value={form.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && (
                  <p className="text-red-400 text-[9px] mt-1 ml-4 uppercase font-bold">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[13px] lg:text-[10px] font-black text-[#B0570C] uppercase tracking-widest ml-2">
                  University Webmail
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full bg-white/50 border border-gray-200/50 rounded-2xl px-6 py-4 text-[#520000] placeholder:text-xs placeholder-gray-400 focus:bg-white focus:ring-4 focus:ring-[#B0570C]/5 focus:border-[#B0570C]/30 outline-none transition-all shadow-sm"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-400 text-[9px] mt-1 ml-4 uppercase font-bold">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[13px] lg:text-[10px] font-black text-[#B0570C] uppercase tracking-widest ml-2">
                  Contact Number
                </label>
                <input
                  id="contact"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  className="w-full bg-white/50 border border-gray-200/50 rounded-2xl px-6 py-4 text-[#520000] placeholder-gray-400 focus:bg-white focus:ring-4 focus:ring-[#B0570C]/5 focus:border-[#B0570C]/30 outline-none transition-all shadow-sm"
                  value={form.contact}
                  onChange={handleChange}
                />
                {errors.contact && (
                  <p className="text-red-400 text-[9px] mt-1 ml-4 uppercase font-bold">
                    {errors.contact}
                  </p>
                )}
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[13px] lg:text-[10px] font-black text-[#B0570C] uppercase tracking-widest ml-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full bg-white/50 border border-gray-200/50 rounded-2xl px-6 py-4 text-[#520000] placeholder-gray-400 focus:bg-white focus:ring-4 focus:ring-[#B0570C]/5 focus:border-[#B0570C]/30 outline-none transition-all shadow-sm"
                  value={form.password}
                  onChange={handleChange}
                />
                <p className="text-[11px] text-[#520000]/40 font-semibold ml-2">
                  Must contain at least 8 characters, 1 uppercase letter, and 1
                  number.
                </p>
                {errors.password && (
                  <p className="text-red-400 text-[9px] mt-1 ml-4 uppercase font-bold">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-1 md:col-span-2 mb-2">
                <label className="text-[13px] lg:text-[10px] font-black text-[#B0570C] uppercase tracking-widest ml-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="w-full bg-white/50 border border-gray-200/50 rounded-2xl px-6 py-4 text-[#520000] placeholder-gray-400 focus:bg-white focus:ring-4 focus:ring-[#B0570C]/5 focus:border-[#B0570C]/30 outline-none transition-all shadow-sm"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-[9px] mt-1 ml-4 uppercase font-bold">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 flex flex-col items-center gap-2">
                <ReCAPTCHA
                  theme="light"
                  size="normal"
                  sitekey="6LcsPUUsAAAAAB_dTfyEs0LH_itBbNSjetrd9uI7"
                  onChange={(val) => setCaptchaValue(val)}
                  className="scale-90 origin-center"
                />
                {errors.captcha && (
                  <p className="text-red-400 text-[10px] font-bold uppercase">
                    {errors.captcha}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer w-full mb-4 bg-[#520000] text-white py-4 rounded-2xl font-bold tracking-wide text-md hover:bg-[#3d0000] hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
                >
                  {loading ? "Processing..." : "Create Account"}
                </button>
              </div>
            </form>

            <div className="my-6 flex items-center gap-4 mb-8 text-white/20">
              <div className="flex-1 h-[1px] bg-yellow-500" />
              <span className="text-[13px] lg:text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-500">
                or Quick Signup
              </span>
              <div className="flex-1 h-[1px] bg-yellow-500" />
            </div>

            <button
              type="button"
              onClick={handlePUPSignup}
              disabled={loading}
              className="cursor-pointer w-full bg-white border border-gray-200 py-3.5 rounded-2xl font-bold text-gray-700 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                alt=""
                className="w-5"
              />
              University Webmail
            </button>

            <p className="mt-6 text-center text-sm text-gray-500 font-medium">
              Already a member?{" "}
              <Link
                to="/login"
                className="text-[#B0570C] font-black hover:text-[#520000] hover:underline ml-1"
              >
                Login
              </Link>
            </p>

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
        </section>
      </div>
    </main>
  );
}