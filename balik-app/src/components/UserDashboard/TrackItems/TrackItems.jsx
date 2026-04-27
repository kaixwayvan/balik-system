import { useState, useEffect } from "react";
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
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../../../shared/context/AuthContext";
import { supabase } from "../../../utils/supabaseClient";

const typeStyles = {
  lost: "bg-red-200 text-red-600",
  found: "bg-green-200 text-green-600",
  resolved: "bg-blue-200 text-blue-600",
};

const statusStyles = {
  "pending": "bg-gray-200 text-gray-700 border border-gray-400",
  "matching": "bg-blue-200 text-blue-900 border border-blue-300",
  "resolved": "bg-green-700 text-white border border-green-400",
  "claimed": "bg-green-700 text-white border border-green-400",
};

export default function TrackItems() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("All");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "",
    location: "",
    date: "",
  });

  const fetchItems = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setItems(data);
    } catch (err) {
      console.error("Error fetching tracked items:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const stats = {
    total: items.length,
    lost: items.filter(i => i.type === 'lost').length,
    found: items.filter(i => i.type === 'found').length,
    resolved: items.filter(i => i.status === 'resolved' || i.status === 'claimed').length,
  };

  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === "All" || item.type === filter.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditFormData({
      title: item.title,
      category: item.category,
      location: item.location,
      date: item.date_found || item.date_reported,
    });
  };

  const handleSaveEdit = async () => {
    try {
      const { error: updateError } = await supabase
        .from('items')
        .update({
          title: editFormData.title,
          category: editFormData.category,
          location: editFormData.location,
          date_found: editFormData.date
        })
        .eq('id', editingId);

      if (updateError) throw updateError;

      setItems(items.map(item =>
        item.id === editingId ? { ...item, ...editFormData, title: editFormData.title, date_found: editFormData.date } : item
      ));
      setEditingId(null);
    } catch (err) {
      alert("Failed to update item: " + err.message);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      const { error: deleteError } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      alert("Failed to delete item: " + err.message);
    }
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

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
              <AlertCircle size={20} />
              <p>Failed to load items: {error}</p>
            </div>
          )}

          {/* STATS */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <StatCard
              color="bg-purple-500"
              title="Total Items"
              subtitle="All reported items"
              value={stats.total}
              icon={Files}
            />
            <StatCard
              color="bg-red-500"
              title="Lost Items"
              subtitle="Currently lost"
              value={stats.lost}
              icon={Search}
            />
            <StatCard
              color="bg-green-700"
              title="Found Items"
              subtitle="Recovered items"
              value={stats.found}
              icon={FileBadge}
            />
            <StatCard
              color="bg-green-500"
              title="Resolved"
              subtitle="Items claimed"
              value={stats.resolved}
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-none bg-transparent text-sm outline-none w-full"
                />
              </div>

              <button
                onClick={fetchItems}
                className="cursor-pointer flex items-center justify-center p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition"
              >
                <RefreshCw size={18} className={loading ? "animate-spin text-blue-600" : "text-gray-600"} />
              </button>
            </div>

            <div className="space-y-5">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TimelineItem
                    key={item.id}
                    id={item.id.substring(0, 8)}
                    category={item.category}
                    title={item.title}
                    location={item.location}
                    date={new Date(item.date_found || item.date_reported).toLocaleDateString()}
                    time={new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    type={item.type}
                    status={item.status}
                    image={item.image_url}
                    onEditClick={() => handleEditClick(item)}
                    onDeleteClick={() => handleDeleteItem(item.id)}
                  />
                ))
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium">No items found</p>
                  <p className="text-gray-400 text-sm">Your reported items will appear here for tracking.</p>
                </div>
              )}
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
                    Title
                  </label>
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        title: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  />
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

function TimelineItem({ id, title, category, location, date, time, type, status, image, onEditClick, onDeleteClick }) {
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
  const typeClass = typeStyles[type.toLowerCase()] || "bg-gray-200 text-gray-700";
  const statusClass = statusStyles[status.toLowerCase()] || "bg-gray-200 text-gray-700";
  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div className="flex items-center gap-4 border border-gray-300 rounded-xl p-4 shadow-md bg-white">
      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border flex-shrink-0">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Files size={32} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-bold text-gray-900 truncate">{title}</h4>
          <span className="text-[10px] text-gray-400 font-mono">#{id}</span>
        </div>
        <p className="mb-1 text-sm text-gray-600 italic">{category}</p>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-gray-400" />
            <p className="text-xs text-gray-600 truncate">{location}</p>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={12} className="text-gray-400" />
            <p className="text-xs text-gray-600">{date}</p>
          </div>
          <div className="flex items-center gap-1">
            <ClockFading size={12} className="text-gray-400" />
            <p className="text-xs text-gray-600">{time}</p>
          </div>
          <div className={`px-2 py-0.5 rounded text-center w-fit ${typeClass}`}>
            <p className="text-[10px] font-bold uppercase">{typeLabel}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3 h-full justify-between">
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap uppercase tracking-wider ${statusClass}`}
        >
          {displayStatus}
        </span>

        <div className="flex gap-2">
          <button onClick={onEditClick} className="cursor-pointer bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition border border-blue-100">
            <Edit size={16} />
          </button>
          <button onClick={onDeleteClick} className="cursor-pointer bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition border border-red-100">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
