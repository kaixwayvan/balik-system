import { useState, useEffect } from "react";
import { Eye, Check, X, SquaresExclude, Coins, Plus } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import FoundItemDetailsModal from "./FoundItemDetailsModal";

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

import { supabase } from "../../../utils/supabaseClient";

function ActionIcons({ status, onView }) {
  const actions = statusActions[status];

  const actionMap = {
    view: {
      icon: Eye,
      color: "text-green-600",
      label: "View",
      onClick: onView,
    },
    check: { icon: Check, color: "text-green-600", label: "Approve" },
    reject: { icon: X, color: "text-red-500", label: "Reject" },
    ai: { icon: SquaresExclude, color: "text-purple-600", label: "AI Match" },
    coin: { icon: Coins, color: "text-orange-500", label: "Reward" },
  };

  return (
    <div className="flex justify-left items-center gap-3">
      {actions.map((action) => {
        const { icon: Icon, color, label, onClick } = actionMap[action];
        return (
          <div key={action} className="relative group">
            <Icon
              className={`${color} cursor-pointer`}
              size={18}
              onClick={onClick}
            />
            <span
              className="absolute -top-6 left-1/2 -translate-x-1/2 
                             whitespace-nowrap bg-gray-800 text-white 
                             text-xs px-2 py-1 rounded opacity-0 
                             group-hover:opacity-100 transition-opacity"
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
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [guestCount, setGuestCount] = useState(0);

  import("react").then(({ useEffect }) => {
    // dynamically imported inside or we can just import at top. Let's rely on standard imports.
  });

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  useEffect(() => {
    async function fetchFoundItems() {
      try {
        const { data, error } = await supabase
          .from("items")
          .select("*")
          .eq("type", "found")
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        let rCount = 0;
        let gCount = 0;

        const formattedData = data.map(dbItem => {
          const reporter = dbItem.metadata?.reporter || {};
          const isGuest = dbItem.metadata?.is_anonymous;
          
          if (isGuest) gCount++;
          else rCount++;

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
        setRegisteredCount(rCount);
        setGuestCount(gCount);
      } catch (err) {
        console.error("Error fetching found items:", err);
      } finally {
        setLoading(false);
      }
    }
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

        <button className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg">
          <Plus size={18} />
          Encode Found Item
        </button>
      </div>

      <div className="max-w-[320px] flex items-center p-3 rounded-lg gap-4 bg-white border border-gray-300 hover:shadow-sm">
        <div className="flex items-center gap-2">
          <FaUserCircle size={15} className="text-green-600" />
          <p className="text-sm font-semibold text-gray-600">
            Registered Users: {registeredCount}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FaUserCircle size={15} className="text-orange-500" />
          <p className="text-sm font-semibold text-gray-600">
            Guest Submissions: {guestCount}
          </p>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 font-bold text-lg border-b border-gray-400">
          Found Items ({foundItems.length})
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr className="text-left border-b border-gray-300">
              {tableHeaders.map((header, index) => (
                <th
                  key={index}
                  className={`px-6 py-5 uppercase ${
                    header === "Actions" ? "text-center" : "text-left"
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="py-8 text-center text-gray-500">Loading items...</td></tr>
            ) : foundItems.length === 0 ? (
              <tr><td colSpan="6" className="py-8 text-center text-gray-500">No items found.</td></tr>
            ) : foundItems.map((item, i) => (
              <tr
                key={item.id || i}
                className="border-t border-gray-300 hover:bg-gray-50 align-middle"
              >
                {/* ITEM */}
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.imageUrl}
                      className="w-14 h-14 rounded-lg object-cover"
                    />

                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-gray-500 text-xs">{item.category}</p>
                    </div>
                  </div>
                </td>

                {/* LOCATION */}
                <td className="px-6 py-4">{item.location}</td>

                {/* SUBMITTED */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${submittedStyles[item.submittedType]}`}
                  >
                    {item.submittedType}
                  </span>

                  <p className="text-gray-500 text-xs mt-1">
                    {item.submittedBy}
                  </p>
                </td>

                {/* TIME */}
                <td className="px-6 py-4">{item.time}</td>

                {/* STATUS */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[item.status] || "bg-gray-100"}`}
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
    </div>
  );
}
