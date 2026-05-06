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

export default function MatchDetailsModal({ match, open, onClose }) {
  const [activeModal, setActiveModal] = useState(null);

  if (!open || !match) return null;

  const isPending = match.status === "Pending";

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white max-w-4xl w-full rounded-2xl shadow-xl">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 py-5 border-b border-gray-300 pb-3">
          <h2 className="text-xl font-semibold">Match Details</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        <div className="p-6">
          {/* ITEMS */}
          <div className="grid grid-cols-2 gap-6">
            <ItemCard
              title="Lost Item"
              data={{
                item: match.lost,
                category: match.category || "Not Specified",
                email: match.lostEmail,
                date: match.lostDate,
              }}
            />
            <ItemCard
              title="Found Item"
              data={{
                item: match.found,
                category: match.category || "Not Specified",
                email: match.foundEmail,
                date: match.foundDate,
              }}
            />
          </div>

          {/* INFO */}
          <div className="bg-gray-100 rounded-lg shadow-sm p-5 mb-6">
            <h3 className="font-bold text-lg mb-3">Match Information</h3>
            <div className="flex justify-between px-6">
              <div className="flex flex-col items-center justify-center">
                <p className="text-sm text-gray-500">Confidence</p>
                <p className="text-green-600 font-bold">{match.confidence}%</p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-semibold uppercase">{match.status}</p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <p className="text-sm text-gray-500">Date Created</p>
                <p className="font-semibold uppercase">{match.foundDate}</p>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 justify-center">
            {isPending && (
              <>
                <button
                  onClick={() => setActiveModal("approve")}
                  className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
                >
                  <CircleCheck size={16} />
                  Approve Match
                </button>

                <button
                  onClick={() => setActiveModal("reject")}
                  className="cursor-pointer flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
                >
                  <CircleX size={16} />
                  Reject Match
                </button>
              </>
            )}

            <button
              onClick={() => setActiveModal("notify")}
              className="cursor-pointer flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              <BellRing size={16} />
              Notify Owner
            </button>

            <button
              onClick={() => setActiveModal("qr")}
              className="cursor-pointer flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
            >
              <QrCode size={16} />
              Proceed to QR
            </button>
          </div>
        </div>
      </div>

      <ApproveMatchModal
        open={activeModal === "approve"}
        match={match}
        onClose={() => setActiveModal(null)}
      />

      <RejectMatchModal
        open={activeModal === "reject"}
        match={match}
        onClose={() => setActiveModal(null)}
      />

      <NotifyModal
        open={activeModal === "notify"}
        match={match}
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
    { label: "Item Name", value: data.item },
    { label: "Category", value: data.category || "—" },
    { label: "Owner Email", value: data.email },
    {
      label: title === "Lost Item" ? "Date Lost" : "Date Found",
      value: data.date,
    },
  ];

  return (
    <div className="border border-gray-300 shadow-sm rounded-lg p-4 mb-6 space-y-4">
      {/* HEADER */}
      <div className="flex items-center gap-2">
        {title === "Lost Item" ? (
          <SearchAlert size={19} className="text-red-600" />
        ) : (
          <SearchCheck size={19} className="text-green-600" />
        )}
        <h3 className="font-bold">{title}</h3>
      </div>

      {/* FIELDS */}
      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="text-base font-bold">{field.label}</p>
            <p className="font-normal text-gray-600">{field.value || "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
