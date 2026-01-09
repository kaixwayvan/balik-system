import { useState } from "react";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useGoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../auth/services/authService";
import BALIKLogo from "../../assets/BALIK.png";
import StudentSupportImg from "../../assets/auth-assets/studentsupport.png";

export default function Signup() {
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

  // VALIDATION FUNCTIONS
  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isMobile = (value) => /^(09|\+639)\d{9}$/.test(value);

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        return value ? "" : "Full Name is required.";
      case "email":
        if (!value) return "Email is required.";
        if (!isEmail(value)) return "Enter a valid email.";
        return "";
      case "contact":
        if (!value) return "Contact number is required.";
        if (!isMobile(value)) return "Enter a valid PH mobile number.";
        return "";
      case "password":
        if (!value) return "Password is required.";
        if (value.length < 6) return "Password must be at least 6 characters.";
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
    if (!captchaValue) newErrors.captcha = "Please verify you are not a robot.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // GOOGLE LOGIN
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setError("");
        await loginWithGoogle(tokenResponse.access_token);
      } catch {
        setError("Google signup failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google signup was cancelled."),
  });

  // FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");
      // BACKEND: Replace with actual signup function
      console.log("Signup data:", form, "Captcha:", captchaValue);
    } catch {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // FIELD CHANGE (for errors)
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
    setErrors({ ...errors, [id]: validateField(id, value) });
  };

  return (
    <main className="relative min-h-screen flex flex-col lg:flex-row">
      {/* Background */}
      <div className="absolute z-0 top-1/2 left-0 transform -translate-y-1/2">
        <img
          src={StudentSupportImg}
          alt="BALIK Student Support"
          className="w-auto md:w-[980px] h-auto object-cover opacity-25"
        />
      </div>

      {/* LEFT SIDE */}
      <section className="relative hidden lg:flex w-1/2 h-screen items-center justify-center z-10">
        <div className="relative z-10 max-w-lg px-10 text-left mt-[160px]">
          <h1 className="text-xl font-bold text-red-800 leading-tight font-['Zalando_Sans_Expanded']">
            Welcome to
          </h1>
          <h1 className="text-6xl font-bold text-red-800 leading-tight font-['Zalando_Sans_Expanded']">
            BALIK
          </h1>
          <p className="font-['Lora'] font-bold italic mt-3 text-lg text-yellow-700">
            Belongings Assistance and Lost Item Keeper
          </p>
          <p className="mt-5 text-sm font-semibold text-gray-800 leading-relaxed">
            BALIK is an AI-assisted, gamified Lost and Found management system
            designed to provide a centralized, reliable, and secure way to
            report, track, and reclaim personal belongings within the PUP
            community.
          </p>
        </div>
      </section>

      {/* RIGHT SIDE (Signup Form) */}
      <section className="flex-1 flex items-center justify-center px-6 py-12 z-10">
        <div
          className="w-full max-w-md bg-[#FFFAFA] border border-gray-200 rounded-xl p-8 z-10"
          style={{ boxShadow: "0 10px 15px rgba(0, 0, 0, 0.19)" }}
        >
          <Link to="/">
            <img src={BALIKLogo} className="h-24 mx-auto" alt="BALIK Logo" />
          </Link>

          <h2 className="text-2xl font-semibold text-center text-gray-900 mt-4">
            Create your account
          </h2>
          <p className="mt-1 text-sm text-gray-500 text-center">
            Enter your details to get started
          </p>

          {/* Global Error */}
          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600 text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
            {/* Full Name */}
            <div className="space-y-1">
              <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:outline-none ${
                  errors.fullName ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-600"
                }`}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:outline-none ${
                  errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-600"
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Contact */}
            <div className="space-y-1">
              <label htmlFor="contact" className="text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <input
                id="contact"
                type="text"
                value={form.contact}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:outline-none ${
                  errors.contact ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-600"
                }`}
              />
              {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:outline-none ${
                  errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-600"
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:outline-none ${
                  errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-600"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6LcsPUUsAAAAAB_dTfyEs0LH_itBbNSjetrd9uI7"
                onChange={(value) => {
                  setCaptchaValue(value);
                  setErrors((prev) => ({ ...prev, captcha: "" }));
                }}
              />
              {errors.captcha && <p className="text-red-500 text-xs mt-1">{errors.captcha}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google Signup */}
          <button
            onClick={() => googleLogin()}
            disabled={loading}
            className="w-full border py-2.5 rounded-md font-medium flex items-center justify-center gap-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
          >
            <img
              src="https://www.pngall.com/wp-content/uploads/5/Google-G-Logo-PNG-Image.png"
              alt="Google Logo"
              className="w-5"
            />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </p>

          <p className="mt-4 text-xs text-center text-gray-400">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </section>
    </main>
  );
}
