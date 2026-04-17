import { BadgeCheck, X } from "lucide-react";

export default function ApproveMatchModal({ open, match, onConfirm, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[650px] rounded-xl relative">
        <div className="p-6 pb-6 flex justify-between items-center border-b border-gray-300 pb-3">
          <h2 className="text-xl font-semibold">Approve Match</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        <div className="p-6">
          <div className="border border-green-400 bg-green-50 p-5 rounded-lg">
            <h3 className="mb-2 flex items-center gap-2 font-bold text-lg text-green-800">
              <BadgeCheck size={16} /> Confirm Match Approval
            </h3>
            <p className="ml-7 mt-2 font-medium italic text-sm text-green-500">
              You are about to approve this match:
            </p>

            <div className="mt-3 text-sm space-y-1">
              <p className="ml-7">
                <b>Lost Item:</b> {match.lost}
              </p>
              <p className="ml-7">
                <b>Found Item:</b> {match.found}
              </p>
              <p className="ml-7">
                <b>Confidence:</b> {match.confidence}%
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="mt-5 border border-blue-400 bg-blue-50 p-5 rounded-lg text-sm">
            <p className="text-lg font-bold text-blue-800 mb-2">
              What happens next:
            </p>
            <ul className="space-y-1 list-disc ml-5">
              <li>
                Owner <i className="text-gray-600">({match.lostEmail})</i> will
                be notified
              </li>
              <li>
                Status becomes <b className="italic">Approved</b>
              </li>
              <li>QR verification can begin</li>
              <li>Finder may earn points (if registered user)</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={onConfirm}
              className="cursor-pointer flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
            >
              Confirm Approval
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
