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
  X,
} from "lucide-react";
import ExportReportsModal from "./ExportReportsModal";
import AdminReportLost from "./AdminReportLost";
import AdminReportFound from "./AdminReportFound";

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
    to: "/admin/qr-verify",
  },
  {
    icon: SquaresExclude,
    title: "Run AI Matching",
    sub: "Find Matches",
    color: "bg-purple-500",
    to: "/admin/matching",
  },
  {
    icon: Bell,
    title: "Send Notification",
    sub: "Alert Users",
    color: "bg-orange-500",
    to: "/comingsoon",
  },
  {
    icon: Download,
    title: "Export Reports",
    sub: "Generate CSV",
    color: "bg-emerald-500",
    action: "export",
  },
  {
    icon: Coins,
    title: "Manage Points",
    sub: "Gamification",
    color: "bg-yellow-500",
    to: "/admin/gamification",
  },
  {
    icon: Trophy,
    title: "View Leaderboard",
    sub: "Top Users",
    color: "bg-red-500",
    to: "/admin/gamification",
  },
];

export default function QuickActions() {
  const [showTypeSelection, setShowTypeSelection] = useState(false);
  const [showLostModal, setShowLostModal] = useState(false);
  const [showFoundModal, setShowFoundModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl p-6">
        <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>

        <div className="grid grid-cols-7 gap-4">
          {actions.map((a, i) => {
            const Icon = a.icon;

            const cardContent = (
              <>
                <div
                  className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center text-white ${a.color}`}
                >
                  <Icon size={18} />
                </div>
                <p className="text-sm font-bold mt-2 text-gray-800">{a.title}</p>
                <p className="text-xs font-medium text-gray-500">{a.sub}</p>
              </>
            );

            if (a.to) {
              return (
                <Link
                  key={i}
                  to={a.to}
                  className="border border-gray-300 rounded-lg p-4 text-center hover:shadow-md transition-shadow block"
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <div
                key={i}
                onClick={() => {
                  if (a.action === "report") {
                    setShowTypeSelection(true);
                  } else if (a.action === "export") {
                    setShowExportModal(true);
                  }
                }}
                className="border border-gray-300 rounded-lg p-4 text-center hover:shadow-md cursor-pointer transition-shadow"
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>

      {/* Report Type Selection Modal */}
      {showTypeSelection && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 relative shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowTypeSelection(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-all"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-black text-slate-900 mb-2">Choose Report Type</h2>
            <p className="text-sm text-slate-500 mb-8 font-medium text-left">Which type of item would you like to encode into the system?</p>
            
            <div className="space-y-4">
              <button 
                onClick={() => {
                  setShowTypeSelection(false);
                  setShowLostModal(true);
                }}
                className="group w-full py-5 px-6 bg-[#7B1C1C] hover:bg-[#5a1414] text-white font-bold rounded-2xl flex items-center justify-between transition-all active:scale-[0.98] shadow-lg shadow-red-900/10"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Plus size={22} strokeWidth={3} />
                  </div>
                  <span className="text-lg">Report Lost Item</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <SquaresExclude size={18} />
                </div>
              </button>

              <button 
                onClick={() => {
                  setShowTypeSelection(false);
                  setShowFoundModal(true);
                }}
                className="group w-full py-5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-between transition-all active:scale-[0.98] shadow-lg shadow-blue-900/10"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Plus size={22} strokeWidth={3} />
                  </div>
                  <span className="text-lg">Report Found Item</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <SquaresExclude size={18} />
                </div>
              </button>
            </div>
            
            <button 
              onClick={() => setShowTypeSelection(false)} 
              className="w-full mt-6 py-4 bg-slate-50 text-slate-500 font-bold rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest text-xs"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Admin Report Modals */}
      <AdminReportLost 
        isOpen={showLostModal} 
        onClose={() => setShowLostModal(false)} 
      />
      <AdminReportFound 
        isOpen={showFoundModal} 
        onClose={() => setShowFoundModal(false)} 
      />

      {showExportModal && (
        <ExportReportsModal onClose={() => setShowExportModal(false)} />
      )}
    </>
  );
}
