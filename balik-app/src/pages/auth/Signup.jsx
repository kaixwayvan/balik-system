import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useGoogleLogin } from "@react-oauth/google";
import { signupWithEmail, loginWithGoogleSupabase } from "../auth/services/supabaseAuthService";
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  // VALIDATION FUNCTIONS
  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isPUPEmail = (value) => /^[^\s@]+@iskolarngbayan\.pup\.edu\.ph$/i.test(value);
  const isMobile = (value) => /^(09|\+639)\d{9}$/.test(value);

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        return value ? "" : "Full Name is required.";
      case "email":
        if (!value) return "Email is required.";
        if (!isEmail(value)) return "Enter a valid email.";
        if (!isPUPEmail(value)) return "Please use your PUP email (@iskolarngbayan.pup.edu.ph).";
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
    onSuccess: async () => {
      try {
        setLoading(true);
        setError("");
        const result = await loginWithGoogleSupabase();
        if (!result.success) throw new Error(result.error);
      } catch (err) {
        setError(err.message || "Google signup failed. Please try again.");
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

      const result = await signupWithEmail(form.email, form.password, form.fullName, form.contact);

      if (result.success) {
        setShowSuccess(true);
      } else {
        setError(result.error || "Signup failed. Please try again.");
      }
    } catch (err) {
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

  const toggleShowPassword = () => setShowPassword((s) => !s);
  const toggleShowConfirmPassword = () => setShowConfirmPassword((s) => !s);

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
                className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:outline-none ${errors.fullName ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-600"
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
                className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:outline-none ${errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-600"
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
                className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:outline-none ${errors.contact ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-600"
                  }`}
              />
              {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full pr-10 border rounded-md px-3 py-2 focus:ring-2 focus:outline-none ${errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-600"
                    }`}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5 0-9-3.5-10-8 1.03-2.76 3.1-4.97 5.56-6.33M6.1 6.1L18 18" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pr-10 border rounded-md px-3 py-2 focus:ring-2 focus:outline-none ${errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-600"
                    }`}
                />
                <button
                  type="button"
                  onClick={toggleShowConfirmPassword}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5 0-9-3.5-10-8 1.03-2.76 3.1-4.97 5.56-6.33M6.1 6.1L18 18" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
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
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-30" onClick={() => setShowSuccess(false)} />
          <div className="relative bg-gradient-to-b from-yellow-100 to-yellow-50 rounded-lg w-11/12 max-w-md p-6 shadow-2xl">
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute right-3 top-3 text-gray-600 hover:text-gray-800 focus:outline-none"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col items-center text-center pt-4">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </div>

              <h3 className="text-xl font-semibold text-gray-800">Account successfully Created</h3>
              <p className="text-sm text-gray-600 mt-2">Please check your email to verify your account before logging in.</p>

              <button
                onClick={() => navigate('/login')}
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 focus:outline-none"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
