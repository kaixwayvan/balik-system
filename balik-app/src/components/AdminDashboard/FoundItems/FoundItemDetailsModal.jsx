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
  Default: ["ai", "coin"]
};

export default function FoundItemDetailsModal({ item, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!item) return null;

  const buttons = statusButtons[item.status] || statusButtons.Default;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* MODAL */}
      <div className="bg-white max-w-4xl w-full mx-4 sm:mx-8 lg:max-w-[780px] rounded-2xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 py-5 border-b border-gray-300">
          <h2 className="text-xl font-semibold">Found Item Details</h2>
          <X className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors" onClick={onClose} />
        </div>

        <div className="max-h-[80vh] overflow-y-auto">
          {/* TITLE */}
          <div className="flex flex-col sm:flex-row items-center pt-6 px-8 gap-5">
            <div className="w-24 h-24 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
              <img
                src={item.image || "https://images.unsplash.com/photo-1580910051074-3eb694886505"}
                className="w-full h-full object-cover"
                alt={item.name}
              />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-500 text-sm font-medium">{item.category || "Item Category"}</p>

              <span
                className={`mt-2 inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusStyles[item.status] || "bg-gray-100 text-gray-600"}`}
              >
                {item.status}
              </span>
            </div>
          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 p-8 text-sm">
            {/* LEFT */}
            <div className="space-y-6">
              <h3 className="font-bold text-gray-800 uppercase tracking-widest text-[10px]">Item Information</h3>

              <div>
                <p className="text-gray-400 font-bold uppercase text-[10px] mb-1">Description</p>
                <p className="text-gray-700 leading-relaxed">{item.description || "No description provided."}</p>
              </div>

              <div>
                <p className="text-gray-400 font-bold uppercase text-[10px] mb-1">Found Location</p>
                <p className="text-gray-700 font-medium">{item.location}</p>
              </div>

              <div>
                <p className="text-gray-400 font-bold uppercase text-[10px] mb-1">Time Found</p>
                <p className="text-gray-700 font-medium">{item.time}</p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              <h3 className="font-bold text-gray-800 uppercase tracking-widest text-[10px]">Finder Information</h3>

              <div>
                <p className="text-gray-400 font-bold uppercase text-[10px] mb-1">Submitted By</p>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {item.submittedType || "Registered User"}
                </span>
              </div>

              <div>
                <p className="text-gray-400 font-bold uppercase text-[10px] mb-1">Finder Name</p>
                <p className="text-gray-700 font-medium">{item.user || item.submittedBy || "Anonymous"}</p>
              </div>

              <div>
                <p className="text-gray-400 font-bold uppercase text-[10px] mb-1">Contact Email</p>
                <p className="text-gray-700 font-medium">{item.email || "No email provided"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex flex-wrap justify-center gap-4 border-t border-gray-300 p-6 bg-gray-50/50">
          {buttons.includes("check") && (
            <button className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-md">
              <CircleCheck size={16} />
              Approve
            </button>
          )}

          {buttons.includes("reject") && (
            <button className="cursor-pointer flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-md">
              <FiXCircle size={16} />
              Reject
            </button>
          )}

          {buttons.includes("ai") && (
            <button className="cursor-pointer flex items-center gap-2 bg-[#7B1C1C] hover:bg-red-800 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-md">
              <SquaresExclude size={16} />
              Trigger AI Match
            </button>
          )}

          {buttons.includes("coin") && (
            <button className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 font-bold text-sm transition-all active:scale-95 shadow-md">
              <Coins size={16} />
              Reward Points
            </button>
          )}

          <button
            onClick={onClose}
            className="cursor-pointer border border-gray-300 px-9 py-2 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}