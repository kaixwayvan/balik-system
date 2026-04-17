import { useEffect } from "react";
import { X, ScanSearch, ScanEye, SearchCheck, ArchiveRestore } from "lucide-react";

const statusStyles = {
  Active: "bg-blue-100 text-blue-600",
  Matched: "bg-green-100 text-green-600",
  Claimed: "bg-purple-100 text-purple-600",
  Archived: "bg-gray-200 text-gray-600",
};

export default function LostItemDetailsModal({ item, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* MODAL */}
      <div className="bg-white w-[650px] rounded-xl shadow-xl">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 py-5 border-b border-gray-300">
          <h2 className="text-xl font-semibold">Lost Item Details</h2>

          <button onClick={onClose}>
            <X className="cursor-pointer text-gray-500" />
          </button>
        </div>

        {/* BODY */}
        <div className="grid grid-cols-2 gap-10 p-6 text-sm">
          {/* LEFT */}
          <div className="space-y-5">
            <h3 className="font-semibold text-base">Item Information</h3>

            <div>
              <p className="text-gray-500 font-bold">Item Name</p>
              <p className="font-medium">{item.name}</p>
            </div>

            <div>
              <p className="text-gray-500 font-bold">Description</p>
              <p>{item.description}</p>
            </div>

            <div>
              <p className="text-gray-500 font-bold">Category</p>
              <p>{item.category}</p>
            </div>

            <div>
              <p className="text-gray-500 font-bold">Location Lost</p>
              <p>{item.location}</p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            <h3 className="font-semibold text-base">Owner Information</h3>

            <div>
              <p className="text-gray-500 font-bold">Owner Name</p>
              <p>{item.owner}</p>
            </div>

            <div>
              <p className="text-gray-500 font-bold">Email</p>
              <p>{item.email}</p>
            </div>

            <div>
              <p className="text-gray-500 font-bold">Proof of Ownership</p>
              <p>Purchase receipt and photos</p>
            </div>

            <div>
              <p className="text-gray-500 font-bold mb-1">Status</p>
              <span
                className={`px-4 py-1 rounded-full text-xs font-medium ${
                  statusStyles[item.status]
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 p-3 border-t border-gray-300">
          {item.status === "Active" && (
            <button className="flex items-center gap-2 cursor-pointer bg-purple-600 hover:bg-purple-700 font-medium text-white px-5 py-2 rounded-lg hover:shadow-sm">
              <ScanSearch size={16} />
              Trigger AI Matching
            </button>
          )}

          {item.status === "Matched" && (
            <button className="flex items-center gap-2 cursor-pointer bg-green-600 hover:bg-green-700 font-medium text-white px-5 py-2 rounded-lg hover:shadow-sm">
              <ScanEye size={16} />
              View Matched Item
            </button>
          )}

          {item.status === "Claimed" && (
            <span className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-700 rounded-lg">
              <SearchCheck size={16} />
              Item Already Claimed
            </span>
          )}

          {item.status === "Archived" && (
            <span className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-100 bg-gray-600 rounded-lg">
              <ArchiveRestore size={16} />
              Archived Record
            </span>
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
