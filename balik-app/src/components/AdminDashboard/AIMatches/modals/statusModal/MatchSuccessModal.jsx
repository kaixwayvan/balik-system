import { CheckCircle, X, PartyPopper } from "lucide-react";

export default function MatchSuccessModal({ open, onClose, title, message }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[70]">
      <div className="bg-white w-[450px] rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
        <div className="h-2 bg-green-600 w-full" />
        
        <div className="p-8 flex flex-col items-center text-center">
          {/* SUCCESS ICON */}
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 relative">
             <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-25"></div>
             <CheckCircle className="text-green-600 relative z-10" size={48} />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title || "Action Successful!"}</h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            {message || "The update has been saved successfully."}
          </p>

          <button
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} />
            Great, Got it!
          </button>
        </div>

        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}