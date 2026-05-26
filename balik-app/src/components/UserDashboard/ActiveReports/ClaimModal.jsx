import { createPortal } from "react-dom";
import { X, AlertCircle } from "lucide-react";

export default function ClaimModal({
  showClaim,
  setShowClaim,
  form,
  setForm,
  errors,
  setErrors,
  itemId,
}) {
  if (!showClaim) return null;

  // Clear specific error when user types
  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};
    
    // Validation for important required fields
    if (!form.itemType?.trim()) newErrors.itemType = "Item type is required.";
    if (!form.colorMaterial?.trim()) newErrors.colorMaterial = "Color/Material is required.";
    if (!form.uniqueMarks?.trim()) newErrors.uniqueMarks = "Please provide unique marks to prove ownership.";
    if (!form.lastSeen?.trim()) newErrors.lastSeen = "Last seen details are required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    console.log("Submitting Security Details:", form);
    setShowClaim(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative flex max-h-[95vh] sm:max-h-[90vh] w-full max-w-xl flex-col rounded-[3rem] bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-200">
        
        {/* Textures */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cleanGrid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#000000" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cleanGrid)" />
          </svg>
        </div>

        {/* Header */}
        <div className="relative z-20 flex items-start justify-between border-b border-slate-200/80 bg-white/60 px-6 sm:px-8 py-5 sm:py-6 backdrop-blur-md shrink-0">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 uppercase tracking-normal">
              Security Questions
            </h2>
            <p className="text-xs font-medium text-slate-500 tracking-wider mt-1">
              Verify your ownership of this item
            </p>
            {itemId && (
              <p className="mt-3 inline-block bg-white text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-xl text-[10px] font-bold tracking-widest shadow-sm">
                ID: {itemId.substring(0, 8).toUpperCase()}
              </p>
            )}
          </div>
          <button
            onClick={() => setShowClaim(false)}
            className="cursor-pointer p-2 bg-white hover:bg-slate-50 rounded-full transition-colors border border-slate-200 shadow-sm"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar">
          <div className="px-6 sm:px-8 py-6 space-y-6">
            
            <div className="bg-white border border-blue-100 p-4 rounded-3xl shadow-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                Please provide specific details that only the true owner would know. Fields marked with an asterisk (<span className="text-red-500">*</span>) are required.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Item Type */}
              <div>
                <label className="mb-1.5 block text-[11px] sm:text-xs font-black text-slate-700 uppercase tracking-wider">
                  Item Type <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.itemType}
                  onChange={(e) => handleInputChange("itemType", e.target.value)}
                  placeholder="e.g., iPhone 13, Wallet"
                  className={`w-full rounded-2xl px-4 py-3 text-sm font-medium transition-all outline-none text-slate-900 shadow-sm ${
                    errors.itemType 
                      ? "bg-red-50 border-2 border-red-400 focus:ring-4 focus:ring-red-400/20" 
                      : "bg-white border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  }`}
                />
                {errors.itemType && <p className="text-red-500 text-[11px] font-bold mt-1.5">{errors.itemType}</p>}
              </div>

              {/* Color */}
              <div>
                <label className="mb-1.5 block text-[11px] sm:text-xs font-black text-slate-700 uppercase tracking-wider">
                  Color / Material <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.colorMaterial}
                  onChange={(e) => handleInputChange("colorMaterial", e.target.value)}
                  placeholder="e.g., Black Leather"
                  className={`w-full rounded-2xl px-4 py-3 text-sm font-medium transition-all outline-none text-slate-900 shadow-sm ${
                    errors.colorMaterial 
                      ? "bg-red-50 border-2 border-red-400 focus:ring-4 focus:ring-red-400/20" 
                      : "bg-white border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  }`}
                />
                {errors.colorMaterial && <p className="text-red-500 text-[11px] font-bold mt-1.5">{errors.colorMaterial}</p>}
              </div>

              {/* Unique Marks */}
              <div className="col-span-1 sm:col-span-2">
                <label className="mb-1.5 block text-[11px] sm:text-xs font-black text-slate-700 uppercase tracking-wider">
                  Unique Marks / Features <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.uniqueMarks}
                  onChange={(e) => handleInputChange("uniqueMarks", e.target.value)}
                  placeholder="e.g., Scratch on bottom left"
                  className={`w-full rounded-2xl px-4 py-3 text-sm font-medium transition-all outline-none text-slate-900 shadow-sm ${
                    errors.uniqueMarks 
                      ? "bg-red-50 border-2 border-red-400 focus:ring-4 focus:ring-red-400/20" 
                      : "bg-white border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  }`}
                />
                {errors.uniqueMarks && <p className="text-red-500 text-[11px] font-bold mt-1.5">{errors.uniqueMarks}</p>}
              </div>

              {/* Brand / Logo */}
              <div className="col-span-1 sm:col-span-2">
                <label className="mb-1.5 block text-[11px] sm:text-xs font-black text-slate-700 uppercase tracking-wider">
                  Brand / Logo <span className="text-slate-400 lowercase tracking-normal font-semibold">(Optional)</span>
                </label>
                <input
                  value={form.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  placeholder="e.g., Apple, Samsonite"
                  className="w-full rounded-2xl bg-white border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 px-4 py-3 text-sm font-medium transition-all outline-none text-slate-900 shadow-sm"
                />
              </div>

              {/* Inside Contents */}
              <div className="col-span-1 sm:col-span-2">
                <label className="mb-1.5 block text-[11px] sm:text-xs font-black text-slate-700 uppercase tracking-wider">
                  Inside Contents <span className="text-slate-400 lowercase tracking-normal font-semibold">(Optional)</span>
                </label>
                <input
                  value={form.insideItems}
                  onChange={(e) => handleInputChange("insideItems", e.target.value)}
                  placeholder="What is inside?"
                  className="w-full rounded-2xl bg-white border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 px-4 py-3 text-sm font-medium transition-all outline-none text-slate-900 shadow-sm"
                />
              </div>

              {/* Last Seen Details */}
              <div className="col-span-1 sm:col-span-2">
                <label className="mb-1.5 block text-[11px] sm:text-xs font-black text-slate-700 uppercase tracking-wider">
                  Last Seen Details <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.lastSeen}
                  onChange={(e) => handleInputChange("lastSeen", e.target.value)}
                  placeholder="Where did you last have it?"
                  className={`w-full rounded-2xl px-4 py-3 text-sm font-medium transition-all outline-none text-slate-900 shadow-sm ${
                    errors.lastSeen 
                      ? "bg-red-50 border-2 border-red-400 focus:ring-4 focus:ring-red-400/20" 
                      : "bg-white border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  }`}
                />
                {errors.lastSeen && <p className="text-red-500 text-[11px] font-bold mt-1.5">{errors.lastSeen}</p>}
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-20 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 border-t border-slate-200/80 bg-white/60 px-6 sm:px-8 py-5 backdrop-blur-md shrink-0">
          <button
            onClick={() => setShowClaim(false)}
            className="cursor-pointer w-full sm:flex-1 rounded-3xl border-2 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 py-3.5 text-sm font-black uppercase tracking-widest transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="cursor-pointer w-full sm:flex-1 rounded-3xl bg-blue-600 hover:bg-blue-700 border border-blue-600 hover:border-blue-700 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-600/20 uppercase tracking-widest transition-all hover:-translate-y-0.5 active:scale-95"
          >
            Submit Claim
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}