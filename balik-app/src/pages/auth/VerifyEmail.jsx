import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { verifyOtp, resendOtp } from "../auth/services/authService";
import BALIKLogo from "../../assets/BALIK.png";
import StudentSupportImg from "../../assets/auth-assets/studentsupport.png";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = useRef([]);

  // Redirect if no email passed (direct URL access)
  useEffect(() => {
    if (!email) navigate("/signup");
  }, [email, navigate]);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // --- OTP Input Handlers ---
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const updated = [...otp];
    updated[index] = value.slice(-1); // one char per box
    setOtp(updated);
    setError("");

    // Auto-advance focus
    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
    const updated = [...otp];
    pasted.split("").forEach((char, i) => { updated[i] = char; });
    setOtp(updated);
    inputRefs.current[Math.min(pasted.length, 7)]?.focus();
  };

  // --- Submit OTP ---
  const handleVerify = async (e) => {
    e.preventDefault();
    const token = otp.join("");
    if (token.length < 8) {
      setError("Please enter all 8 digits.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await verifyOtp({ email, token });

      // Supabase profile trigger fires here (email_confirmed_at is set)
      // Redirect to user dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Resend OTP ---
  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    try {
      setResending(true);
      setError("");
      await resendOtp({ email });
      setSuccess("A new code has been sent to your email.");
      setCooldown(60); // 60-second cooldown
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  // Masked email for display
  const maskedEmail = email
    ? email.replace(/^(.{3})(.*)(@.*)$/, (_, a, b, c) => a + "*".repeat(b.length) + c)
    : "";

  return (
    <main className="relative min-h-screen flex flex-col lg:flex-row">
      {/* Background Image */}
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

      {/* RIGHT SIDE — OTP Form */}
      <section className="flex-1 flex items-center justify-center px-6 py-12 z-10">
        <div
          className="w-full max-w-md bg-[#FFFAFA] border border-gray-200 rounded-xl p-8 z-10"
          style={{ boxShadow: "0 10px 15px rgba(0, 0, 0, 0.19)" }}
        >
          {/* Logo */}
          <Link to="/">
            <img src={BALIKLogo} className="h-24 mx-auto" alt="BALIK Logo" />
          </Link>

          <h2 className="text-2xl font-semibold text-center text-gray-900 mt-4">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-gray-500 text-center leading-relaxed">
            We've sent an 8-digit verification code to{" "}
            <span className="font-semibold text-gray-800 break-all">{email}</span>
          </p>

          {/* Alerts */}
          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded-lg py-2 px-3">
              {error}
            </p>
          )}
          {success && (
            <p className="mt-4 text-sm text-green-600 text-center bg-green-50 border border-green-200 rounded-lg py-2 px-3">
              {success}
            </p>
          )}

          {/* OTP Boxes */}
          <form onSubmit={handleVerify} className="mt-8">
            <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`w-9 h-12 text-center text-xl font-bold border-b-2 bg-transparent outline-none transition-colors
                    ${digit ? "border-blue-600 text-gray-900" : "border-gray-300 text-gray-400"}
                    focus:border-blue-600`}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || otp.join("").length < 8}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Verifying...
                </span>
              ) : "Verify & Log In"}
            </button>
          </form>

          {/* Resend + Navigation */}
          <div className="mt-6 flex flex-col items-center gap-3 text-sm text-gray-500">
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || resending}
              className="text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {resending
                ? "Sending..."
                : cooldown > 0
                ? `Resend code in ${cooldown}s`
                : "Resend code"}
            </button>

            <Link to="/signup" className="text-gray-500 hover:text-gray-700 transition-colors">
              ← Back to signup
            </Link>

            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
