import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, MapPin, History, User } from "lucide-react";

export default function QuickActions() {
  const [showReportModal, setShowReportModal] = useState(false);

  const actions = [
    {
      text: "Report Item",
      color: "bg-blue-600",
      icon: Plus,
      onClick: () => setShowReportModal(true),
    },
    {
      text: "Browse Found Items",
      color: "bg-green-600",
      icon: Search,
    },
    {
      text: "Track Items",
      color: "bg-orange-500",
      icon: MapPin,
    },
    {
      text: "View Activity History",
      color: "bg-lime-600",
      icon: History,
    },
    {
      text: "Edit Profile",
      color: "bg-red-700",
      icon: User,
    },
  ];

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="font-semibold mb-4">Quick Actions</h2>

        <div className="space-y-3">
          {actions.map((a, i) => {
            const Icon = a.icon;

            return (
              <button
                key={i}
                onClick={a.onClick}
                className={`${a.color} text-white w-full py-3 px-4 rounded-lg font-medium flex items-center gap-3 hover:opacity-80 transition`}
              >
                <Icon size={18} />
                <span>{a.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      {showReportModal && (
        <div
          className="h-full fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
        >
          <div className="bg-white border border-gray-300 w-full max-w-md rounded-xl p-6 shadow-2xl">
            <h3 className="text-lg font-semibold mb-2">Choose Report Type</h3>

            <p className="text-sm text-gray-500 mb-4">
              Please select whether you are reporting an item you lost or
              submitting details about an item you found.
            </p>

            <div className="space-y-3">
              <Link to="/submitreport">
                <button className="cursor-pointer w-full bg-red-700 text-white py-3 rounded-lg mb-4">
                  + Report Lost Item
                </button>
              </Link>

              <Link to="/submitreport">
                <button className="cursor-pointer w-full bg-blue-600 text-white py-3 rounded-lg mb-4">
                  + Report Found Item
                </button>
              </Link>

              <button
                onClick={() => setShowReportModal(false)}
                className="cursor-pointer w-full bg-gray-200 text-gray-700 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
