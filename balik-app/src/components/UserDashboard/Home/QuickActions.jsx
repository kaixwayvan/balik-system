import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Plus, Search, MapPin, History, User, AlertTriangle } from "lucide-react";
import ReportFoundItemModal from "./ReportFoundItemModal";
import ReportLostItemModal from "./ReportLostItemModal";

export default function QuickActions() {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFoundModal, setShowFoundModal] = useState(false);
  const [showLostModal, setShowLostModal] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      text: "Report Item",
      color: "bg-blue-600",
      icon: Plus,
      onClick: () => setShowReportModal(true),
    },
    {
      text: "Edit Profile",
      color: "bg-red-700",
      icon: User,
      onClick: () => navigate("/dashboard/profile"),
    },
  ];

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="font-semibold mb-4">Quick Actions</h2>

        <div className="flex flex-col items-center justify-center space-y-3">
          {actions.map((a, i) => {
            const Icon = a.icon;

            return (
              <button
                key={i}
                onClick={a.onClick}
                className={`${a.color} cursor-pointer text-white w-full py-3 px-4 rounded-lg font-medium flex items-left justify-center gap-3 hover:opacity-80 transition`}
              >
                <Icon size={18} />
                <span>{a.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CHOOSE REPORT TYPE MODAL */}
      {showReportModal && (
        <div
          className="h-full fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
        >
          <div className="bg-white border border-gray-300 w-full max-w-lg rounded-xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-2">Choose Report Type</h3>

            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <div className="bg-red-500 text-white rounded-full p-2 flex items-center justify-center">
                <AlertTriangle size={16} />
              </div>

              <p className="text-sm font-semibold text-red-700">
                Please select whether you are reporting an item you lost or
                submitting details about an item you found.
              </p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => {
                  setShowReportModal(false);
                  setShowLostModal(true);
                }}
                className="cursor-pointer w-full bg-red-700 text-white py-3 rounded-lg mb-4 hover:bg-red-800 transition"
              >
                + Report Lost Item
              </button>

              <button 
                onClick={() => {
                  setShowReportModal(false);
                  setShowFoundModal(true);
                }}
                className="cursor-pointer w-full bg-blue-600 text-white py-3 rounded-lg mb-4 hover:bg-blue-700 transition"
              >
                + Report Found Item
              </button>

              <button
                onClick={() => setShowReportModal(false)}
                className="cursor-pointer w-full bg-gray-200 font-bold text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOUND ITEM MODAL */}
      {showFoundModal && (
        <ReportFoundItemModal onClose={() => setShowFoundModal(false)} />
      )}

      {/* LOST ITEM MODAL */}
      {showLostModal && (
        <ReportLostItemModal onClose={() => setShowLostModal(false)} />
      )}
    </>
  );
}
