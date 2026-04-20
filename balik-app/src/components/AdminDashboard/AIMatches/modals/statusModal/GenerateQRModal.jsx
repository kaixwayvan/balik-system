import { ScanQrCode, Info, X } from "lucide-react";

export default function GenerateQRModal({ open, match, onGenerate, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[650px] rounded-xl relative">
        <div className="p-6 pb-6 flex justify-between items-center border-b border-gray-300 pb-3">
          <h2 className="text-xl font-semibold">Generate QR</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        <div className="p-6">
          <div className="bg-orange-50 border border-orange-300 p-6 rounded-lg text-sm mb-4">
            <h3 className="mb-2 flex items-center gap-2 font-bold text-lg text-yellow-700">
              <ScanQrCode size={16} /> QR Verification Process
            </h3>
            <p className="ml-7 mb-2">
              <b className="text-orange-800">Lost Item:</b> {match.lost}
            </p>
            <p className="ml-7 mb-2">
              <b className="text-orange-800">Owner:</b> {match.lostEmail}
            </p>
            <p className="ml-7 mb-2">
              <b className="text-orange-800">Finder:</b> {match.foundEmail}
            </p>
            <p className="ml-7 mb-2">
              <b className="text-orange-800">Confidence:</b> {match.confidence}%
            </p>
          </div>

          <div className="mt-5 bg-blue-50 border border-blue-300 p-5 rounded-lg text-sm">
            <ul className="list-disc ml-5 space-y-1">
              <li>Verify ownership during claim</li>
              <li>Track item handover</li>
              <li>Record successful return</li>
              <li>Awarding points to finder (if registered)</li>
            </ul>
          </div>

          <div className="mt-5 bg-yellow-50 border border-yellow-500 p-4 rounded-lg text-sm mb-4">
            <h3 className="flex items-center gap-2 font-bold text-md text-yellow-800">
              <Info size={16} /> You will be redirected to the QR Verification
              page where you can generate and manage the QR code for this match.
            </h3>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={onGenerate}
              className="cursor-pointer flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg"
            >
              Generate QR
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
