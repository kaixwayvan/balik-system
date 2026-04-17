import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  ScanLine,
  SquaresExclude,
  Bell,
  Download,
  Coins,
  Trophy,
  AlertTriangle,
} from "lucide-react";

const actions = [
  {
    icon: Plus,
    title: "Report Item",
    sub: "Lost or Found",
    color: "bg-green-500",
    action: "report",
  },
  {
    icon: ScanLine,
    title: "Scan QR Code",
    sub: "Verify items",
    color: "bg-blue-500",
  },
  {
    icon: SquaresExclude,
    title: "Run AI Matching",
    sub: "Find Matches",
    color: "bg-purple-500",
  },
  {
    icon: Bell,
    title: "Send Notification",
    sub: "Alert Users",
    color: "bg-orange-500",
  },
  {
    icon: Download,
    title: "Export Reports",
    sub: "Generate CSV",
    color: "bg-emerald-500",
  },
  {
    icon: Coins,
    title: "Manage Points",
    sub: "Gamification",
    color: "bg-yellow-500",
  },
  {
    icon: Trophy,
    title: "View Leaderboard",
    sub: "Top Users",
    color: "bg-red-500",
  },
];

export default function QuickActions() {
  const [showReportModal, setShowReportModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl p-6">
        <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>

        <div className="grid grid-cols-7 gap-4">
          {actions.map((a, i) => {
            const Icon = a.icon;

            return (
              <div
                key={i}
                onClick={() => {
                  if (a.action === "report") {
                    setShowReportModal(true);
                  }
                }}
                className="border border-gray-300 rounded-lg p-4 text-center hover:shadow-md cursor-pointer"
              >
                <div
                  className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center text-white ${a.color}`}
                >
                  <Icon size={18} />
                </div>

                <p className="text-sm font-bold mt-2">{a.title}</p>
                <p className="text-xs font-medium text-gray-500">{a.sub}</p>
              </div>
            );
          })}
        </div>
      </div>

      {showReportModal && (
        <div
          className="h-full fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
        >
          <div className="bg-white border border-gray-300 w-full max-w-lg rounded-xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-2">Choose Report Type</h3>

            <div className="flex items-start gap-3 bg-red-40 border border-red-200 rounded-lg p-3 mb-6">
              <div className="bg-red-500 text-white rounded-full p-2 flex items-center justify-center">
                <AlertTriangle size={16} />
              </div>

              <p className="text-sm font-semibold text-red-700">
                Please select whether you are reporting an item you lost or
                submitting details about an item you found.
              </p>
            </div>

            <div className="space-y-3">
              <Link to="/adminreport">
                <button className="cursor-pointer w-full bg-red-700 text-white py-3 rounded-lg mb-4">
                  + Report Lost Item
                </button>
              </Link>

              <Link to="/adminreport">
                <button className="cursor-pointer w-full bg-blue-600 text-white py-3 rounded-lg mb-4">
                  + Report Found Item
                </button>
              </Link>

              <button
                onClick={() => setShowReportModal(false)}
                className="cursor-pointer w-full bg-gray-200 font-bold text-gray-700 py-2 rounded-lg"
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
