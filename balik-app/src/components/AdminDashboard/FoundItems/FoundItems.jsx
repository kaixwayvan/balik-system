import { useState, useEffect } from "react";
import { Eye, Check, X, SquaresExclude, Coins, Plus } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import FoundItemDetailsModal from "./FoundItemDetailsModal";
import AdminReportFound from "../AdminHome/AdminReportFound";
import { supabase } from "../../../utils/supabaseClient";

const tableHeaders = [
  "Item",
  "Found Location",
  "Submitted By",
  "Time Found",
  "Status",
  "Actions",
];

const submittedStyles = {
  "Registered User": "bg-blue-100 text-blue-600",
  Guest: "bg-yellow-100 text-yellow-700",
};

const statusStyles = {
  Approved: "bg-green-100 text-green-600",
  Matched: "bg-blue-100 text-blue-600",
  Pending: "bg-yellow-100 text-yellow-700",
  Claimed: "bg-gray-200 text-black",
};

const statusActions = {
  Approved: ["view", "ai", "coin"],
  Matched: ["view", "check", "reject", "coin"],
  Pending: ["view", "check", "reject", "ai", "coin"],
  Claimed: ["view", "coin"],
};

function ActionIcons({ status, onView }) {
  const actions = statusActions[status];

  const actionMap = {
    view: {
      icon: Eye,
      color: "text-slate-400 hover:text-green-600",
      label: "View",
      onClick: onView,
    },
    check: { icon: Check, color: "text-green-600", label: "Approve" },
    reject: { icon: X, color: "text-red-500", label: "Reject" },
    ai: { icon: SquaresExclude, color: "text-purple-600", label: "AI Match" },
    coin: { icon: Coins, color: "text-orange-500", label: "Reward" },
  };

  return (
    <div className="flex justify-center items-center gap-3">
      {actions?.map((action) => {
        const { icon: Icon, color, label, onClick } = actionMap[action];
        return (
          <div key={action} className="relative group">
            <Icon
              className={`${color} cursor-pointer transition-colors`}
              size={18}
              onClick={onClick}
            />
            <span
              className="absolute -top-8 left-1/2 -translate-x-1/2 
                             whitespace-nowrap bg-slate-800 text-white 
                             text-[10px] font-bold px-2 py-1 rounded opacity-0 
                             group-hover:opacity-100 transition-all z-10"
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function FoundItems() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAdminReport, setShowAdminReport] = useState(false);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [guestCount, setGuestCount] = useState(0);

  const fetchFoundItems = async () => {
    try {
      // Only show loading spinner on initial load (no data yet)
      if (foundItems.length === 0) setLoading(true);
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("type", "found")
        .order("created_at", { ascending: false });

      if (error) throw error;

      let gCount = 0;
      const uniqueUserIds = new Set();

      const formattedData = data.map(dbItem => {
        const reporter = dbItem.metadata?.reporter || {};
        const isGuest = !dbItem.user_id;

        if (isGuest) {
          gCount++;
        } else {
          uniqueUserIds.add(dbItem.user_id);
        }

        return {
          id: dbItem.id,
          name: dbItem.title || dbItem.category || "Unknown Item",
          category: dbItem.category || "Other",
          location: dbItem.location,
          submittedType: isGuest ? "Guest" : "Registered User",
          submittedBy: isGuest ? "Anonymous Guest" : (reporter.name || "Unknown"),
          time: new Date(dbItem.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
          status: dbItem.status === 'resolved' ? 'Claimed' : dbItem.status === 'pending' ? 'Pending' : 'Approved',
          imageUrl: dbItem.image_url || "https://images.unsplash.com/photo-1580910051074-3eb694886505",
          raw: dbItem
        }
      });
      setFoundItems(formattedData);
      setRegisteredCount(uniqueUserIds.size);
      setGuestCount(gCount);
    } catch (err) {
      console.error("Error fetching found items:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchFoundItems();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-[#EEF1F8]">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Found Items Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage found items from registered users and guest submissions
          </p>
        </div>

        <button 
          onClick={() => setShowAdminReport(true)}
          className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-green-900/10"
        >
          <Plus size={18} />
          Encode Found Item
        </button>
      </div>

      <div className="max-w-fit flex items-center p-3 rounded-xl gap-6 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 px-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
            Registered: <span className="text-slate-900 ml-1">{registeredCount}</span>
          </p>
        </div>
        <div className="w-px h-4 bg-slate-200"></div>
        <div className="flex items-center gap-2 px-1">
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
            Guests: <span className="text-slate-900 ml-1">{guestCount}</span>
          </p>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-slate-200">
        <div className="p-6 font-black text-lg border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <span>Found Items Library ({foundItems.length})</span>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
            <div className="w-3 h-3 rounded-full bg-slate-100"></div>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-slate-50/50 text-slate-400">
            <tr className="text-left border-b border-slate-100">
              {tableHeaders.map((header, index) => (
                <th
                  key={index}
                  className={`px-6 py-5 uppercase text-[10px] font-black tracking-[0.2em] ${header === "Actions" ? "text-center" : "text-left"
                    }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan="6" className="py-20 text-center text-slate-400 font-medium italic">Loading database items...</td></tr>
            ) : foundItems.length === 0 ? (
              <tr><td colSpan="6" className="py-20 text-center text-slate-400 font-medium">No items reported yet.</td></tr>
            ) : foundItems.map((item, i) => (
              <tr
                key={item.id || i}
                className="hover:bg-slate-50/50 transition-colors align-middle"
              >
                {/* ITEM */}
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={item.imageUrl}
                        className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-slate-100"
                        alt={item.name}
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border border-slate-100 flex items-center justify-center">
                        <div className={`w-2 h-2 rounded-full ${item.status === 'Approved' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      </div>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 leading-tight">{item.name}</p>
                      <p className="text-slate-400 text-[11px] font-medium mt-0.5">{item.category}</p>
                    </div>
                  </div>
                </td>

                {/* LOCATION */}
                <td className="px-6 py-4">
                  <p className="text-slate-600 font-bold text-xs">{item.location}</p>
                </td>

                {/* SUBMITTED */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${submittedStyles[item.submittedType]}`}
                  >
                    {item.submittedType}
                  </span>

                  <p className="text-slate-400 text-[10px] font-medium mt-1 uppercase tracking-tight">
                    {item.submittedBy}
                  </p>
                </td>

                {/* TIME */}
                <td className="px-6 py-4">
                  <p className="text-slate-500 text-xs font-medium">{item.time}</p>
                </td>

                {/* STATUS */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusStyles[item.status] || "bg-slate-100"}`}
                  >
                    {item.status}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4">
                  <ActionIcons
                    status={item.status}
                    onView={() => openModal(item)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <FoundItemDetailsModal
          item={selectedItem}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <AdminReportFound 
        isOpen={showAdminReport} 
        onClose={() => {
          setShowAdminReport(false);
          fetchFoundItems(); // Refresh list after report
        }} 
      />
    </div>
  );
}
