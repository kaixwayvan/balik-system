import { useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { 
  Plus, 
  ScanLine, 
  SquaresExclude, 
  Bell, 
  FileDown, 
  Coins, 
  Trophy, 
  ArrowUpRight, 
  Loader2, 
  AlertTriangle 
} from "lucide-react";
import AdminReport from "./AdminReport";

const actions = [
  { icon: Plus, title: "Report Item", sub: "Launch Wizard", color: "text-emerald-600", bg: "bg-emerald-50", action: "report", priority: true },
  { icon: SquaresExclude, title: "AI Matching", sub: "Run Diagnostics", color: "text-purple-600", bg: "bg-purple-50", to: "/admin/matching", priority: true },
  { icon: ScanLine, title: "Scan QR", sub: "Verify return", color: "text-blue-600", bg: "bg-blue-50", to: "/admin/qr-verify", priority: false },
  { icon: Bell, title: "Notify Users", sub: "Broadcast alerts", color: "text-orange-600", bg: "bg-orange-50", action: "notify", priority: false },
  { icon: FileDown, title: "Export Data", sub: "Download CSV", color: "text-teal-600", bg: "bg-teal-50", action: "export", priority: false },
  { icon: Coins, title: "Gamification", sub: "Points Engine", color: "text-amber-600", bg: "bg-amber-50", to: "/comingsoon", priority: false },
  { icon: Trophy, title: "Leaderboard", sub: "Rankings board", color: "text-rose-600", bg: "bg-rose-50", to: "/admin/gamification", priority: false },
];

export default function QuickActions() {
  const [isExporting, setIsExporting] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState("Missing Item");

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  const handleOpenReportForm = (type) => {
    setShowTypeModal(false);
    setSelectedReportType(type);
    setIsReportModalOpen(true);
  };

  return (
    <div className="bg-[#F8F7F4] rounded-[2rem] p-6 sm:p-8 shadow-md border border-[#EBE8E0] w-full relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-black text-md text-slate-800 uppercase tracking-widest flex items-center gap-3 text-left">
          <span className="w-2 h-2 rounded-full bg-[#5C1313] animate-pulse shrink-0" />
          System Command Core
        </h2>
      </div>

      <div className="flex flex-wrap gap-4">
        {actions.map((a, i) => {
          const Icon = a.icon;
          const Wrapper = a.to ? Link : "button";
          const isLarge = a.priority;
          const isExportAction = a.action === "export";
          const isReportAction = a.action === "report";

          return (
            <Wrapper
              key={i}
              to={a.to}
              onClick={(e) => {
                if (isReportAction) {
                  e.preventDefault();
                  setShowTypeModal(true);
                } else if (isExportAction) {
                  e.preventDefault();
                  if (!isExporting) handleExport();
                }
              }}
              disabled={isExportAction && isExporting}
              className={`text-left cursor-pointer group flex flex-col justify-between p-6 rounded-[1.5rem] transition-all duration-300 outline-none focus:ring-2 focus:ring-[#5C1313]/20 flex-grow shrink-0 ${
                isLarge 
                  ? "basis-[100%] md:basis-[calc(50%-1rem)] lg:basis-[280px] bg-gradient-to-br from-white to-slate-50 border border-slate-200/80 shadow-[0_8px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(92,19,19,0.08)] hover:border-[#5C1313]/20 hover:-translate-y-1" 
                  : "basis-[calc(50%-1rem)] sm:basis-[calc(33.333%-1rem)] lg:basis-[180px] bg-white border border-slate-200/60 shadow-sm hover:shadow-[0_10px_25px_rgba(0,0,0,0.05)] hover:border-[#5C1313]/15 hover:-translate-y-1"
              } ${isExportAction && isExporting ? "opacity-60 cursor-wait pointer-events-none" : ""}`}
            >
              <div className="flex justify-between items-start w-full mb-8">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${a.bg} ${a.color} shadow-sm border border-black/5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                  {isExportAction && isExporting ? (
                    <Loader2 size={22} strokeWidth={2.5} className="animate-spin text-slate-500" />
                  ) : (
                    <Icon size={22} strokeWidth={2.5} />
                  )}
                </div>
                {isLarge && (
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-[#5C1313] group-hover:border-[#5C1313] transition-colors duration-300">
                    <ArrowUpRight size={16} className="text-slate-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                )}
              </div>
              
              <div className="text-left w-full">
                <p className={`font-black tracking-tight text-slate-800 ${isLarge ? 'text-[16px]' : 'text-[14px]'}`}>
                  {isExportAction && isExporting ? "Exporting..." : a.title}
                </p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 block truncate uppercase tracking-widest">
                  {a.sub}
                </p>
              </div>
            </Wrapper>
          );
        })}
      </div>

      {/* Type Selection Modal */}
      {showTypeModal && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-[#C4B5AD]/60 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={() => setShowTypeModal(false)}
        >
          <div 
            className="bg-white border border-gray-100 w-full max-w-lg rounded-3xl p-5 sm:p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Choose Report Type</h3>
            
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
              <div className="bg-red-500 text-white rounded-full p-2 flex-shrink-0">
                <AlertTriangle size={18} strokeWidth={2.5} />
              </div>
              <p className="text-sm font-medium text-red-800 leading-relaxed">
                Please select whether you are reporting an item you lost or
                submitting details about an item you found.
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => handleOpenReportForm("Missing Item")}
                className="group cursor-pointer w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-200 active:scale-[0.98] font-semibold flex items-center justify-center gap-2"
              >
                <Plus size={20} className="transition-transform group-hover:rotate-90" /> 
                Report Lost Item
              </button>
              
              <button 
                onClick={() => handleOpenReportForm("Found Item")}
                className="group cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98] font-semibold flex items-center justify-center gap-2"
              >
                <Plus size={20} className="transition-transform group-hover:rotate-90" /> 
                Report Found Item
              </button>
              
              <button
                onClick={() => setShowTypeModal(false)}
                className="cursor-pointer w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 mt-2 rounded-2xl transition-all duration-300 active:scale-[0.98] font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body 
      )}

      {/* Admin Report Form Modal */}
      {isReportModalOpen && (
        <AdminReport 
          isOpen={isReportModalOpen} 
          initialType={selectedReportType} 
          onClose={() => setIsReportModalOpen(false)} 
        />
      )}
    </div>
  );
}