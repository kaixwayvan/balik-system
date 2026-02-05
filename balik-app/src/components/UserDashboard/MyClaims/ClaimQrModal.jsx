import {
  Info,
  X,
  MapPin,
  Calendar,
  Hash,
  Trophy,
  QrCode,
  CheckCircle,
} from "lucide-react";
import QrCode2TwoToneIcon from "@mui/icons-material/QrCode2TwoTone";

export default function ClaimQrModal({ isOpen, onClose, claim }) {
  if (!isOpen || !claim) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-800">Claim QR Code</h2>
          <button onClick={onClose} className="cursor-pointer">
            <X size={15} className="text-gray-500" />
          </button>
        </div>

        {/* QR Section */}
        <div className="p-5">
          <div className="bg-gradient-to-br from-orange-80 via-orange-100 to-orange-200 rounded-xl p-6 text-center">
            <div className="flex-col bg-white w-36 h-36 mx-auto rounded-lg shadow flex items-center justify-center mb-4">
              {/* Replace with real QR */}
              <QrCode2TwoToneIcon sx={{ fontSize: 85 }} />
              <p className="text-xs">QR-CLM001-2024</p>
            </div>

            <p className="font-semibold text-gray-800">
              Show this QR Code at the Booth
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Present this QR code to the staff at <b>ITECH Booth</b> to collect
              your item
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Booth Location: <b>ITECH Building</b>
            </p>
          </div>
        </div>

        {/* Item Preview */}
        <div className="flex items-center justify-center px-5">
          <img
            src={claim.image}
            alt={claim.title}
            className="w-full h-52 object-cover rounded-lg"
          />
        </div>

        {/* Item Info */}
        <div className="p-5">
          <h3 className="font-semibold text-gray-800">{claim.title}</h3>

          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <span>Wallet</span>
            <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
              ITECH Lost and Found Booth
            </span>
          </div>

          <p className="text-sm text-gray-600 mt-2">{claim.description}</p>

          {/* Approved Banner */}
          <div className="flex items-start gap-2 bg-green-100 border border-green-300 rounded-lg p-3 mt-4">
            <CheckCircle className="text-green-600 mt-0.5" size={18} />
            <div className="text-sm text-green-700">
              <b>Claim Approved</b>
              <p>
                Great news! Your claim has been approved. Show your QR code at
                the booth to collect your item.
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
            <InfoBox
              icon={MapPin}
              label="Found Location"
              value="PUP Main - Lagoon"
            />
            <InfoBox
              icon={Calendar}
              label="Date Found"
              value="November 28, 2025"
            />
            <InfoBox
              icon={Calendar}
              label="Date Claimed"
              value="November 29, 2025"
            />
            <InfoBox icon={Hash} label="Claim ID" value="CLM001" />
            <InfoBox
              icon={Trophy}
              label="Points Earned"
              value="+50"
              highlight
            />
            <InfoBox icon={QrCode} label="QR Code" value="QR-CLM001-2025" />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="cursor-pointer flex items-center justify-center gap-1 w-full mt-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
          >
            <X size={11} /> Close
          </button>

          {/* Next Steps */}
          <div className="mt-5 bg-blue-50 border border-blue-300 rounded-lg p-4 text-sm text-blue-700">
            <div className="flex items-center gap-2 mb-2">
              <Info size={14} />
              <p className="font-extrabold">Next Steps:</p>
            </div>
            <ol className="list-decimal pl-6 list-inside space-y-1">
              <li>Save or screenshot your QR code</li>
              <li>Visit the ITECH Booth during office hours</li>
              <li>Show your QR code to the booth staff</li>
              <li>Verify your identity and collect your item</li>
              <li>Points will be automatically added to your account</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ icon: Icon, label, value, highlight }) {
  return (
    <div
      className={`rounded-lg p-3 border text-xs ${
        highlight
          ? "bg-yellow-50 border-yellow-300 text-yellow-700"
          : "bg-gray-50 border-gray-200 text-gray-700"
      }`}
    >
      <div className="flex items-center gap-1 mb-3">
        {Icon && <Icon size={12} />}
        <span className="font-semibold">{label}</span>
      </div>
      <p className="font-bold">{value}</p>
    </div>
  );
}
