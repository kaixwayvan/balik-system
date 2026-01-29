import { useState } from "react";
import {
  CheckCircle,
  FileText,
  XCircle,
  User,
  Edit,
  Search,
  Handshake,
} from "lucide-react";

const historyData = [
  {
    id: 1,
    time: "1:26 PM",
    date: "December 9, 2025",
    title: "Found Laptop",
    description: "Verified by admin",
    category: "found",
    status: "success",
  },
  {
    id: 2,
    time: "10:48 AM",
    date: "December 6, 2025",
    title: "Submitted a Report",
    description: "Status: Under Review",
    category: "submitted",
    status: "info",
  },
  {
    id: 3,
    time: "9:08 AM",
    date: "November 21, 2025",
    title: "Recovered Lost Phone",
    description: "Claim comment",
    category: "claims",
    status: "file",
  },
  {
    id: 4,
    time: "6:38 PM",
    date: "November 8, 2025",
    title: "Claim Rejected",
    description: "Please provide more details",
    category: "rejected",
    status: "error",
  },
  {
    id: 5,
    time: "10:48 AM",
    date: "October 29, 2025",
    title: "Email Updated",
    description: "Change of email from user@example.com",
    category: "account",
    status: "neutral",
  },
  {
    id: 6,
    time: "5:52 PM",
    date: "October 20, 2025",
    title: "Edited a Report",
    description: "Verified by admin",
    category: "reported",
    status: "edit",
  },
];

const statusStyles = {
  success: { icon: CheckCircle, color: "bg-green-500" },
  file: { icon: Handshake, color: "bg-[#dbaf83]" },
  info: { icon: FileText, color: "bg-blue-500" },
  error: { icon: XCircle, color: "bg-red-500" },
  neutral: { icon: User, color: "bg-gray-400" },
  edit: { icon: Edit, color: "bg-purple-500" },
};

export default function ActivityHistory() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredHistory = historyData.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "All" || item.category === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 bg-[#EEF1FA] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">View History</h1>
        <p className="text-gray-500 text-sm mb-6">
          Review all reports, claims, and activity in one place.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        <select className="px-4 py-2 border border-slate-400  rounded-lg text-sm">
          <option>Newest</option>
          <option>Oldest</option>
        </select>

        <select
          className="px-4 py-2 border border-slate-400  rounded-lg text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="claims">Claims</option>
          <option value="found">Found</option>
          <option value="reported">Reported</option>
          <option value="submitted">Submitted</option>
          <option value="rejected">Rejected</option>
          <option value="account">Account</option>
        </select>

        <div className="relative flex-1 min-w-[250px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search Activity..."
            className="w-full pl-9 pr-4 py-2 border border-slate-400 rounded-lg text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative space-y-6">
        {filteredHistory.map((item, index) => {
          const Icon = statusStyles[item.status].icon;
          const color = statusStyles[item.status].color;

          return (
            <div key={item.id} className="relative flex gap-6">
              {index !== filteredHistory.length - 1 && (
                <div
                  className="absolute left-[22px] top-[55px] bottom-[-18px] rounded-full w-[2px] bg-gray-300"
                />
              )}

              {/* Left timeline */}
              <div className="flex flex-col items-center w-16">
                <span className="text-xs font-semibold text-gray-400 mb-2">{item.time}</span>

                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${color} relative z-10`}
                >
                  <Icon size={18} />
                </div>
              </div>

              {/* Card */}
              <div className="bg-white rounded-lg p-4 shadow-sm w-full">
                <h3 className="text-sm font-medium">
                  {item.date} &nbsp;·&nbsp; {item.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-8">
        <button className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100">
          →
        </button>
      </div>
    </div>
  );
}
