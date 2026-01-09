import { useState } from "react";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import {
  loginWithGoogle,
  loginWithPassword,
} from "../auth/services/authService";
import BALIKLogo from "../../assets/BALIK.png";
import StudentSupportImg from "../../assets/auth-assets/studentsupport.png";

export default function Login() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // VALIDATION FUNCTIONS
  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isMobile = (value) => /^(09|\+639)\d{9}$/.test(value);

  const validateForm = () => {
    const newErrors = {};

    if (!form.identifier) {
      newErrors.identifier = "Email or mobile number is required.";
    } else if (!isEmail(form.identifier) && !isMobile(form.identifier)) {
      newErrors.identifier = "Enter a valid email or PH mobile number.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

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
        setError("Google login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google login was cancelled."),
  });

  // FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");
      await loginWithPassword(form);
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col lg:flex-row">
      {/* Image Background */}
      <div className="absolute z-0 top-1/2 left-0 transform -translate-y-1/2">
        <img
          src={StudentSupportImg}
          alt="BALIK Student Support"
          className="w-full h-auto object-cover opacity-25"
        />
      </div>

      {/* LEFT SIDE */}
      <section className="relative hidden lg:flex w-1/2 h-screen items-center justify-center z-10">
        <div className="relative z-10 max-w-lg px-10 text-left">
          <h1 className="text-xl font-bold text-red-800 leading-tight font-['Zalando_Sans_Expanded']">
            Welcome back to
          </h1>
          <h1 className="text-6xl font-bold text-red-800 leading-tight font-['Zalando_Sans_Expanded']">
            BALIK
          </h1>
          <p className="font-['Lora'] font-bold italic mt-3 text-lg  text-yellow-700">
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

      {/* RIGHT SIDE (LOGIN) */}
      <section className="flex-1 flex items-center justify-center px-6 py-12 z-10 bg-black-900">
        <div
          className="w-full max-w-md bg-[#FFFAFA] border border-gray-200 rounded-xl p-8"
          style={{ boxShadow: "0 10px 15px rgba(0, 0, 0, 0.19)" }}
        >
          {/* Logo */}
          <Link to="/">
            <img src={BALIKLogo} className="h-22 mx-auto" alt="BALIK Logo" />
          </Link>

          <h2 className="text-2xl font-semibold text-center text-gray-900 mt-4">
            Login to your account
          </h2>
          <p className="mt-1 text-sm text-gray-500 text-center">
            Enter your credentials to continue
          </p>

          {/* Global Error */}
          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600 text-center">
              {error}
            </p>
          )}

          {/* Forms */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
            {/* Identifier */}
            <div className="space-y-1">
              <label
                htmlFor="identifier"
                className="text-sm font-medium text-gray-700"
              >
                Mobile number or email
              </label>
              <input
                id="identifier"
                type="text"
                autoComplete="username"
                value={form.identifier}
                aria-invalid={!!errors.identifier}
                onChange={(e) => {
                  setForm({ ...form, identifier: e.target.value });
                  setErrors((prev) => ({
                    ...prev,
                    identifier: !e.target.value
                      ? "Email or mobile number is required."
                      : !isEmail(e.target.value) && !isMobile(e.target.value)
                      ? "Enter a valid email or PH mobile number."
                      : "",
                  }));
                }}
                className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:outline-none ${
                  errors.identifier
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-600"
                }`}
              />
              {errors.identifier && (
                <p className="text-red-500 text-xs mt-1">{errors.identifier}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    setErrors((prev) => ({
                      ...prev,
                      password: !e.target.value
                        ? "Password is required."
                        : e.target.value.length < 6
                        ? "Password must be at least 6 characters."
                        : "",
                    }));
                  }}
                  className={`w-full pr-10 px-3 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-600"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5 0-9-3.5-10-8 1.03-2.76 3.1-4.97 5.56-6.33M6.1 6.1L18 18" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  className="bg-white border-2 border-black rounded accent-blue-500"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google Login */}
          <button
            onClick={googleLogin}
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

          {/* Signup */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Create account
            </Link>
          </p>

          <p className="mt-4 text-xs text-center text-gray-400">
            By logging in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </section>
    </main>
  );
}
