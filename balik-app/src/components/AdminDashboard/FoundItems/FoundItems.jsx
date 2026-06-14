import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom"; // Added for routing
import { Eye, Check, X, SquaresExclude, Plus, UserCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FoundItemDetailsModal from "./FoundItemDetailsModal";
import AdminReport from "../AdminHome/AdminReport";

const tableHeaders = [
  { label: "Item", align: "text-left" },
  { label: "Found Location", align: "text-left" },
  { label: "Submitted By", align: "text-left" },
  { label: "Time Found", align: "text-left" },
  { label: "Status", align: "text-center" },
  { label: "Actions", align: "text-left" },
];

const submittedStyles = {
  "Registered User": "bg-blue-100 text-blue-700 border-blue-200",
  "Anonymous User": "bg-amber-100 text-amber-700 border-amber-200",
};

const statusStyles = {
  Approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Matched: "bg-blue-100 text-blue-700 border-blue-200",
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Claimed: "bg-purple-100 text-purple-700 border-purple-200",
  Archived: "bg-slate-200 text-slate-600 border-slate-300",
};

const statusActions = {
  Approved: ["view", "ai"],
  Matched: ["view", "check", "reject"],
  Pending: ["view", "check", "reject", "ai"],
  Claimed: ["view"],
  Archived: ["view"],
};

function ActionIcons({ status, onView, onAIMatch, onApprove, onReject }) {
  const actions = statusActions[status] || ["view"];

  const actionMap = {
    view: {
      icon: Eye,
      color: "#059669",
      label: "View Details",
      onClick: onView,
    },
    check: {
      icon: Check,
      color: "#059669",
      label: "Approve",
      onClick: onApprove,
    },
    reject: { icon: X, color: "#DC2626", label: "Reject", onClick: onReject },
    ai: {
      icon: SquaresExclude,
      color: "#7C3AED",
      label: "AI Match",
      onClick: onAIMatch,
    },
  };

  return (
    <div className="flex justify-start items-center gap-1.5">
      {actions.map((action) => {
        const { icon: Icon, color, label, onClick } = actionMap[action];
        return (
          <div
            key={action}
            className="relative group/tooltip flex items-center justify-center"
          >
            <button
              onClick={onClick}
              className="cursor-pointer p-2 rounded-xl transition-all duration-300 border border-transparent outline-none focus:ring-2 focus:ring-slate-200 active:scale-95"
              style={{ color }}
              aria-label={label}
            >
              <Icon size={18} strokeWidth={2.5} />
            </button>
            <span className="absolute z-50 -top-8 whitespace-nowrap bg-slate-800 text-white text-xs font-bold px-2.5 py-1 rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity shadow-sm pointer-events-none tracking-wide">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function FoundItems() {
  const navigate = useNavigate();
  
  // Simulated Context/Auth
  const user = { id: "admin-123", role: "admin" };

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [guestCount, setGuestCount] = useState(0);

  useEffect(() => {
    document.title = `Found Items (${foundItems.length}) | BALIK Admin`;

    return () => {
      document.title = "BALIK Admin";
    };
  }, [foundItems.length]);

  // Simulated Data Fetch
  const fetchFoundItems = () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        {
          id: "FND-001",
          name: "iPhone 13 Pro",
          category: "Electronics",
          location: "Library 2nd Floor",
          submittedType: "Registered User",
          submittedBy: "Alex Reyes",
          time: "Oct 24, 2026, 10:30 AM",
          status: "Pending",
          imageUrl:
            "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=150&h=150&fit=crop",
          raw: { description: "Black case, cracked screen protector." },
        },
        {
          id: "FND-002",
          name: "HydroFlask 32oz",
          category: "Personal Items",
          location: "Cafeteria",
          submittedType: "Anonymous User",
          submittedBy: "Guest Submission",
          time: "Oct 23, 2026, 02:15 PM",
          status: "Approved",
          imageUrl:
            "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=150&h=150&fit=crop",
          raw: { description: "Navy blue, covered in stickers." },
        },
        {
          id: "FND-003",
          name: "Leather Wallet",
          category: "Personal Items",
          location: "Engineering Building",
          submittedType: "Registered User",
          submittedBy: "Maria Clara",
          time: "Oct 22, 2026, 09:00 AM",
          status: "Matched",
          imageUrl:
            "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=150&h=150&fit=crop",
          raw: { description: "Brown leather, contains student ID." },
        },
      ];

      setFoundItems(mockData);
      setRegisteredCount(
        mockData.filter((i) => i.submittedType === "Registered User").length,
      );
      setGuestCount(
        mockData.filter((i) => i.submittedType === "Anonymous User").length,
      );
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchFoundItems();
  }, []);

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Simulated Status Update
  const handleStatusUpdate = (itemId, newStatus) => {
    setLoading(true);
    setTimeout(() => {
      setFoundItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, status: newStatus } : item,
        ),
      );
      setIsModalOpen(false);
      setSelectedItem(null);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-200/60 relative flex flex-col h-full overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 border-b border-slate-100 mb-9 shrink-0">
        {/* Stats */}
        <div className="flex flex-col sm:flex-row items-center bg-white border border-slate-200 shadow-sm rounded-3xl sm:rounded-3xl p-1.5 w-full md:w-auto mb-3">
          {/* Registered Metric */}
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4 px-4 py-1.5 rounded-2xl sm:rounded-2xl hover:bg-slate-50 transition-colors group cursor-default">
            <div className="flex items-center gap-2.5">
              {/* 3D Wrapper */}
              <div className="bg-gradient-to-br from-[#8A2525] via-[#5C1313] to-[#3A0C0C] p-[7px] rounded-xl border border-[#4A0F0F] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.4),0_4px_8px_rgba(92,19,19,0.3)] group-hover:-translate-y-0.5 group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.4),0_6px_12px_rgba(92,19,19,0.4)] transition-all duration-300">
                <UserCircle2
                  size={16}
                  strokeWidth={2.5}
                  className="text-white drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.6)]"
                />
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Registered
              </span>
            </div>
            <span className="text-sm font-black text-slate-800">
              {registeredCount}
            </span>
          </div>

          {/* Vertical Divider (Desktop) / Horizontal Divider (Mobile) */}
          <div className="hidden sm:block w-px h-6 bg-slate-100 mx-1" />
          <div className="sm:hidden w-full h-px bg-slate-100 my-1" />

          {/* Guests Metric */}
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4 px-4 py-1.5 rounded-2xl sm:rounded-2xl hover:bg-slate-50 transition-colors group cursor-default">
            <div className="flex items-center gap-2.5">
              {/* 3D Wrapper */}
              <div className="bg-gradient-to-br from-white via-slate-100 to-slate-300 p-[7px] rounded-xl border border-slate-200/80 shadow-[inset_0_1px_2px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.06),0_4px_8px_rgba(0,0,0,0.05)] group-hover:-translate-y-0.5 group-hover:shadow-[inset_0_1px_2px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.06),0_6px_12px_rgba(0,0,0,0.08)] transition-all duration-300">
                <UserCircle2
                  size={16}
                  strokeWidth={2.5}
                  className="text-slate-600 drop-shadow-[0_1px_0px_rgba(255,255,255,1)]"
                />
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Guests
              </span>
            </div>
            <span className="text-sm font-black text-slate-800">
              {guestCount}
            </span>
          </div>
        </div>

        {/* Encode Button */}
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="w-full md:w-auto cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white px-6 py-3.5 sm:py-3 rounded-2xl font-black text-sm shadow-md shadow-emerald-600/20 transition-all active:scale-95 uppercase tracking-wider outline-none focus:ring-2 focus:ring-emerald-600/40"
        >
          <Plus size={18} strokeWidth={3} />
          Encode Found Item
        </button>
      </div>

      <div className="mb-3 pl-1 shrink-0">
        <p className="text-sm font-black text-slate-500 uppercase tracking-widest">
          Found Items{" "}
          <span className="text-emerald-600">({foundItems.length})</span>
        </p>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto overflow-y-visible pb-4 shrink-0 [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-track]:bg-[#5C1313]/5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#5C1313]/40 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#5C1313]">
        <table className="w-full text-sm text-left min-w-[900px] border-collapse">
          <thead className="bg-slate-50/80 text-sm font-black text-slate-600 uppercase tracking-widest border-y border-slate-200/60 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              {tableHeaders.map((header, i) => (
                <th
                  key={i}
                  className={`px-4 py-4 ${header.align} first:rounded-tl-xl last:rounded-tr-xl`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-16 text-center text-sm font-bold text-slate-400 animate-pulse"
                  >
                    Fetching Items...
                  </td>
                </tr>
              ) : foundItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-16 text-center text-base font-bold text-slate-500 italic"
                  >
                    No found items registered.
                  </td>
                </tr>
              ) : (
                foundItems.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.04 }}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-4 py-4 max-w-[250px]">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover shadow-sm border border-slate-200"
                        />
                        <div className="truncate">
                          <p className="font-black text-slate-800 tracking-tight text-base truncate">
                            {item.name}
                          </p>
                          <p className="text-xs font-bold text-slate-400 truncate mt-0.5 uppercase tracking-wider">
                            {item.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 max-w-[150px]">
                      <p className="font-bold text-slate-600 truncate text-sm">
                        {item.location}
                      </p>
                    </td>

                    <td className="px-4 py-4 max-w-[180px]">
                      <div className="flex flex-col items-start gap-1">
                        <p className="font-black text-slate-700 truncate text-sm">
                          {item.submittedBy}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${submittedStyles[item.submittedType]}`}
                        >
                          {item.submittedType}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-bold text-slate-500 text-sm">
                        {item.time}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${statusStyles[item.status] || "bg-slate-100 text-slate-600 border-slate-200"}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <ActionIcons
                        status={item.status}
                        onView={() => openModal(item)}
                        onAIMatch={() => navigate("/admin/matching")} // Handled here dynamically
                        onApprove={() =>
                          handleStatusUpdate(item.id, "Approved")
                        }
                        onReject={() => handleStatusUpdate(item.id, "Archived")}
                      />
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isModalOpen && (
              <FoundItemDetailsModal
                item={selectedItem}
                onClose={() => setIsModalOpen(false)}
                onApprove={() =>
                  handleStatusUpdate(selectedItem.id, "Approved")
                }
                onReject={() => handleStatusUpdate(selectedItem.id, "Archived")}
              />
            )}

            {isReportModalOpen && (
              <AdminReport
                isOpen={isReportModalOpen}
                initialType="Found Item"
                onClose={() => setIsReportModalOpen(false)}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}