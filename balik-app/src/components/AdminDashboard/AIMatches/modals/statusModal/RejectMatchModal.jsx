import { useState } from "react";
import { MailPlus, Info, X } from "lucide-react";

export default function NotifyModal({ open, match, onSend, onClose }) {
  const [message, setMessage] = useState("");

  if (!open) return null;

  const handleChange = (e) => {
    if (e.target.value.length <= 500) {
      setMessage(e.target.value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[650px] rounded-xl relative">
        <div className="p-6 pb-6 flex justify-between items-center border-b border-gray-300 pb-3">
          <h2 className="text-xl font-semibold">Reject Match</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        <div className="p-6">
          <div className="bg-red-50 border border-red-300 p-6 rounded-lg text-sm mb-4">
            <h3 className="mb-2 flex items-center gap-2 font-bold text-lg text-red-800">
              <MailPlus size={16} /> Confirm Match Rejection
            </h3>
            <p className="ml-7 mt- font-medium italic text-sm text-red-500">
              You are about to reject this match:
            </p>

            <p className="mt-3 mb-2 ml-7">
              <b className="text-red-800">Sending to:</b> {match.lostEmail}
            </p>
            <p className="ml-7">
              <b className="text-red-800">Lost Item:</b> {match.lost}
            </p>
          </div>

          <h3 className="font-bold text-lg">Reason for Rejection: </h3>

          <textarea
            className="w-full mt-2 border rounded-lg p-3 h-40 placeholder:italic placeholder:text-gray-400"
            placeholder="Please provide a reason for rejecting this match..."
            value={message}
            onChange={handleChange}
          />

          <p className="text-xs text-gray-500 mb-3 text-right">
            {message.length}/500 characters
          </p>

          <div className="bg-yellow-50 border border-yellow-500 p-4 rounded-lg text-sm mb-4">
            <h3 className="flex items-center gap-2 font-bold text-md text-yellow-800">
              <Info size={13} /> This notification will be sent via email to the
              item owner.
            </h3>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => onSend(message)}
              className="cursor-pointer flex-1 bg-red-600 hover:bg-red-800 text-white py-3 rounded-lg"
            >
              Confirm Rejection
            </button>

            <button
              onClick={onClose}
              className="cursor-pointer flex-1 bg-gray-300 hover:bg-gray-200 py-3 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
