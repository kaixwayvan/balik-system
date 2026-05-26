import { createPortal } from "react-dom";
import { CircleCheckBig, X } from "lucide-react";

export default function ConfirmMatchModal({ onClose, onConfirm }) {
  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in" 
        onClick={onClose} 
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl px-6 sm:px-8 py-8 sm:py-10 z-10 animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-5 right-5 text-gray-400 hover:text-gray-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CircleCheckBig size={32} />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-800 text-center tracking-tight uppercase">
          Does this match?
        </h2>

        <p className="text-sm sm:text-base text-slate-500 font-medium text-center mt-3 leading-relaxed">
          Confirm if the identified item accurately matches the belongings you are looking for.
        </p>

        <div className="mt-8 flex flex-col-reverse sm:flex-row justify-center gap-3 sm:gap-4">
          <button
            onClick={onClose}
            className="cursor-pointer w-full sm:w-auto border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-black text-sm px-6 py-3.5 rounded-3xl uppercase tracking-widest transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer w-full sm:w-auto flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-black text-sm px-8 py-3.5 rounded-3xl shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5 active:scale-95 uppercase tracking-widest"
          >
            Yes, Claim Item
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}