import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Plus, User, AlertTriangle } from "lucide-react";
import SubmitReport from "./SubmitReport";

export default function QuickActions() {
  const [showReportModal, setShowReportModal] = useState(false);
  const [submitModalType, setSubmitModalType] = useState(null);
  const navigate = useNavigate();

  const actions = [
    {
      text: "Report Item",
      color: "bg-blue-600",
      hover: "hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200",
      icon: Plus,
      onClick: () => setShowReportModal(true),
    },
    {
      text: "Edit Profile",
      color: "bg-red-600",
      hover: "hover:bg-red-700 hover:shadow-lg hover:shadow-red-200",
      icon: User,
      onClick: () => navigate("/dashboard/profile"),
    },
  ];

  const handleOpenReportForm = (type) => {
    setShowReportModal(false); 
    setSubmitModalType(type); 
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm">
        <h2 className="font-bold text-gray-800 mb-4 text-lg">Quick Actions</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {actions.map((a, i) => {
            const Icon = a.icon;
            return (
              <button
                key={i}
                onClick={a.onClick}
                className={`${a.color} ${a.hover} transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] cursor-pointer text-white w-full py-3.5 px-4 rounded-2xl font-medium flex items-center justify-center gap-2.5`}
              >
                <Icon size={18} strokeWidth={2.5} />
                <span>{a.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {showReportModal && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-[#C4B5AD]/60 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={() => setShowReportModal(false)}
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
                onClick={() => setShowReportModal(false)}
                className="cursor-pointer w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 mt-2 rounded-2xl transition-all duration-300 active:scale-[0.98] font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body 
      )}

      <SubmitReport 
        isOpen={Boolean(submitModalType)} 
        initialType={submitModalType}
        onClose={() => setSubmitModalType(null)} 
      />
    </>
  );
}