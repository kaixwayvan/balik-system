import { useState } from "react";
import {
  Search,
  MapPin,
  Files,
  CheckCircle,
  FileBadge,
  Calendar,
  Edit,
  Trash2,
  ClockFading,
} from "lucide-react";

const typeStyles = {
  Lost: "bg-red-200 text-red-600",
  Found: "bg-green-200 text-green-600",
  Resolved: "bg-blue-200 text-blue-600",
};

const statusStyles = {
  "Report Submitted": "bg-gray-200 text-gray-700 border border-gray-400",
  "Under Review": "bg-red-400 text-white border border-red-600",
  "Waiting for Matches": "bg-blue-200 text-blue-900 border border-blue-300",
  "Potential Matches Found":
    "bg-yellow-500 text-white border border-yellow-600",
  "Match Found": "bg-green-500 text-white border border-green-700",
  "Report Submission Approved":
    "bg-green-700 text-white border border-green-400",
  "Successfully Claimed": "bg-green-700 text-white border border-green-400",
};

export default function TrackItems() {
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    category: "",
    location: "",
    date: "",
  });

  const [items, setItems] = useState([
    {
      id: "ITEM - 10137",
      category: "Electronics - Camera",
      location: "PUP-Main Library",
      date: "2025 - 09 - 10",
      time: "1 hour ago",
      type: "Lost",
      status: "Report Submitted",
    },
    {
      id: "ITEM - 20146",
      category: "Personal Belongings - ID",
      location: "PUP-ITech Lab 105",
      date: "2025 - 09 - 10",
      time: "1 hour ago",
      type: "Found",
      status: "Under Review",
    },
    {
      id: "ITEM - 30146",
      category: "Personal Belongings - Green card holder",
      location: "PUP-Lagoon",
      date: "2025 - 09 - 10",
      time: "1 hour ago",
      type: "Found",
      status: "Potential Matches Found",
    },
    {
      id: "ITEM - 4625",
      category: "Electronics - Camera",
      location: "PUP-CEA",
      date: "2025 - 09 - 10",
      time: "1 hour ago",
      type: "Lost",
      status: "Waiting for Matches",
    },
    {
      id: "ITEM - 50784",
      category: "Personal Belongings - ID",
      location: "PUP-COC",
      date: "2025 - 09 - 10",
      time: "1 hour ago",
      type: "Found",
      status: "Report Submission Approved",
    },
  ]);

  const filteredItems = items.filter((item) => {
    if (filter === "All") return true;
    return item.type === filter;
  });

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditFormData({
      category: item.category,
      location: item.location,
      date: item.date,
    });
  };

  const handleSaveEdit = () => {
    // Update the item in the items array
    setItems(
      items.map((item) =>
        item.id === editingId
          ? {
              ...item,
              category: editFormData.category,
              location: editFormData.location,
              date: editFormData.date,
            }
          : item
      )
    );
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({
      category: "",
      location: "",
      date: "",
    });
  };

  return (
    <div className="flex min-h-screen bg-[#EEF1F8]">
      {/* MAIN CONTENT */}
      <main className="flex-1">
        {/* CONTENT */}
        <section className="p-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Item Tracking Overview
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Track all your reported lost and found items in one place
          </p>

          {/* STATS */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <StatCard
              color="bg-purple-500"
              title="Total Items"
              subtitle="All reported items"
              value="6"
              icon={Files}
            />
            <StatCard
              color="bg-red-500"
              title="Lost Items"
              subtitle="Currently lost"
              value="3"
              icon={Search}
            />
            <StatCard
              color="bg-green-700"
              title="Found Items"
              subtitle="Recovered items"
              value="3"
              icon={FileBadge}
            />
            <StatCard
              color="bg-green-500"
              title="Resolved"
              subtitle="Items claimed"
              value="2"
              icon={CheckCircle}
            />
          </div>

          {/* TIMELINE */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Recent Activity Timeline</h3>

            <div className="mb-6 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label htmlFor="filter">Filter: </label>
                <select
                  name="filter"
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-32 border border-slate-300 rounded-lg bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="All">All</option>
                  <option value="Lost">Lost</option>
                  <option value="Found">Found</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <Search size={18} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search items..."
                  className="border-none bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div className="space-y-5">
              {filteredItems.map((item) => (
                <TimelineItem key={item.id} {...item} onEditClick={handleEditClick} />
              ))}
            </div>
          </div>
        </section>

        {/* EDIT MODAL */}
        {editingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 relative mx-4 shadow-xl">
              <button
                onClick={handleCancelEdit}
                className="cursor-pointer absolute top-3 right-3 text-gray-600 text-2xl hover:text-gray-800"
              >
                ×
              </button>

              <h3 className="text-2xl font-bold mb-4">Edit Item Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editFormData.category}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        category: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        location: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editFormData.date}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        date: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    style={{
                      colorScheme: "light",
                      fontSize: "16px",
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCancelEdit}
                  className="cursor-pointer flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="cursor-pointer flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ color, title, subtitle, value, icon: Icon }) {
  return (
    <div
      className={`${color} flex items-center justify-between rounded-xl p-4 text-white shadow transform transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg`}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-white" />
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs opacity-80">{subtitle}</p>
        </div>
      </div>

      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function TimelineItem({ id, category, location, date, time, type, status, onEditClick }) {
  const typeClass = typeStyles[type] || "bg-gray-200 text-gray-700";
  const statusClass = statusStyles[status] || "bg-gray-200 text-gray-700";

  return (
    <div className="flex items-center gap-4 border border-gray-300 rounded-xl p-4 shadow-md">
      <div className="w-20 h-20 bg-gray-200 rounded-lg" />

      <div className="flex-1">
        <h4 className="font-bold">{id}</h4>
        <p className="mb-1 text-sm text-gray-800">{category}</p>

        <div className="flex items-center gap-1 mb-2">
          <MapPin size={12} className="text-gray-600" />
          <p className="text-xs text-gray-600">{location}</p>
        </div>

        <div className="flex items-center gap-1 mb-5">
          <Calendar size={12} className="text-gray-600" />
          <p className="text-xs text-gray-600">{date}</p>
        </div>

        <div className="flex items-center gap-2">
          <ClockFading size={12} className="text-gray-600" />
          <p className="text-xs text-gray-600">{time}</p>

          <div className={`px-3 py-1 rounded-lg ${typeClass}`}>
            <p className="text-xs font-bold leading-none">{type} Item</p>
          </div>
        </div>
      </div>

      <span
        className={`text-xs font-bold px-3 py-1 rounded-full ${statusClass}`}
      >
        {status}
      </span>

      <div className="flex gap-2">
        <button onClick={() => onEditClick({ id, category, location, date, time, type, status })} className="cursor-pointer bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
          <Edit size={16} />
        </button>
        <button className="cursor-pointer bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
