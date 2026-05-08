import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { Search, Filter, RefreshCw, Eye, X } from "lucide-react";

const PAGE_SIZE = 9;

function buildActivities(items, claims) {
  const activities = [];

  items.forEach((item) => {
    const actor = item.profiles?.full_name || "User";
    const role = item.profiles?.role || "User";
    const isAdmin = role === "admin";

    activities.push({
      id: `item-${item.id}`,
      date: item.created_at,
      actor: isAdmin ? "Admin" : "User",
      role: isAdmin ? "Admin" : "User",
      activity: item.type === "found" ? "Reported found item" : "Reported lost item",
      target: item.type === "found" ? "Found Item" : "Lost Item",

      detail: item,
    });

    if (item.status === "resolved") {
      activities.push({
        id: `item-resolved-${item.id}`,
        date: item.created_at,
        actor: "Admin",
        role: "Admin",
        activity: "Marked item resolved",
        target: "Report",

        detail: item,
      });
    }
  });

  claims.forEach((claim) => {
    const actor = claim.profiles?.full_name || "User";
    const role = claim.profiles?.role || "User";

    activities.push({
      id: `claim-${claim.id}`,
      date: claim.created_at,
      actor: "User",
      role: "User",
      activity: "Submitted claim",
      target: "Claim",

      detail: claim,
    });

    if (claim.status === "approved") {
      activities.push({
        id: `claim-approved-${claim.id}`,
        date: claim.created_at,
        actor: "Admin",
        role: "Admin",
        activity: "Approved found item",
        target: "Claim",

        detail: claim,
      });
    } else if (claim.status === "rejected") {
      activities.push({
        id: `claim-rejected-${claim.id}`,
        date: claim.created_at,
        actor: "Admin",
        role: "Admin",
        activity: "Rejected claim",
        target: "Claim",

        detail: claim,
      });
    }
  });

  // Sort newest first
  return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function DetailModal({ activity, onClose }) {
  if (!activity) return null;
  const d = activity.detail;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Detail</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500 font-medium">Activity</span>
            <span className="text-gray-800 font-semibold">{activity.activity}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500 font-medium">Actor</span>
            <span className="text-gray-800 font-semibold">{activity.actor}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500 font-medium">Target</span>
            <span className="text-gray-800 font-semibold">{activity.target}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500 font-medium">Date & Time</span>
            <span className="text-gray-800 font-semibold">
              {new Date(activity.date).toLocaleString()}
            </span>
          </div>

          {d?.title && (
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500 font-medium">Item</span>
              <span className="text-gray-800 font-semibold">{d.title}</span>
            </div>
          )}
          {d?.status && (
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500 font-medium">Status</span>
              <span className={`font-semibold capitalize ${
                d.status === "approved" ? "text-green-600" :
                d.status === "rejected" ? "text-red-600" :
                d.status === "resolved" ? "text-blue-600" : "text-gray-700"
              }`}>{d.status}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ActivityLog() {
  const [allActivities, setAllActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const fetchData = useCallback(async () => {
    // Only show loading spinner on initial load (no data yet)
    if (allActivities.length === 0) setLoading(true);
    try {
      const [{ data: items }, { data: claims }] = await Promise.all([
        supabase
          .from("items")
          .select("*, profiles(full_name, role)")
          .order("created_at", { ascending: false }),
        supabase
          .from("item_claims")
          .select("*, profiles(full_name, role)")
          .order("created_at", { ascending: false }),
      ]);

      const built = buildActivities(items || [], claims || []);
      setAllActivities(built);
    } catch (err) {
      console.error("Error fetching activity log:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter
  const filtered = allActivities.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      a.actor.toLowerCase().includes(q) ||
      a.activity.toLowerCase().includes(q) ||
      a.target.toLowerCase().includes(q);
    const matchRole =
      roleFilter === "All Roles" || a.role === roleFilter;
    return matchSearch && matchRole;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleRoleFilter = (val) => {
    setRoleFilter(val);
    setPage(1);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" }),
      time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    };
  };

  return (
    <div className="p-8 min-h-screen bg-[#EEF1F8]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 border border-gray-300 bg-white rounded-full px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search actor, activity, target"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <div className="relative min-w-[180px]">
            <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => handleRoleFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-200 appearance-none bg-white"
            >
              <option>All Roles</option>
              <option>Admin</option>
              <option>User</option>
              <option>Officer</option>
            </select>
          </div>
          <span className="text-sm text-gray-500 ml-auto font-medium">
            Showing {filtered.length} {filtered.length === 1 ? "activity" : "activities"}
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-9 h-9 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-400 text-sm font-medium">Loading activity log...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="font-medium">No activities found.</p>
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 font-semibold border-b border-gray-100">
                  <th className="pb-3 pr-4 w-52">Date &amp; Time</th>
                  <th className="pb-3 pr-4">Actor</th>
                  <th className="pb-3 pr-4">Activity</th>
                  <th className="pb-3 pr-4">Target</th>

                  <th className="pb-3 text-center">View</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((a) => {
                  const { date, time } = formatDate(a.date);
                  return (
                    <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 pr-4 text-gray-700">
                        <span>{date}</span>
                        <span className="ml-3 text-gray-400">{time}</span>
                      </td>
                      <td className="py-3.5 pr-4 text-gray-700 font-medium">{a.actor}</td>
                      <td className="py-3.5 pr-4 text-gray-700">{a.activity}</td>
                      <td className="py-3.5 pr-4 text-gray-600">{a.target}</td>

                      <td className="py-3.5 text-center">
                        <button
                          onClick={() => setSelected(a)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selected && <DetailModal activity={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
