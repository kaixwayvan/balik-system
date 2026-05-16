import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import BALIKLogo from "../../assets/BALIK.png";

export default function ForgotPassword() {
  useEffect(() => {
    document.title = "Account Recovery - BALIK";
  }, []);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");

  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setFieldError("Email is required.");
    if (!isEmail(email) || !email.endsWith("@iskolarngbayan.pup.edu.ph")) {
      return setFieldError(
        "Must be a valid @iskolarngbayan.pup.edu.ph webmail.",
      );
    }

    setFieldError("");
    setLoading(true);
    try {
      console.log("Sending 6-digit OTP to:", email);
      // backend API response (simulation)
      setStep(2);
    } catch {
      setError("Failed to send verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus next box
    if (element.value !== "" && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length < 6)
      return setFieldError("Please enter the full 6-digit code.");

    setFieldError("");
    setLoading(true);
    try {
      console.log("Verifying OTP:", fullOtp);
      setStep(3);
    } catch {
      setError("Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordForm.password) {
      return setFieldError("Password is required.");
    }
    if (!passwordRegex.test(passwordForm.password)) {
      return setFieldError(
        "Must contain at least 8 characters, 1 uppercase letter, and 1 number.",
      );
    }
    if (passwordForm.password !== passwordForm.confirmPassword) {
      return setFieldError("Passwords do not match.");
    }

    setFieldError("");
    setLoading(true);
    try {
      console.log("Updating password...");
      setStep(4);
    } catch {
      setError("Password update failed.");
    } finally {
      setLoading(false);
    }
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

        {/* Ambient Glow Orbs */}
        <div
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] animate-pulse"
          style={{ backgroundColor: "rgba(165, 42, 42, 0.08)" }}
        />
        <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-[#B0570C]/10 blur-[130px] animate-bounce duration-[10s]" />

        {/* Glassmorphism Blobs */}
        <div className="absolute top-[20%] right-[15%] w-64 h-64 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl border border-white/20 animate-spin-slow opacity-60" />

        {/* Geometric Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#B0570C]/5 rounded-full shadow-sm pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] border border-[#B0570C]/5 rounded-full shadow-sm pointer-events-none" />

        {/* Precision Rings */}
        <div className="absolute bottom-[5%] right-[7%] w-40 h-40 md:w-72 md:h-72 border-[1px] border-[#B0570C]/20 rounded-full flex items-center justify-center animate-pulse">
          <div className="w-[80%] h-[80%] border-[1px] border-[#B0570C]/10 rounded-full" />
          <div
            className="absolute w-full h-full border-t-2 border-[#B0570C]/5 rounded-full animate-spin"
            style={{ animationDuration: "10s" }}
          />
        </div>
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
        {/* LEFT SIDE: BRANDING STATEMENTS */}
        <section className="hidden lg:block w-1/2 text-left space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-12 bg-[#B0570C]" />
              <span className="text-xs font-bold tracking-[0.4em] text-[#B0570C] uppercase">
                Account Recovery
              </span>
            </div>
            <h1 className="text-8xl font-black text-[#520000] leading-none tracking-tighter font-['Zalando_Sans_Expanded']">
              BALIK<span className="text-[#B0570C]"></span>
            </h1>
          </div>

          <div className="space-y-6">
            <p className="text-3xl font-light text-[#520000]/70 font-serif italic">
              "Restoring connection, <br />
              <span className="text-[#2D1B13] font-bold not-italic">
                safeguarding credentials.
              </span>
              "
            </p>
            <p className="max-w-sm text-sm text-gray-500 font-medium leading-relaxed tracking-wide">
              Initiate an authorization token recovery process to safely restore
              entry privileges to the ecosystem.
            </p>
          </div>
        </section>

        {/* RIGHT SIDE: ACCOUNT RECOVERY CARD */}
        <section className="w-full max-w-md">
          <div className="relative group">
            {/* Card Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FF4324]/20 to-[#520000]/10 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

            <div className="relative bg-white/40 backdrop-blur-2xl rounded-[4rem] border border-white/50 p-10 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)]">
              <Link
                to="/login"
                className="block mb-6 hover:scale-105 transition-transform"
              >
                <img
                  src={BALIKLogo}
                  className="h-24 mx-auto drop-shadow-md"
                  alt="BALIK Logo"
                />
              </Link>

              {/* Header Titles */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-[#520000] tracking-tight">
                  {step === 1 && "Recover Entry"}
                  {step === 2 && "Verification Code"}
                  {step === 3 && "Reset Password"}
                  {step === 4 && "Success"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {step === 1 && "Institutional authorization access"}
                  {step === 2 && `Code dispatched to your webmail`}
                  {step === 3 && "Establish your new security token"}
                  {step === 4 && "Ecosystem entry restored"}
                </p>
              </div>

              {/* Error Status */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-[10px] text-center font-bold uppercase tracking-widest leading-tight">
                  {error}
                </div>
              )}

              {/* --- STEP 1: INPUT WEBMAIL --- */}
              {step === 1 && (
                <form
                  onSubmit={handleEmailSubmit}
                  className="space-y-6"
                  noValidate
                >
                  <div className="group/input">
                    <label className="text-[13px] lg:text-[10px] font-black text-[#B0570C] uppercase tracking-widest ml-2">
                      University Webmail
                    </label>
                    <input
                      type="email"
                      autoFocus
                      placeholder="Enter your webmail"
                      className="w-full bg-white/50 border border-gray-200/50 rounded-2xl px-6 py-4 text-[#520000] focus:bg-white focus:ring-4 focus:ring-[#B0570C]/5 focus:border-[#B0570C]/30 outline-none transition-all shadow-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {fieldError && (
                      <p className="text-red-400 text-[10px] mt-1 ml-4 uppercase font-bold">
                        {fieldError}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer w-full bg-[#520000] text-white py-4 rounded-2xl font-bold tracking-wide hover:bg-[#3d0000] hover:shadow-md transition-all disabled:opacity-50"
                  >
                    {loading ? "Sending OTP..." : "Send Verification Code"}
                  </button>
                </form>
              )}

              {/* --- STEP 2: INPUT 6-DIGIT OTP --- */}
              {step === 2 && (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div className="flex justify-center gap-2">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        inputMode="numeric"
                        autoFocus={index === 0}
                        className="w-12 h-14 bg-white/50 border border-gray-200/50 rounded-xl text-center text-xl font-bold text-[#520000] focus:bg-white focus:ring-4 focus:ring-[#B0570C]/5 focus:border-[#B0570C]/30 outline-none transition-all shadow-sm"
                        value={data}
                        onChange={(e) => handleOtpChange(e.target, index)}
                        onFocus={(e) => e.target.select()}
                      />
                    ))}
                  </div>
                  {fieldError && (
                    <p className="text-red-400 text-[10px] text-center uppercase font-bold">
                      {fieldError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer w-full bg-[#520000] text-white py-4 rounded-2xl font-bold tracking-wide hover:bg-[#3d0000] hover:shadow-md transition-all"
                  >
                    {loading ? "Verifying..." : "Verify Code"}
                  </button>
                  <p className="text-center text-sm text-gray-500">
                    Didn't get a code?{" "}
                    <span className="text-[#B0570C] font-black cursor-pointer hover:underline">
                      Resend
                    </span>
                  </p>
                </form>
              )}

              {/* --- STEP 3: INPUT NEW PASSWORD --- */}
              {step === 3 && (
                <form
                  onSubmit={handlePasswordSubmit}
                  className="space-y-4"
                  noValidate
                >
                  <div className="group/input">
                    <label className="text-[13px] lg:text-[10px] font-black text-[#B0570C] uppercase tracking-widest ml-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      autoFocus
                      className="w-full bg-white/50 border border-gray-200/50 rounded-2xl px-6 py-4 text-[#520000] focus:bg-white focus:ring-4 focus:ring-[#B0570C]/5 focus:border-[#B0570C]/30 outline-none transition-all shadow-sm"
                      value={passwordForm.password}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          password: e.target.value,
                        })
                      }
                    />
                    <p className="text-[11px] lg:text-[9px] text-[#520000]/40 font-semibold ml-2 mt-2">
                      Must contain at least 8 characters, 1 uppercase letter,
                      and 1 number.
                    </p>
                  </div>
                  <div className="group/input">
                    <label className="text-[13px] lg:text-[10px] font-black text-[#B0570C] uppercase tracking-widest ml-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full bg-white/50 mb-4 border border-gray-200/50 rounded-2xl px-6 py-4 text-[#520000] focus:bg-white focus:ring-4 focus:ring-[#B0570C]/5 focus:border-[#B0570C]/30 outline-none transition-all shadow-sm"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                    {fieldError && (
                      <p className="text-red-400 text-[10px] mt-1 ml-4 uppercase font-bold">
                        {fieldError}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer w-full bg-[#520000] text-white py-4 rounded-2xl font-bold tracking-wide hover:bg-[#3d0000] hover:shadow-md transition-all"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              )}

              {/* --- STEP 4: SUCCESS --- */}
              {step === 4 && (
                <div className="space-y-6 text-center py-2">
                  <div className="p-5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl text-sm font-bold leading-relaxed">
                    Your password has been securely restored. You can now
                    authenticate with your new credentials.
                  </div>
                  <Link
                    to="/login"
                    className="cursor-pointer block w-full text-center bg-[#520000] text-white py-4 rounded-2xl font-bold tracking-wide hover:bg-[#3d0000] hover:shadow-md transition-all shadow-md"
                  >
                    Proceed to Sign In
                  </Link>
                </div>
              )}

              {/* Footer Back navigation link */}
              {step !== 4 && (
                <div className="text-center pt-6 border-t border-yellow-600 mt-6">
                  <Link
                    to="/login"
                    className="text-sm text-gray-500 font-semibold hover:text-[#520000] transition-colors"
                  >
                    <span className="text-[#B0570C] mr-1">←</span> Back to
                    System Access
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="absolute bottom-10 left-10 opacity-20 pointer-events-none hidden md:block">
        <p className="text-[10px] font-black tracking-[0.5em] text-[#520000] uppercase">
          Polytechnic University of the Philippines
        </p>
      </div>
    </main>
  );
}