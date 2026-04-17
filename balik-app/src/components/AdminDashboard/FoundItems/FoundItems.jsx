import { useState } from "react";
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

const foundItems = [
  {
    name: "Red Wallet",
    category: "Personal Items",
    location: "Cafeteria, Table 15",
    submittedType: "Registered User",
    submittedBy: "Emma Wilson",
    time: "2025-01-26 15:20",
    status: "Pending",
  },
  {
    name: "Red Wallet",
    category: "Personal Items",
    location: "Cafeteria, Table 15",
    submittedType: "Guest",
    submittedBy: "Anonymous Guest",
    time: "2025-01-26 15:20",
    status: "Approved",
  },
  {
    name: "Red Wallet",
    category: "Personal Items",
    location: "Cafeteria, Table 15",
    submittedType: "Registered User",
    submittedBy: "Emma Wilson",
    time: "2025-01-26 15:20",
    status: "Matched",
  },
  {
    name: "Red Wallet",
    category: "Personal Items",
    location: "Cafeteria, Table 15",
    submittedType: "Registered User",
    submittedBy: "Emma Wilson",
    time: "2025-01-26 15:20",
    status: "Claimed",
  },
];

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

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

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
            Registered Users: 147
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FaUserCircle size={15} className="text-orange-500" />
          <p className="text-sm font-semibold text-gray-600">
            Guest Submissions: 45
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
            {foundItems.map((item, i) => (
              <tr
                key={i}
                className="border-t border-gray-300 hover:bg-gray-50 align-middle"
              >
                {/* ITEM */}
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1580910051074-3eb694886505"
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
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[item.status]}`}
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
