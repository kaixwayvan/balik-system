import {
  X,
  MapPin,
  Calendar,
  Hash,
  QrCode,
  CheckCircle,
  Clock,
  XCircle,
  Tags,
} from "lucide-react";

export default function ClaimDetailsModal({ isOpen, onClose, claim }) {
  if (!isOpen || !claim) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-800">Details</h2>
          <button onClick={onClose} className="cursor-pointer">
            <X size={15} className="text-gray-500" />
          </button>
        </div>

        {/* Image */}
        <div className="flex items-center justify-center mt-5 px-5">
          <img
            src={claim.image}
            alt={claim.title}
            className="w-full h-52 object-cover object-[50%_40%] rounded-lg"
          />
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-gray-800">{claim.title}</h3>

          <div className="flex items-center gap-3 text-gray-500 mt-1">
            <span className="flex items-center gap-1 px-2 py-0.5 font-bold bg-gray-200 rounded-full text-sm"><Tags size={13}/>{claim.category}</span>
            <span className="flex items-center gap-1 px-2 py-0.5 font-bold bg-red-100 text-red-800 rounded-full text-sm"><MapPin size={13} />
              {claim.booth}
            </span>
          </div>

          <p className="text-sm text-gray-600 mt-2">{claim.description}</p>

          {/* Status Banner */}
          <ClaimStatusBanner status={claim.status} />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
            <InfoBox
              icon={MapPin}
              label="Found Location"
              value={claim.foundAt}
            />
            <InfoBox
              icon={Calendar}
              label="Date Found"
              value={claim.dateFound}
            />
            <InfoBox
              icon={Calendar}
              label="Date Claimed"
              value={claim.dateClaimed}
            />
            <InfoBox icon={Hash} label="Claim ID" value={claim.claimId} />
            <InfoBox
              label="Points Earned"
              value={`+${claim.points}`}
              highlight
            />
            <InfoBox icon={QrCode} label="QR Code" value={claim.qrCode} />
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="cursor-pointer flex items-center justify-center gap-1 w-full mt-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
          >
            <X size={11} /> Close
          </button>
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

function ClaimStatusBanner({ status }) {
  if (status === "Approved") {
    return (
      <div className="flex items-start gap-2 bg-green-100 border border-green-300 rounded-lg p-3 mt-4">
        <CheckCircle className="text-green-600" size={20} />

        <div>
          <p className="font-semibold text-green-700">Claim Approved</p>
          <p className="text-sm text-green-700">
            Great news! Your claim has been approved. Show your QR code at the
            booth to collect your item.
          </p>
        </div>
      </div>
    );
  }

  if (status === "Pending") {
    return (
      <div className="flex items-start gap-2 bg-yellow-100 border border-yellow-300 rounded-lg p-3 mt-4">
        <Clock className="text-yellow-600" size={20} />
        <div className="text-sm text-yellow-700">
          <b>Pending Approval</b>
          <p>
            Your claim is currently under review by our admin team. You will be
            notified once it has been processed.
          </p>
        </div>
      </div>
    );
  }

  if (status === "Released") {
    return (
      <div className="flex items-start gap-2 bg-blue-100 border border-blue-300 rounded-lg p-3 mt-4">
        <CheckCircle className="text-blue-600" size={20} />
        <div className="text-sm text-blue-700">
          <b>Item Released</b>
          <p>
            You have successfully collected this item. Points have been added to
            your account.
          </p>
        </div>
      </div>
    );
  }

  if (status === "Rejected") {
    return (
      <div className="flex items-start gap-2 bg-red-100 border border-red-300 rounded-lg p-3 mt-4">
        <XCircle className="text-red-600 mt-0.5" size={18} />
        <div className="text-sm text-red-700">
          <b>Claim Rejected</b>
          <p>
            Unfortunately, your claim could not be verified. Please contact the
            admin for more information.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
