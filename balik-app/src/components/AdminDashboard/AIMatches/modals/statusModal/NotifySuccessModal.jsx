import { CheckCircle, X } from "lucide-react";

export default function NotifySuccessModal({ open, onClose, email }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60]">
      <div className="bg-white w-[450px] rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
        <div className="h-2 bg-blue-600 w-full" />
        
        <div className="p-8 flex flex-col items-center text-center">
          {/* SUCCESS ICON */}
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle className="text-blue-600" size={48} />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">Notification Sent!</h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            The item owner has been successfully notified. 
            An email has been dispatched to:
            <br />
            <span className="font-semibold text-blue-700 break-all">{email}</span>
          </p>

          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-blue-200"
          >
            Got it, thanks!
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