import { useState } from "react";
import {
  CheckSquare,
  ShieldAlert,
  Zap,
  Bell,
  Mail,
  MailOpen,
  Trash2,
} from "lucide-react";

// Mock-data
const initialNotifications = [
  {
    id: "ntf-1",
    type: "match",
    title: "Potential Item Match Found",
    message:
      "A MacBook Air matching your description was turned in at the Student Union Vault.",
    time: "2 mins ago",
    isRead: false,
  },
  {
    id: "ntf-2",
    type: "security",
    title: "Account Security Alert",
    message:
      "Your profile password was successfully updated from an authorized campus network node.",
    time: "1 hour ago",
    isRead: false,
  },
  {
    id: "ntf-3",
    type: "system",
    title: "Network Escrow Released",
    message:
      "Transaction matrix completed. Secure asset signature has been verified and settled.",
    time: "Yesterday",
    isRead: true,
  },
  {
    id: "ntf-4",
    type: "broadcast",
    title: "Campus Broadcast Alert",
    message:
      "Maintenance notice: Lost & Found dynamic ledger synchronization scheduled for 02:00 UTC.",
    time: "3 days ago",
    isRead: true,
  },
  {
    id:"ntf-5",
    type: "broadcast",
    title: "Welcome to BALIK",
    message:
      "Please complete your profile to access all features.",
    time: "5 days ago",
    isRead: true,
  }
];

export default function NotificationPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filter, setFilter] = useState("all");

  const handleSelectToggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAllToggle = (filteredItems) => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((item) => item.id));
    }
  };

  const markSelectedAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) =>
        selectedIds.includes(n.id) ? { ...n, isRead: true } : n,
      ),
    );
    setSelectedIds([]);
  };

  const deleteSelected = () => {
    setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
    setSelectedIds([]);
  };

  const toggleSingleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n)),
    );
  };

  const deleteSingle = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const displayedNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    return true;
  });

  return (
    <div className="w-full min-h-[calc(100vh-10rem)] flex flex-col p-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/60">
        <div className="lg:hidden">
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Notifications Center
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your real-time campus assets, system status updates, and
            match matrices.
          </p>
        </div>

        {/* View Filter Toggles */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-200/50 rounded-xl self-start sm:self-center">
          <button
            onClick={() => {
              setFilter("all");
              setSelectedIds([]);
            }}
            className={`cursor-pointer px-4 py-2 text-sm font-bold tracking-wide rounded-lg transition-all ${
              filter === "all"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            All Logs ({notifications.length})
          </button>
          <button
            onClick={() => {
              setFilter("unread");
              setSelectedIds([]);
            }}
            className={`cursor-pointer px-4 py-2 text-sm font-bold tracking-wide rounded-lg transition-all ${
              filter === "unread"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Unread ({notifications.filter((n) => !n.isRead).length})
          </button>
        </div>
      </div>

      {/* Action Track */}
      {displayedNotifications.length > 0 && (
        <div className="flex items-center justify-between py-4 px-4 my-4 bg-white/60 border border-gray-100 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={
                selectedIds.length === displayedNotifications.length &&
                displayedNotifications.length > 0
              }
              onChange={() => handleSelectAllToggle(displayedNotifications)}
              className="cursor-pointer w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer accent-[#4A151B]"
            />
            <span className="text-sm font-bold tracking-wide text-gray-600 select-none">
              {selectedIds.length > 0
                ? `${selectedIds.length} Checked Items`
                : "Select All Items"}
            </span>
          </div>

          <div
            className={`flex items-center gap-4 transition-all duration-300 ${
              selectedIds.length > 0
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4 pointer-events-none"
            }`}
          >
            <button
              onClick={markSelectedAsRead}
              className="cursor-pointer px-3 py-1.5 text-sm font-bold tracking-wide text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all"
            >
              Mark Read
            </button>
            <button
              onClick={deleteSelected}
              className="cursor-pointer px-3 py-1.5 text-sm font-bold tracking-wide text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 transition-all"
            >
              Delete Selects
            </button>
          </div>
        </div>
      )}

      {/* Notif List Container */}
      <div className="flex-1 flex flex-col bg-white border border-gray-200/80 rounded-2xl shadow-sm mt-2">
        <div className="flex-1 rounded-2xl divide-y divide-gray-100">
          {displayedNotifications.length > 0 ? (
            displayedNotifications.map((ntf, idx, arr) => (
              <div
                key={ntf.id}
                className={`grid grid-cols-[auto_1fr_auto] items-center gap-4 p-6 transition-colors relative group 
                  ${!ntf.isRead ? "bg-amber-50/20" : "hover:bg-gray-50/50"}
                  ${idx === 0 ? "rounded-t-2xl" : ""}
                  ${idx === arr.length - 1 ? "rounded-b-2xl" : ""}
                `}
              >
                {!ntf.isRead && (
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-[3px] bg-amber-600 ${idx === 0 ? "rounded-tl-2xl" : ""} ${idx === arr.length - 1 ? "rounded-bl-2xl" : ""}`}
                  />
                )}

                {/* Left Section: Checkbox + Icon */}
                <div className="flex items-center gap-4 shrink-0">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(ntf.id)}
                    onChange={() => handleSelectToggle(ntf.id)}
                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer accent-[#4A151B]"
                  />
                  <div className="hidden sm:block">
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-inner ${
                        ntf.type === "match"
                          ? "bg-green-50 border-green-100 text-green-600"
                          : ntf.type === "security"
                            ? "bg-red-50 border-red-100 text-red-600"
                            : ntf.type === "system"
                              ? "bg-blue-50 border-blue-100 text-blue-600"
                              : "bg-gray-50 border-gray-100 text-gray-600"
                      }`}
                    >
                      {getNotificationIcon(ntf.type)}
                    </div>
                  </div>
                </div>

                <div className="min-w-0 flex flex-col justify-center gap-1">
                  {/* Row 1: Title */}
                  <div className="grid grid-cols-[1fr_auto] items-baseline gap-4 w-full">
                    <h2
                      className={`text-base tracking-wide text-gray-900 truncate ${!ntf.isRead ? "font-black" : "font-semibold"}`}
                    >
                      {ntf.title}
                    </h2>
                  </div>

                  {/* Row 2: Description */}
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pr-2 break-words whitespace-normal">
                    {ntf.message}
                  </p>

                  {/* Row 3: Time */}
                  <span className="text-[11px] font-medium text-gray-400 shrink-0 whitespace-nowrap">
                    {ntf.time}
                  </span>
                </div>

                {/* Right Section: Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Mark Read/Unread */}
                  <div className="relative group/tip flex flex-col items-center">
                    <span className="absolute bottom-full mb-2 pointer-events-none opacity-0 group-hover/tip:opacity-100 transition-all duration-200 bg-gray-900 text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded shadow-md whitespace-nowrap z-30 translate-y-1 group-hover/tip:translate-y-0">
                      {ntf.isRead ? "Mark as Unread" : "Mark as Read"}
                    </span>
                    <button
                      onClick={() => toggleSingleRead(ntf.id)}
                      className="cursor-pointer p-2 text-orange-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all"
                    >
                      {ntf.isRead ? (
                        <MailOpen className="w-5 h-5 stroke-[2.15]" />
                      ) : (
                        <Mail className="w-5 h-5 stroke-[2.15]" />
                      )}
                    </button>
                  </div>

                  {/* Delete */}
                  <div className="relative group/tip flex flex-col items-center">
                    <span className="absolute bottom-full mb-2 pointer-events-none opacity-0 group-hover/tip:opacity-100 transition-all duration-200 bg-red-600 text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded shadow-md whitespace-nowrap z-30 translate-y-1 group-hover/tip:translate-y-0">
                      Delete Notification
                    </span>
                    <button
                      onClick={() => deleteSingle(ntf.id)}
                      className="cursor-pointer p-2 text-orange-700 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-5 h-5 stroke-[2.25]" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 my-auto">
              <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[#63321A]/50 shadow-inner mb-4">
                <Bell className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="font-bold text-lg tracking-wide text-[#63321A]">
                No logs discovered
              </h3>
              <p className="text-sm text-gray-600 max-w-xs mt-1">
                Your console parameters are completely clear. No action matrices
                require attention right now.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getNotificationIcon(type) {
  switch (type) {
    case "match":
      return <CheckSquare className="w-5 h-5 stroke-[2.25]" />;
    case "security":
      return <ShieldAlert className="w-5 h-5 stroke-[2.25]" />;
    case "system":
      return <Zap className="w-5 h-5 stroke-[2.25]" />;
    default:
      return <Bell className="w-5 h-5 stroke-[2.25]" />;
  }
}