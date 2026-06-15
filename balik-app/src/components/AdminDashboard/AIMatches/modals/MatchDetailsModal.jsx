import { useState } from "react";
import {
  X,
  SearchAlert,
  SearchCheck,
  CircleCheck,
  CircleX,
  BellRing,
  QrCode,
} from "lucide-react";

import ApproveMatchModal from "./statusModal/ApproveMatchModal";
import RejectMatchModal from "./statusModal/RejectMatchModal";
import NotifyModal from "./statusModal/NotifyModal";
import GenerateQRModal from "./statusModal/GenerateQRModal";

export default function MatchDetailsModal({ match, open, onClose, onConfirmApprove, onConfirmReject, onSendNotification }) {
  const [activeModal, setActiveModal] = useState(null);

  if (!open || !match) return null;

  const isPending = match.status === "Pending";

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-6xl w-full max-h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300 flex-shrink-0">
          <h2 className="text-lg font-semibold">Match Details</h2>
          <X className="cursor-pointer" onClick={onClose} size={20} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Items */}
          <div className="grid grid-cols-2 gap-4">
            <ItemCard
              title="Lost Item"
              data={{
                item: match.lost,
                description: match.lostDescription,
                category: match.lostCategory || match.category || "Not Specified",
                email: match.lostEmail,
                date: match.lostDate,
                imageUrl: match.lostItem?.image_url,
              }}
            />
            <ItemCard
              title="Found Item"
              data={{
                item: match.found,
                description: match.foundDescription,
                category: match.foundCategory || match.category || "Not Specified",
                email: match.foundEmail,
                date: match.foundDate,
                imageUrl: match.foundItem?.image_url,
              }}
            />
          </div>

          {/* Info */}
          <div className="bg-gray-100 rounded-lg shadow-sm p-4">
            <h3 className="font-bold text-sm mb-3">Match Information</h3>
            <div className="flex justify-between px-4 gap-4">
              <div className="flex flex-col items-center justify-center">
                <p className="text-xs text-gray-500">Confidence</p>
                <p className="text-green-600 font-bold text-sm">{match.confidence}%</p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <p className="text-xs text-gray-500">Status</p>
                <p className="font-semibold text-xs uppercase">{match.status}</p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <p className="text-xs text-gray-500">Found Date</p>
                <p className="font-semibold text-xs">{match.foundDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 bg-white px-6 py-4 flex gap-3 justify-center flex-shrink-0 flex-wrap">
          {isPending && (
            <>
              <button
                onClick={() => setActiveModal("approve")}
                className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm"
              >
                <CircleCheck size={14} />
                Approve
              </button>

              <button
                onClick={() => setActiveModal("reject")}
                className="cursor-pointer flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm"
              >
                <CircleX size={14} />
                Reject
              </button>
            </>
          )}

          <button
            onClick={() => setActiveModal("notify")}
            className="cursor-pointer flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm"
          >
            <BellRing size={14} />
            Notify
          </button>

          <button
            onClick={() => setActiveModal("qr")}
            className="cursor-pointer flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm"
          >
            <QrCode size={14} />
            QR Code
          </button>
        </div>
      </div>

      <ApproveMatchModal
        open={activeModal === "approve"}
        match={match}
        onConfirm={onConfirmApprove}
        onClose={() => setActiveModal(null)}
      />

      <RejectMatchModal
        open={activeModal === "reject"}
        match={match}
        onConfirm={onConfirmReject}
        onClose={() => setActiveModal(null)}
      />

      <NotifyModal
        open={activeModal === "notify"}
        match={match}
        onSend={onSendNotification}
        onClose={() => setActiveModal(null)}
      />

      <GenerateQRModal
        open={activeModal === "qr"}
        match={match}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}

function ItemCard({ title, data }) {
  const fields = [
    { label: "Item Name", value: data.item, multiline: false },
    {
      label: "Description",
      value: data.description,
      multiline: true,
    },
    { label: "Category", value: data.category || "—", multiline: false },
    { label: "Owner Email", value: data.email, multiline: false },
    {
      label: title === "Lost Item" ? "Date Lost" : "Date Found",
      value: data.date,
      multiline: false,
    },
  ];

  return (
    <div className="border border-gray-300 shadow-sm rounded-lg p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        {title === "Lost Item" ? (
          <SearchAlert size={19} className="text-red-600" />
        ) : (
          <SearchCheck size={19} className="text-green-600" />
        )}
        <h3 className="font-bold text-sm">{title}</h3>
      </div>

      {/* Image */}
      {data.imageUrl && (
        <div className="w-full">
          <img
            src={data.imageUrl}
            alt={data.item}
            className="w-full h-32 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}

      {/* Field */}
      <div className="space-y-2">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="text-xs font-bold text-gray-700">{field.label}</p>
            <p
              className={`text-xs font-normal text-gray-600 ${
                field.multiline
                  ? "whitespace-pre-line max-h-20 overflow-y-auto"
                  : "truncate"
              }`}
              title={field.value}
            >
              {field.value || "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}