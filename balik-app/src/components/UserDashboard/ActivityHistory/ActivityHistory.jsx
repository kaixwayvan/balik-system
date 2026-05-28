import { useState, useEffect } from "react";
import {
  CheckCircle,
  FileText,
  XCircle,
  User,
  Edit,
  Search,
  Handshake,
  History,
  Calendar,
} from "lucide-react";

/* Mock Auth State */
const MOCK_USER = {
  id: "mock-user-789",
  created_at: "2026-02-14T08:00:00.000Z", 
};

const useAuth = () => {
  return {
    user: MOCK_USER,
  };
};

/* Mock Supabase */
const supabase = {
  from: (tableName) => ({
    select: (fields) => ({
      eq: (columnName, value) => {
        if (tableName === "items") {
          return Promise.resolve({
            data: [
              {
                id: "item-001",
                created_at: "2026-05-28T14:30:00.000Z",
                type: "found",
                category: "Electronics",
                title: "iPhone 14 Pro Max",
                location: "Engineering Lab Room 302",
              },
              {
                id: "item-002",
                created_at: "2026-05-26T09:15:00.000Z",
                type: "lost",
                category: "Valuables",
                title: "Brown Leather Ridge Wallet",
                location: "Student Gym Locker Area",
              },
            ],
            error: null,
          });
        }
        if (tableName === "item_claims") {
          return Promise.resolve({
            data: [
              {
                id: "claim-001",
                item_id: "claimed-item-abc",
                created_at: "2026-05-27T11:20:00.000Z",
                status: "approved",
              },
              {
                id: "claim-002",
                item_id: "claimed-item-xyz",
                created_at: "2026-05-25T16:45:00.000Z",
                status: "pending",
              },
              {
                id: "claim-003",
                item_id: "claimed-item-123",
                created_at: "2026-05-24T10:00:00.000Z",
                status: "rejected",
              },
            ],
            error: null,
          });
        }
        return Promise.resolve({ data: [], error: null });
      },
      in: (columnName, idArray) => {
        if (tableName === "items") {
          return Promise.resolve({
            data: [
              { id: "claimed-item-abc", title: "Sony WH-1000XM4 Headphones" },
              { id: "claimed-item-xyz", title: "Hydro Flask Black Bottle" },
              { id: "claimed-item-123", title: "Silver Casio Vintage Watch" },
            ],
            error: null,
          });
        }
        return Promise.resolve({ data: [], error: null });
      },
    }),
  }),
};

/* Status Styles */
const statusStyles = {
  success: {
    icon: CheckCircle,
    grad: "from-emerald-400 to-teal-500",
    glow: "shadow-emerald-500/20",
  },
  file: {
    icon: Handshake,
    grad: "from-amber-400 to-orange-500",
    glow: "shadow-orange-500/20",
  },
  info: {
    icon: FileText,
    grad: "from-blue-400 to-indigo-500",
    glow: "shadow-blue-500/20",
  },
  error: {
    icon: XCircle,
    grad: "from-rose-400 to-red-500",
    glow: "shadow-red-500/20",
  },
  neutral: {
    icon: User,
    grad: "from-slate-400 to-slate-600",
    glow: "shadow-slate-500/20",
  },
  edit: {
    icon: Edit,
    grad: "from-purple-400 to-violet-500",
    glow: "shadow-purple-500/20",
  },
};

export default function ActivityHistory() {
  useEffect(() => {
    document.title = "Activity History - BALIK System";
    return () => {
      document.title = "BALIK System";
    };
  }, []);

  const { user } = useAuth();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Default");

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1200));

        const { data: items, error: itemsError } = await supabase
          .from("items")
          .select("*")
          .eq("user_id", user.id);

        if (itemsError) throw itemsError;

        const { data: claimsData, error: claimsError } = await supabase
          .from("item_claims")
          .select("*")
          .eq("claimer_id", user.id);

        if (claimsError) throw claimsError;

        let mappedClaims = [];
        if (claimsData && claimsData.length > 0) {
          const claimedItemIds = claimsData.map((c) => c.item_id).filter(Boolean);
          const { data: claimedItems, error: claimedItemsError } = await supabase
            .from("items")
            .select("id, title")
            .in("id", claimedItemIds);

          if (!claimedItemsError) {
            mappedClaims = claimsData.map((claim) => {
              const item = (claimedItems || []).find((i) => i.id === claim.item_id);
              return {
                id: claim.id,
                date: new Date(claim.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }),
                time: new Date(claim.created_at).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                title: `Claim Request Submitted`,
                description: `Submitted a claim for "${
                  item?.title || "Unknown Item"
                }". Current status: ${claim.status || "pending"}.`,
                status:
                  claim.status === "approved"
                    ? "success"
                    : claim.status === "rejected"
                    ? "error"
                    : "file",
                category: claim.status === "rejected" ? "rejected" : "claims",
                timestamp: new Date(claim.created_at).getTime(),
                rawTitle: item?.title || "",
              };
            });
          }
        }

        const mappedItems = (items || []).map((item) => ({
          id: item.id,
          date: new Date(item.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          time: new Date(item.created_at).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          title: `${item.type === "lost" ? "Lost" : "Found"} Item Reported`,
          description: `You reported a ${item.type} ${item.category}: "${item.title}" at ${item.location}.`,
          status: item.type === "lost" ? "error" : "success",
          category: item.type === "lost" ? "reported" : "found",
          timestamp: new Date(item.created_at).getTime(),
          rawTitle: item.title,
        }));

        const accountCreated = {
          id: "account-creation",
          date: new Date(user.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          time: new Date(user.created_at).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          title: `Account Created`,
          description: `Welcome to BALIK! Your account has been successfully initialized.`,
          status: "neutral",
          category: "account",
          timestamp: new Date(user.created_at).getTime(),
          rawTitle: "Account Created",
        };

        const combined = [...mappedItems, ...mappedClaims, accountCreated];
        setHistoryData(combined);
      } catch (err) {
        console.error("Error fetching activity history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user?.id, user?.created_at]);

  const filteredHistory = historyData
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.rawTitle?.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "All" || item.category === filter.toLowerCase();

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "Oldest") return a.timestamp - b.timestamp;
      return b.timestamp - a.timestamp;
    });

  return (
    <div className="p-8 sm:p-8 md:p-8 bg-[#F9F6F0] min-h-screen transition-all duration-300 antialiased relative">
      
      {/* Animation */}
      <style>{`
        @keyframes softFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-soft-fade-in {
          animation: softFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      <div className="w-full mx-auto flex flex-col">
        
        {/* Hidden Header for large screens */}
        <div className="lg:hidden animate-fade-in-up mb-6">
          <h1 className="text-3xl font-black tracking-tight text-[#66240E]">
            Activity History
          </h1>
          <p className="mt-1.5 text-sm font-semibold text-[#997C68] leading-relaxed">
            Review all reports, claims, and activity in one place.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 w-full">
          {/* Search Input */}
          <div className="flex-1 flex items-center gap-2 rounded-3xl border border-[#E2DCD0] bg-white px-4 py-3.5 shadow-sm transition-all duration-200 focus-within:border-[#2C4A52] focus-within:ring-4 focus-within:ring-[#2C4A52]/10">
            <Search size={18} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search activity records..."
              className="w-full border-none bg-transparent text-sm outline-none text-slate-800 placeholder-slate-400 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-3 w-full md:w-auto">
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label htmlFor="filter" className="text-sm font-semibold text-slate-500 whitespace-nowrap hidden lg:block">
                Type:
              </label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full sm:w-[150px] appearance-none border border-[#E2DCD0] rounded-3xl bg-white px-4 py-3.5 text-sm font-medium text-slate-700 outline-none focus:border-[#DBC8BD] focus:ring-4 focus:ring-[#DBC8BD]/30 cursor-pointer shadow-sm transition-all duration-200 
                bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] 
                bg-[position:right_12px_center] bg-[length:16px_16px] pr-10"
              >
                <option value="All" disabled hidden>Select a Type...</option>
                <option value="claims">Claims</option>
                <option value="found">Found Items</option>
                <option value="reported">Lost Reports</option>
                <option value="rejected">Rejected</option>
                <option value="account">Account</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label htmlFor="sortBy" className="text-sm font-semibold text-slate-500 whitespace-nowrap hidden lg:block">
                Sort:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-[150px] appearance-none border border-[#E2DCD0] rounded-3xl bg-white px-4 py-3.5 text-sm font-medium text-slate-700 outline-none focus:border-[#DBC8BD] focus:ring-4 focus:ring-[#DBC8BD]/30 cursor-pointer shadow-sm transition-all duration-200 
                bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] 
                bg-[position:right_12px_center] bg-[length:16px_16px] pr-10"
              >
                <option value="Default" disabled hidden>Sort By...</option>
                <option value="Newest">Newest First</option>
                <option value="Oldest">Oldest First</option>
              </select>
            </div>

          </div>
        </div>

        {/* Timeline Layout */}
        <div className="relative flex flex-col w-full min-h-[400px]">
          {loading ? (
            <div className="bg-white rounded-4xl shadow-sm border border-[#E2DCD0] p-8 py-20 sm:py-20 sm:p-12 text-center animate-pulse">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00306B] mx-auto mb-4"></div>
              <p className="text-slate-500 font-medium">
                Fetching your activity logs securely...
              </p>
            </div>
          ) : (
            <div className="animate-soft-fade-in w-full flex flex-col">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item, index) => {
                  const statusStyle = statusStyles[item.status] || statusStyles.neutral;
                  const Icon = statusStyle.icon;

                  return (
                    <div key={item.id} className="relative flex gap-4 sm:gap-6 group pb-10 last:pb-2">
                      {/* Vertical Connecting Line */}
                      {index !== filteredHistory.length - 1 && (
                        <div className="absolute left-[32px] sm:left-[38px] md:left-[38px] top-[82px] sm:top-[74.5px] bottom-0 w-[2px] bg-gradient-to-b from-[#E2DCD0] via-[#E2DCD0] to-transparent z-0" />
                      )}

                      {/* Left Column: Time & Icon Axis */}
                      <div className="flex flex-col items-center w-20 sm:w-24 shrink-0 relative z-10 pt-1">
                        <span className="text-[10px] sm:text-[10px] font-black text-orange-900/50 mb-2.5 tracking-tight uppercase">
                          {item.time}
                        </span>
                        <div
                          className={`w-14 h-14 sm:w-13 sm:h-13 rounded-[2rem] bg-gradient-to-br ${statusStyle.grad} flex items-center justify-center shadow-lg ${statusStyle.glow} transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl`}
                        >
                          <Icon size={22} className="text-white" strokeWidth={2.5} />
                        </div>
                      </div>

                      {/* Right Column: Content Card */}
                      <div className="flex-1 bg-white rounded-4xl sm:rounded-[2.25rem] p-5 sm:p-6 shadow-sm border border-[#E2DCD0] hover:shadow-lg hover:border-[#DBC8BD]/80 transition-all duration-300 transform group-hover:-translate-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight uppercase">
                            {item.title}
                          </h3>

                          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F9F6F0] border border-[#E2DCD0] rounded-full">
                            <Calendar size={12} className="text-[#997C68]" />
                            <span className="text-[10px] sm:text-xs font-bold text-[#66240E] uppercase tracking-wide">
                              {item.date}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white rounded-3xl p-16 text-center border border-[#E2DCD0] shadow-sm">
                  <div className="w-16 h-16 bg-[#F9F6F0] rounded-2xl flex items-center justify-center mx-auto mb-5 border border-[#E2DCD0]">
                    <History size={28} className="text-[#997C68]" />
                  </div>
                  <h4 className="text-lg font-bold text-[#66240E] mb-1.5">No activity logged</h4>
                  <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto">
                    We couldn't find any activity records matching your current filters. Your reports and claims will appear here.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}