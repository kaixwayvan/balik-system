import { useEffect } from "react";
import { X, CircleCheck, Coins, SquaresExclude } from "lucide-react";
import { FiXCircle } from "react-icons/fi";

const statusStyles = {
  Approved: "bg-green-100 text-green-600",
  Matched: "bg-blue-100 text-blue-600",
  Pending: "bg-yellow-100 text-yellow-700",
  Claimed: "bg-gray-200 text-black",
};

const statusButtons = {
  Approved: ["ai", "coin"],
  Matched: ["check", "reject", "coin"],
  Pending: ["check", "reject", "ai", "coin"],
  Claimed: ["coin"],
};

export default function FoundItemDetailsModal({ item, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  if (!item) return null;

  const buttons = statusButtons[item.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* MODAL */}
      <div className="bg-white max-w-4xl w-full mx-4 sm:mx-8 lg:max-w-[780px] rounded-2xl shadow-xl">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 py-5 border-b border-gray-300">
          <h2 className="text-xl font-semibold">Found Item Details</h2>
          <X className="cursor-pointer text-gray-500" onClick={onClose} />
        </div>

        {/* TITLE */}
        <div className="flex flex-col sm:flex-row items-center pt-6 px-8 gap-5">
          <img
            src="https://images.unsplash.com/photo-1580910051074-3eb694886505"
            className="w-24 h-24 rounded-lg object-cover"
          />
          <div className="text-left">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-gray-500">{item.category}</p>

            <span
              className={`mt-2 inline-block px-4 py-1 rounded-full text-sm font-medium ${statusStyles[item.status]}`}
            >
              {item.status}
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 p-8 text-sm">
          {/* LEFT */}
          <div className="space-y-6">
            <h3 className="font-semibold text-base">Item Information</h3>

            <div>
              <p className="text-gray-500 font-bold">Description</p>
              <p>Set of keys with blue keychain</p>
            </div>

            <div>
              <p className="text-gray-500 font-bold">Found Location</p>
              <p>{item.location}</p>
            </div>

            <div>
              <p className="text-gray-500 font-bold">Time Found</p>
              <p>{item.time}</p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <h3 className="font-semibold text-base">Finder Information</h3>

            <div>
              <p className="text-gray-500 font-bold">Submitted By</p>

              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                {item.submittedType}
              </span>
            </div>

            <div>
              <p className="text-gray-500 font-bold">Finder</p>
              <p>{item.submittedBy}</p>
            </div>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex flex-wrap justify-center gap-4 border-t border-gray-300 p-6">
          {buttons.includes("check") && (
            <button className="cursor-pointer flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg hover:shadow-sm">
              <CircleCheck size={16} />
              Approve
            </button>
          )}

          {buttons.includes("reject") && (
            <button className="cursor-pointer flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg hover:shadow-sm">
              <FiXCircle size={16} />
              Reject
            </button>
          )}

          {buttons.includes("ai") && (
            <button className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg hover:shadow-sm">
              <SquaresExclude size={16} />
              Trigger AI Match
            </button>
          )}

          {buttons.includes("coin") && (
            <button className="cursor-pointer bg-orange-400 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:shadow-sm">
              <Coins size={16} />
              Reward Points
            </button>
          )}

          <button
            onClick={onClose}
            className="cursor-pointer border border-gray-300 px-9 py-2 rounded-lg hover:shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}