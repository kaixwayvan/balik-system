import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  MapPin,
  Calendar,
  QrCode,
  CheckCircle,
  Clock,
  XCircle,
  Tags,
  Info,
  Hash,
  Coins,
} from "lucide-react";

export default function ClaimDetailsModal({ isOpen, onClose, claim }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen || !claim || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm transition-all duration-300">
      {/* Background */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative z-10 max-h-[90vh] sm:max-h-[85vh] animate-in fade-in zoom-in-95 duration-300">
        {/* Absolute Close Button over Image */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 cursor-pointer p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-all shadow-sm"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="overflow-y-auto custom-scrollbar flex-1 pb-6 sm:pb-8">
          {/* Image Header */}
          <div className="relative w-full h-56 sm:h-72 bg-slate-900 shrink-0">
            <img
              src={claim.image}
              alt={claim.title}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>

            {/* Header Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md rounded-full border border-white/30">
                  <Tags size={12} /> {claim.category}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-rose-500/80 text-white backdrop-blur-md rounded-full border border-rose-400/50 shadow-sm">
                  <MapPin size={12} /> {claim.booth || "Admin Booth"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mt-1">
                {claim.title}
              </h2>
            </div>
          </div>

          <div className="px-5 sm:px-8 mt-6 sm:mt-8 space-y-6 sm:space-y-8">
            {/* Description Area */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                Item Description
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-100">
                {claim.description}
              </p>
            </div>

            {/* Status Banner */}
            <ClaimStatusBanner status={claim.status} />

            {/* Meta Info Grid */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                Audit Trail
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <InfoBox
                  icon={MapPin}
                  label="Discovered At"
                  value={claim.foundAt}
                />
                <InfoBox
                  icon={Calendar}
                  label="Date Logged"
                  value={claim.dateFound}
                />
                <InfoBox
                  icon={Calendar}
                  label="Claim Filed"
                  value={claim.dateClaimed}
                />
                <InfoBox icon={Hash} label="Claim ID" value={claim.claimId} />
                
                {/* Luminous Premium styled points box */}
                <InfoBox 
                  icon={Coins} 
                  label="Points Earned" 
                  value={`+${claim.points || 0}`} 
                  variant="points"
                />
                
                <InfoBox
                  icon={QrCode}
                  label="Verification Pass"
                  value={claim.qrCode}
                  highlight
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// Sub-component
function InfoBox({ icon: Icon, label, value, highlight, variant }) {
  // Default styling state
  let boxStyles = "bg-white border-slate-200 text-slate-700 shadow-sm hover:border-slate-300";
  let iconStyles = "text-slate-400";
  let labelStyles = "text-slate-400";
  let valueStyles = "text-slate-900";

  // Highlight styling state
  if (highlight) {
    boxStyles = "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-slate-700/60 text-white shadow-lg shadow-slate-900/40 transform transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/50 hover:border-slate-600";
    iconStyles = "text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.4)]"; 
    labelStyles = "text-slate-400";
    valueStyles = "text-cyan-50 tracking-[0.15em] font-mono font-bold";
  } 
  else if (variant === "points") {
    boxStyles = "bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 border-none text-white shadow-lg shadow-orange-500/20 transform transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/30";
    iconStyles = "text-white drop-shadow-sm opacity-95"; 
    labelStyles = "text-amber-100/90 font-medium";
    valueStyles = "text-white font-black text-base sm:text-lg tracking-wide drop-shadow-sm";
  }

  return (
    <div className={`rounded-4xl p-4 pl-6 sm:p-5 border transition-all duration-300 ${boxStyles}`}>
      <div className={`flex items-center gap-2 mb-2 sm:mb-3 ${labelStyles}`}>
        {Icon && <Icon size={14} className={iconStyles} />}
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className={`font-extrabold text-sm sm:text-base truncate ${valueStyles}`}>
        {value}
      </p>
    </div>
  );
}

// Sub-component for Dynamic Status
function ClaimStatusBanner({ status }) {
  const s = status?.toLowerCase();

  if (s === "approved") {
    return (
      <div className="flex items-start gap-3 sm:gap-4 bg-emerald-50 border border-emerald-200 rounded-4xl p-4 sm:p-5">
        <div className="p-2 bg-emerald-100 rounded-full shrink-0 mt-0.5">
          <CheckCircle className="text-emerald-600" size={20} />
        </div>
        <div>
          <p className="font-extrabold text-emerald-900 text-sm sm:text-base tracking-tight mb-1">
            Claim Approved
          </p>
          <p className="text-xs sm:text-sm text-emerald-700 font-medium leading-relaxed">
            Excellent! Your claim has been verified. Present your QR Security
            Pass at the designated admin booth to collect your property.
          </p>
        </div>
      </div>
    );
  }

  if (s === "pending") {
    return (
      <div className="flex items-start gap-3 sm:gap-4 bg-amber-50 border border-amber-200 rounded-4xl p-4 sm:p-5">
        <div className="p-2 bg-amber-100 rounded-full shrink-0 mt-0.5">
          <Clock className="text-amber-600 animate-pulse" size={20} />
        </div>
        <div>
          <p className="font-extrabold text-amber-900 text-sm sm:text-base tracking-tight mb-1">
            Pending Approval
          </p>
          <p className="text-xs sm:text-sm text-amber-700 font-medium leading-relaxed">
            Your claim is actively under review by our administration team. You
            will be notified via portal alert once verification completes.
          </p>
        </div>
      </div>
    );
  }

  if (s === "released") {
    return (
      <div className="flex items-start gap-3 sm:gap-4 bg-blue-50 border border-blue-200 rounded-4xl p-4 sm:p-5">
        <div className="p-2 bg-blue-100 rounded-full shrink-0 mt-0.5">
          <CheckCircle className="text-blue-600" size={20} />
        </div>
        <div>
          <p className="font-extrabold text-blue-900 text-sm sm:text-base tracking-tight mb-1">
            Asset Released
          </p>
          <p className="text-xs sm:text-sm text-blue-700 font-medium leading-relaxed">
            This item has been successfully collected and signed off from our
            inventory system.
          </p>
        </div>
      </div>
    );
  }

  if (s === "rejected") {
    return (
      <div className="flex items-start gap-3 sm:gap-4 bg-rose-50 border border-rose-200 rounded-4xl p-4 sm:p-5">
        <div className="p-2 bg-rose-100 rounded-full shrink-0 mt-0.5">
          <XCircle className="text-rose-600" size={20} />
        </div>
        <div>
          <p className="font-extrabold text-rose-900 text-sm sm:text-base tracking-tight mb-1">
            Claim Rejected
          </p>
          <p className="text-xs sm:text-sm text-rose-700 font-medium leading-relaxed">
            Unfortunately, your ownership claim could not be verified against
            our records. Please contact administration directly for disputes.
          </p>
        </div>
      </div>
    );
  }

  return null;
}