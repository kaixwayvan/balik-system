import { CircleCheckBig } from "lucide-react";

export default function ConfirmMatchModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-xl rounded-xl shadow-2xl px-8 py-10 z-10">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Does this description match your lost item?
        </h2>

        <p className="text-sm text-gray-500 text-center mt-3">
          Confirm if the details below accurately match your item.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="cursor-pointer flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-10 py-3 rounded-lg"
          >
            <CircleCheckBig size={15} />
            Claim Item
          </button>
        </div>
      </div>
    </div>
  );
}