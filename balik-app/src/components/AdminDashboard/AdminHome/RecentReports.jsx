import { useState } from "react";
import { Search } from "lucide-react";

export default function RecentReports() {
  const [filter, setFilter] = useState("All");

  const items = [
    {
      date: "Nov 12, 2024",
      time: "10:30 AM",
      item: "Blue Water Bottle",
      description: "Stainless steel, university logo sticker",
      location: "University Library",
      name: "Michael Chue",
      email: "mchen@gluoglu.com",
      contact: "(555) 123-4567",
      status: "Verified",
      qrStat: "Scanned",
      aiMatch: "95% Match",
      type: "Found",
    },
    {
      date: "Nov 10, 2024",
      time: "4:30 PM",
      item: "Black Wallet",
      description: "contains student ID and credit cards",
      location: "Cafeteria",
      name: "John Cruz",
      email: "djmod@sophia.com",
      contact: "(911) 123-4567",
      status: "Pending",
      qrStat: "Not Scanned",
      aiMatch: "80% Match",
      type: "Lost",
    },
  ];

  const typeStyles = (type) => {
    if (type === "Lost") return "bg-red-100 text-red-600";
    if (type === "Found") return "bg-green-100 text-green-600";
  };

  const statusStyles = (status) => {
    if (status === "Verified") return "bg-green-100 text-green-600";
    if (status === "Pending") return "bg-yellow-100 text-yellow-600";
    if (status === "Resolved") return "bg-blue-100 text-blue-600";
  };

  const qrStyles = (qr) => {
    if (qr === "Scanned") return "bg-green-100 text-green-600";
    if (qr === "Not Scanned") return "bg-gray-100 text-gray-600";
  };

  const aiStyles = (match) => {
    if (match === "No Match") return "bg-red-100 text-red-600";
    if (match === "Match") return "bg-green-100 text-green-600";
    if (match.includes("%")) return "bg-purple-100 text-purple-600";
  };

  const filteredItems = items.filter((item) => {
    if (filter === "All") return true;
    return item.status === filter;
  });

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex justify-between mb-4">
        <h2 className="font-semibold text-lg">Recent Reports</h2>

        <div className="flex gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-slate-500 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <Search size={18} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search items..."
              className="w-full border-none bg-transparent text-sm outline-none"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-32 border border-slate-500 rounded-xl bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="All">All Status</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>

          <button className="cursor-pointer bg-blue-600 hover:bg-blue-800 text-white px-6 rounded-xl text-sm">
            NLP Match
          </button>
        </div>
      </div>

      <table className="w-full text-sm text-left">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="py-3 px-4">Date</th>
            <th className="px-4">Item</th>
            <th className="px-4">Type</th>
            <th className="px-4">Location</th>
            <th className="px-4">Name</th>
            <th className="px-4">Contact Info</th>
            <th className="px-4">Status</th>
            <th className="px-4">QR Status</th>
            <th className="px-4">AI Match</th>
            <th className="px-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredItems.map((item, index) => (
            <tr
              key={index}
              className="border-b align-top hover:bg-gray-50 transition"
            >
              <td className="py-4 px-4">{item.date}</td>

              <td className="py-4 px-4">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-sm">{item.item}</span>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </td>

              <td className="py-4 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${typeStyles(
                    item.type
                  )}`}
                >
                  {item.type}
                </span>
              </td>

              <td className="py-4 px-4">{item.location}</td>

              <td className="py-4 px-4">{item.name}</td>

              <td className="py-4 px-4">
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-sm">{item.email}</p>
                  <p className="text-xs text-gray-500">{item.contact}</p>
                </div>
              </td>

              <td className="py-4 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${statusStyles(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </td>

              <td className="py-4 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${qrStyles(
                    item.qrStat
                  )}`}
                >
                  {item.qrStat}
                </span>
              </td>

              <td className="py-4 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${aiStyles(
                    item.aiMatch
                  )}`}
                >
                  {item.aiMatch}
                </span>
              </td>

              <td className="py-4 px-4 text-blue-600 cursor-pointer hover:underline">
                View
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}