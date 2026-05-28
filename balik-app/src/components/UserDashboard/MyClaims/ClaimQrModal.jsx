import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  CheckCircle,
  QrCode,
  Download,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ClaimQrModal({ isOpen, onClose, claim }) {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen || !claim || !mounted) return null;

  const matchDetailsUrl = `${window.location.origin}/claim-match/${claim.id}`;
  const qrPayload = encodeURIComponent(matchDetailsUrl);

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `https://api.qrserver.com/v1/create-qr-code/?size=1200x1200&data=${qrPayload}`,
      );

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;

      link.download = `BALIK | claim-qr-${
        claim.claimId || claim.id.substring(0, 8)
      }.png`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-md">
      {/* Background */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 w-full max-w-[370px] sm:max-w-[400px] rounded-[2rem] overflow-hidden bg-white shadow-[0_25px_90px_rgba(15,23,42,0.45)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.05 }}
              className="p-2 rounded-2xl bg-blue-50 text-blue-600 shadow-sm"
            >
              <QrCode size={18} />
            </motion.div>

            <div>
              <h2 className="font-black text-slate-900 text-base sm:text-lg tracking-tight">
                Security Pass
              </h2>

              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Secure QR Verification
              </p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="cursor-pointer p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </motion.button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-3 max-h-[82vh] overflow-y-auto custom-scrollbar">
          {/* QR Section */}
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] p-[1px]">
            {/* Background Glows */}
            <div className="absolute -top-16 -left-16 w-40 h-40 bg-cyan-400/20 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-20 -right-16 w-48 h-48 bg-indigo-500/20 blur-3xl rounded-full"></div>

            {/* Inner */}
            <div className="relative rounded-[2rem] border border-white/10 bg-white/10 backdrop-blur-2xl p-4">
              {/* Top Badge */}
              <div className="flex items-center justify-center gap-1.5 mb-3">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-slate-200">
                  Verification Pass
                </span>
              </div>

              {/* QR */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.25 }}
                className="relative mx-auto w-[145px] h-[145px] sm:w-[180px] sm:h-[180px]"
              >
                {/* Glow */}
                <div className="absolute inset-0 rounded-[1.8rem] bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 blur-lg opacity-40"></div>

                {/* QR Box */}
                <div className="relative h-full w-full rounded-[1.8rem] bg-white p-3 border border-slate-200 shadow-2xl flex items-center justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrPayload}`}
                    alt="Claim verification QR code"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              </motion.div>

              {/* ID */}
              <div className="flex justify-center mt-3">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10"
                >
                  <p className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-slate-200">
                    ID:{" "}
                    {claim.claimId || claim.id.substring(0, 8).toUpperCase()}
                  </p>
                </motion.div>
              </div>

              {/* Description */}
              <p className="text-center text-[11px] sm:text-xs text-slate-300 leading-relaxed mt-3">
                Present this QR code for fast and secure item verification.
              </p>

              {/* Actions */}
              <div className="flex items-center justify-center mt-4">
                {/* Save Button */}
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ y: -2 }}
                  onClick={handleDownload}
                  className="cursor-pointer flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-2.5 text-xs font-black text-white shadow-lg"
                >
                  <Download size={14} />
                  Save QR
                </motion.button>
              </div>

              {/* Steps */}
              {/* Divider */}
              <div className="flex items-center gap-2 my-4">
                <div className="flex-1 h-px bg-white/10"></div>

                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                  How to Use
                </span>

                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              {/* Detailed Guide */}
              <div className="space-y-2.5">
                {/* Step 1 */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-3 transition-all duration-300 hover:bg-white/10"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 shrink-0 rounded-xl bg-cyan-400/15 text-cyan-300 flex items-center justify-center text-xs font-black shadow-inner">
                      1
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                        Save Your QR Code
                      </h4>

                      <p className="text-[10px] sm:text-[11px] leading-relaxed text-slate-300 mt-1">
                        Download or screenshot your QR pass.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-3 transition-all duration-300 hover:bg-white/10"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 shrink-0 rounded-xl bg-indigo-400/15 text-indigo-300 flex items-center justify-center text-xs font-black shadow-inner">
                      2
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                        Show to Staff
                      </h4>

                      <p className="text-[10px] sm:text-[11px] leading-relaxed text-slate-300 mt-1">
                        Present the QR code for verification.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Step 3 */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-3 transition-all duration-300 hover:bg-white/10"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 shrink-0 rounded-xl bg-emerald-400/15 text-emerald-300 flex items-center justify-center text-xs font-black shadow-inner">
                      3
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                        Claim Your Item
                      </h4>

                      <p className="text-[10px] sm:text-[11px] leading-relaxed text-slate-300 mt-1">
                        Staff will confirm and release your item.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Item Card */}
          <motion.div
            whileHover={{ y: -2 }}
            className="flex gap-3 items-center rounded-3xl border border-slate-100 bg-white shadow-sm p-3"
          >
            <img
              src={claim.image}
              alt={claim.title}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shrink-0 border border-slate-100"
            />

            <div className="min-w-0 flex-1">
              <span className="inline-block mb-1 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 rounded-xl">
                Verified Match
              </span>

              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight truncate">
                {claim.title}
              </h3>

              <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                {claim.category}
              </p>
            </div>
          </motion.div>

          {/* Status */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-3xl p-3.5"
          >
            <CheckCircle
              className="text-emerald-600 shrink-0 mt-0.5"
              size={17}
            />

            <p className="text-xs font-medium text-emerald-800 leading-relaxed">
              <strong className="font-black block mb-0.5">
                Claim Approved.
              </strong>
              Present this QR code to the assigned administrator.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}