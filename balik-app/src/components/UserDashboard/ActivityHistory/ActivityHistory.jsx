import { useState, useEffect } from "react";
import {
  CheckCircle,
  FileText,
  XCircle,
  User,
  Edit,
  Search,
  Handshake,
} from "lucide-react";
import { itemService } from "../../../services/itemService";
import { useAuth } from "../../../shared/context/AuthContext";

const statusStyles = {
  success: { icon: CheckCircle, color: "bg-green-500" },
  file: { icon: Handshake, color: "bg-[#dbaf83]" },
  info: { icon: FileText, color: "bg-blue-500" },
  error: { icon: XCircle, color: "bg-red-500" },
  neutral: { icon: User, color: "bg-gray-400" },
  edit: { icon: Edit, color: "bg-purple-500" },
};

export default function ActivityHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function fetchHistory() {
      if (!user?.id) return;
      try {
        setLoading(true);
        const data = await itemService.getUserHistory(user.id);
        
        // Map Supabase data to history format
        const mappedHistory = data.map(item => {
          const dateObj = new Date(item.created_at);
          return {
            id: item.id,
            time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: dateObj.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' }),
            title: item.title,
            description: item.status === 'pending' ? "Currently under review" : `Status: ${item.status}`,
            category: item.type === 'found' ? "found" : "submitted",
            status: item.status === 'resolved' ? "success" : (item.status === 'pending' ? "info" : "neutral"),
          };
        });

        setHistory(mappedHistory);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [user]);

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "All" || item.category === filter;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="p-8 bg-[#EEF1FA] min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading your activity history...</p>
      </div>
    );
  }

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
        <select className="px-4 py-2 border border-slate-400 rounded-lg text-sm bg-white">
          <option>Newest</option>
          <option>Oldest</option>
        </select>

        <select
          className="px-4 py-2 border border-slate-400 rounded-lg text-sm bg-white"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="found">Found Items</option>
          <option value="submitted">Lost Reports</option>
        </select>

        <div className="relative flex-1 min-w-[250px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search Activity..."
            className="w-full pl-9 pr-4 py-2 border border-slate-400 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative space-y-6">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item, index) => {
            const statusConfig = statusStyles[item.status] || statusStyles.neutral;
            const Icon = statusConfig.icon;
            const color = statusConfig.color;

            return (
              <div key={item.id} className="relative flex gap-6">
                {index !== filteredHistory.length - 1 && (
                  <div
                    className="absolute left-[22px] top-[55px] bottom-[-18px] rounded-full w-[2px] bg-gray-300"
                  />
                )}

                {/* Left timeline */}
                <div className="flex flex-col items-center w-16 shrink-0">
                  <span className="text-[10px] font-bold text-gray-400 mb-2 uppercase">{item.time}</span>

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${color} relative z-10 shadow-sm`}
                  >
                    <Icon size={18} />
                  </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm w-full border border-slate-200/50 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold text-slate-800">
                      {item.title}
                    </h3>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.date}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{item.description}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No activity found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-8">
        <button className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors text-slate-400">
          →
        </button>
      </div>
    </div>
  );
}
