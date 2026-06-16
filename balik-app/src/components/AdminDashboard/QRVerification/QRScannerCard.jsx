import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, ScanLine, StopCircle, CheckCircle, AlertCircle, Check, X, Loader, SearchAlert, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- MOCK SERVICES FOR SIMULATION ---
const useAuth = () => ({ user: { id: "admin-123", role: "admin" } });
const gamificationService = {
  awardItemReleasedPoints: async () => console.log("Points awarded"),
  awardClaimReleasedPoints: async () => console.log("Claim points awarded"),
  checkAndRecordAchievements: async () => console.log("Achievements checked")
};
const itemService = { logItemAction: async () => console.log("Action logged") };
const supabase = {
  from: () => ({ select: () => ({ eq: () => ({ limit: () => ({ single: async () => ({ error: "Simulated Error", data: null }) }) }) }) })
};

export default function QRScannerCard() {
  const { user } = useAuth();
  const scannerRef = useRef(null);

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionResult, setActionResult] = useState(null);

  const startScanning = async () => {
    setError(null);
    setScanResult(null);
    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        async (decodedText) => {
          await html5QrCode.stop();
          setIsScanning(false);
          await lookupItem(decodedText);
        },
        () => {}
      );
      setIsScanning(true);
    } catch (err) {
      setError("Camera access denied or unavailable. Please check permissions.");
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    try {
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }
    } catch (_) {}
    setIsScanning(false);
  };

  // Mocked Lookup function
  const lookupItem = async (qrText) => {
    setScanResult({
      status: "claim_match",
      claim: { status: "approved", createdAt: "Oct 24, 2026" },
      lostItem: { name: "MacBook Pro M2", category: "Electronics", owner: "Alex Reyes", location: "Library" },
      foundItem: { name: "MacBook Pro M2", category: "Electronics", owner: "Guest Finder", location: "Library 2F", itemStatus: "approved" }
    });
  };

  const handleReleaseItem = () => {
    setActionLoading(true);
    setTimeout(() => {
      setActionResult({ type: "success", message: "Item securely released! Status updated." });
      setActionLoading(false);
      setTimeout(() => { setScanResult(null); setActionResult(null); }, 2500);
    }, 1000);
  };

  const handleRejectItem = () => {
    setActionLoading(true);
    setTimeout(() => {
      setActionResult({ type: "success", message: "Claim rejected. Item returned to unclaimed pool." });
      setActionLoading(false);
      setTimeout(() => { setScanResult(null); setActionResult(null); }, 2500);
    }, 1000);
  };

  useEffect(() => {
    return () => { if (scannerRef.current) { try { scannerRef.current.stop(); } catch (_) {} } };
  }, []);

  return (
    <div className="bg-white rounded-4xl shadow-sm border border-slate-200/60 p-6 sm:p-8 flex flex-col h-full">
      <div className="mb-5 border-b border-slate-100 pb-4">
        <h3 className="font-black text-2xl text-slate-800 tracking-tight uppercase">Scanner Interface</h3>
        <p className="text-sm font-bold text-slate-500">Scan QR codes to initiate handover.</p>
      </div>

      {/* Scanner */}
      <div className="border-2 border-dashed border-slate-300 rounded-[2rem] overflow-hidden flex flex-col items-center justify-center min-h-[260px] text-slate-400 bg-slate-50 relative mb-6">
        <div id="qr-reader" className="w-full" />
        {!isScanning && !scanResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 py-6">
            <div className="p-4 bg-slate-200/50 rounded-full text-slate-500">
              <ScanLine size={48} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-bold tracking-wide">Awaiting Scanner Activation</p>
          </motion.div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm font-bold text-red-600 mb-6">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Scan Result */}
      <AnimatePresence mode="wait">
        {scanResult && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className={`rounded-2xl p-5 border text-sm space-y-4 mb-6 ${scanResult.status === "found" || scanResult.status === "claim_match" ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}
          >
            {scanResult.status === "claim_match" ? (
              <>
                <div className="flex items-center gap-2 font-black text-emerald-800 text-lg uppercase tracking-tight">
                  <CheckCircle size={20} /> Verified Match Payload
                </div>
                <p className="text-xs font-bold text-emerald-700 bg-emerald-100/50 p-2 rounded-lg inline-block">
                  Status: <span className="uppercase text-emerald-900">{scanResult.claim.status}</span> • Created: {scanResult.claim.createdAt}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div className="p-3.5 bg-white border border-amber-200/60 rounded-xl shadow-sm">
                    <p className="font-black text-amber-800 mb-2 flex items-center gap-1.5 text-xs uppercase"><SearchAlert size={14}/> Lost Item Profile</p>
                    <div className="space-y-1 text-slate-600 text-xs">
                      <p><span className="font-bold text-slate-400">Name:</span> {scanResult.lostItem.name}</p>
                      <p><span className="font-bold text-slate-400">Owner:</span> {scanResult.lostItem.owner}</p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white border border-blue-200/60 rounded-xl shadow-sm">
                    <p className="font-black text-blue-800 mb-2 flex items-center gap-1.5 text-xs uppercase"><Package size={14}/> Found Item Profile</p>
                    <div className="space-y-1 text-slate-600 text-xs">
                      <p><span className="font-bold text-slate-400">Name:</span> {scanResult.foundItem.name}</p>
                      <p><span className="font-bold text-slate-400">Finder:</span> {scanResult.foundItem.owner}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 font-bold text-red-700">
                <AlertCircle size={18} /> Invalid or Unrecognized QR Code
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action */}
      {actionResult && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className={`rounded-xl p-3 border text-sm font-bold flex items-center gap-2 mb-6 ${actionResult.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}>
          {actionResult.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
          {actionResult.message}
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex gap-3 flex-wrap mt-auto">
        {!isScanning ? (
          <button onClick={startScanning} className="cursor-pointer w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-md">
            <Camera size={18} /> Initialize Scanner
          </button>
        ) : (
          <button onClick={stopScanning} className="cursor-pointer w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-md">
            <StopCircle size={18} /> Cancel Scan
          </button>
        )}

        {scanResult && (scanResult.status === "found" || scanResult.status === "claim_match") && !actionLoading && (
          <div className="flex gap-3 w-full">
            <button onClick={handleReleaseItem} className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-md">
              <Check size={18} /> Authorize Release
            </button>
            <button onClick={handleRejectItem} className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-rose-100 hover:bg-rose-200 text-rose-700 px-4 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 border border-rose-200">
              <X size={18} /> Reject Claim
            </button>
          </div>
        )}

        {actionLoading && (
          <button disabled className="cursor-not-allowed w-full flex items-center justify-center gap-2 bg-slate-200 text-slate-500 px-5 py-3 rounded-xl font-bold text-sm">
            <Loader size={18} className="animate-spin" /> Finalizing Database...
          </button>
        )}
      </div>
    </div>
  );
}