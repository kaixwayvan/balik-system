import { useState, useEffect } from "react";
import {
  ClipboardList,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Package,
  TrendingUp,
  TrendingDown,
  Search,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Simulated Backend
const useAuth = () => ({
  user: { id: "mock-admin-123", role: "admin", full_name: "Admin User" },
});

const itemService = {
  logItemAction: async (data) => {
    console.log("[SIMULATION] Item action logged:", data);
    return Promise.resolve();
  },
};

const sendNotification = async (data) => {
  console.log("[SIMULATION] Notification sent:", data);
  return Promise.resolve();
};

const gamificationService = {
  processApprovedClaimMatch: async (data) => {
    console.log("[SIMULATION] Processed approved claim match:", data);
    return Promise.resolve();
  },
  checkAndRecordAchievements: async (userId) => {
    console.log("[SIMULATION] Achievements checked for user:", userId);
    return Promise.resolve();
  },
};

// Mock data to populate the dashboard
const mockClaimsData = [
  {
    id: "claim-1a2b3c4d",
    status: "pending",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    claimer_id: "user-101",
    item_id: "item-201",
    claim_details: {
      fullName: "Jane Smith",
      mobile: "0912 345 6789",
      email: "jane.smith@example.com",
      category: "Electronics",
      lostLocation: "Main Cafeteria",
      lostDate: "2026-06-15",
      description:
        "MacBook Pro 14-inch, silver, with a developer sticker on the back.",
      brand: "Apple",
      colorMaterial: "Silver Aluminum",
      uniqueMarks: "Sticker near the logo",
      lost_item_id: "lost-301",
      lostItemTitle: "MacBook Pro 14",
    },
    items: {
      id: "item-201",
      title: "Silver Laptop",
      category: "Electronics",
      location: "Cafeteria Table 3",
      image_url: null,
      status: "pending",
      user_id: "finder-001",
    },
  },
  {
    id: "claim-9x8y7z6w",
    status: "approved",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    claimer_id: "user-102",
    item_id: "item-202",
    claim_details: {
      fullName: "Mark Johnson",
      mobile: "0998 765 4321",
      email: "mark.j@example.com",
      category: "Accessories",
      lostLocation: "Library 2nd Floor",
      description: "Black Hydro Flask with a small dent at the bottom.",
    },
    items: {
      id: "item-202",
      title: "Black Water Bottle",
      category: "Accessories",
      location: "Library Restroom",
      image_url: null,
      status: "approved",
      user_id: "finder-002",
    },
  },
];

// Mock Supabase Client
const supabase = {
  from: (table) => ({
    select: (query) => ({
      order: (column, { ascending }) => {
        console.log(`[SIMULATION] Fetched data from table: ${table}`);
        return Promise.resolve({ data: mockClaimsData, error: null });
      },
    }),
    update: (updates) => ({
      eq: (column, value) => {
        console.log(`[SIMULATION] Updated table ${table}:`, updates);
        return Promise.resolve({ error: null });
      },
    }),
  }),
};

// Component Code
function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-400">
        {label}
      </span>
      <span className="text-sm sm:text-base text-slate-700 font-medium break-words">
        {value || "—"}
      </span>
    </div>
  );
}

export default function ClaimRequests() {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("item_claims")
        .select(
          `
          *,
          items!item_id (
            id, title, category, location, image_url, status, user_id
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClaims(data || []);
    } catch (err) {
      console.error("Failed to fetch claims:", err.message);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  // --- Dynamic Document Title ---
  useEffect(() => {
    document.title = `Claim Requests (${claims.length}) | BALIK Admin`;

    return () => {
      document.title = "BALIK Admin";
    };
  }, [claims.length]);
  // ------------------------------

  const updateStatus = async (claimId, newStatus) => {
    setUpdatingId(claimId);
    try {
      const { error } = await supabase
        .from("item_claims")
        .update({ status: newStatus })
        .eq("id", claimId);

      if (error) throw error;

      const updatedClaim = claims.find((c) => c.id === claimId);
      if (updatedClaim) {
        await itemService.logItemAction({
          item_id: updatedClaim.item_id,
          action_type: newStatus === "approved" ? "STATUS_CHANGE" : "REJECTED",
          actor_id: user?.id,
          description: `Admin ${newStatus} a claim request for this item.`,
          new_data: { status: newStatus, claim_id: claimId },
        });

        if (newStatus === "approved") {
          await sendNotification({
            userId: updatedClaim.claimer_id,
            title: "Claim Approved!",
            message: `Your claim request for "${updatedClaim.items?.title || "item"}" has been approved.`,
            type: "success",
          });

          const lostItemId = updatedClaim.claim_details?.lost_item_id;
          const foundItemId = updatedClaim.item_id;

          await gamificationService.processApprovedClaimMatch({
            foundItemId,
            lostItemId: lostItemId || null,
            claimerId: updatedClaim.claimer_id,
            finderId: updatedClaim.items?.user_id,
          });
        }
      }

      setClaims((prev) =>
        prev.map((c) => (c.id === claimId ? { ...c, status: newStatus } : c)),
      );
    } catch (err) {
      console.error("Failed to update claim status:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setTimeout(() => setUpdatingId(null), 500);
    }
  };

  const toggleExpand = (id) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const statsData = [
    {
      id: "pending",
      icon: Clock,
      value: claims.filter((c) => c.status === "pending").length,
      label: "Pending Claims",
      change: "+5%",
      trend: "up",
      grad: "from-amber-100 to-amber-50 border-amber-200/80 shadow-amber-900/5",
      iconCss: "text-amber-600 bg-white shadow-sm",
    },
    {
      id: "approved",
      icon: CheckCircle,
      value: claims.filter((c) => c.status === "approved").length,
      label: "Approved Claims",
      change: "+12%",
      trend: "up",
      grad: "from-emerald-100 to-emerald-50 border-emerald-200/80 shadow-emerald-900/5",
      iconCss: "text-emerald-600 bg-white shadow-sm",
    },
    {
      id: "released",
      icon: Package,
      value: claims.filter((c) => c.status === "released").length,
      label: "Released Items",
      change: "+0%",
      trend: "up",
      grad: "from-blue-100 to-blue-50 border-blue-200/80 shadow-blue-900/5",
      iconCss: "text-blue-600 bg-white shadow-sm",
    },
    {
      id: "rejected",
      icon: XCircle,
      value: claims.filter((c) => c.status === "rejected").length,
      label: "Rejected Claims",
      change: "-2%",
      trend: "down",
      grad: "from-rose-100 to-rose-50 border-rose-200/80 shadow-rose-900/5",
      iconCss: "text-rose-600 bg-white shadow-sm",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const expandVariants = {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-white/80 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-[2rem] flex flex-col">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative overflow-hidden rounded-3xl border border-orange-900/20 bg-gradient-to-br from-white/20 to-[#FFF4E3] p-4 backdrop-blur-md shadow-[0_8px_32px_0_rgba(15,23,42,0.02)]">
          <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-[#3A3B67]/5 blur-2xl pointer-events-none" />
          <div className="relative flex items-start gap-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#3A3B67]/10 text-[#3A3B67] border border-white/60 shadow-sm backdrop-blur-sm">
              <Info size={16} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col gap-0.5 pt-0.5">
              <span className="text-[12px] font-black uppercase tracking-widest text-[#3A3B67]/80">
                Verification Console
              </span>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                Review and manage item claim requests submitted by users.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchClaims}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer w-full sm:w-auto"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-100/80 rounded-[2rem] p-5 h-[140px] shadow-sm border border-slate-200/60 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {statsData.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.id}
                variants={itemVariants}
                className={`cursor-default bg-gradient-to-br ${s.grad} border rounded-[2rem] p-5 sm:p-6 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between`}
              >
                <div className="flex justify-between items-start w-full">
                  <div
                    className={`p-3 rounded-2xl ${s.iconCss} group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}
                  >
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black tracking-tight border ${
                      s.trend === "up"
                        ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-700 border-rose-500/20"
                    }`}
                  >
                    {s.trend === "up" ? (
                      <TrendingUp size={12} strokeWidth={3} />
                    ) : (
                      <TrendingDown size={12} strokeWidth={3} />
                    )}
                    <span>{s.change}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight leading-none">
                    {s.value}
                  </h3>
                  <p className="mt-2 text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-widest block truncate">
                    {s.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {loading ? (
        <div className="flex-1 flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#3A3B67]" />
        </div>
      ) : claims.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 bg-white rounded-3xl border-2 border-dashed border-slate-200 py-24 flex flex-col items-center justify-center text-center px-4"
        >
          <div className="bg-slate-50 p-4 rounded-full mb-4">
            <Search size={32} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">
            No Claim Requests Found
          </h3>
          <p className="text-sm sm:text-base text-slate-500 max-w-sm">
            When users submit requests to claim lost or found items, they will
            securely appear right here.
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4 pb-4"
        >
          {claims.map((claim) => {
            const d = claim.claim_details || {};
            const isOpen = expandedId === claim.id;
            const isUpdating = updatingId === claim.id;

            const statusConfig = {
              pending: {
                icon: Clock,
                style: "bg-amber-100 text-amber-700 border-amber-200",
              },
              approved: {
                icon: CheckCircle,
                style: "bg-emerald-100 text-emerald-700 border-emerald-200",
              },
              rejected: {
                icon: XCircle,
                style: "bg-rose-100 text-rose-700 border-rose-200",
              },
              released: {
                icon: Package,
                style: "bg-blue-100 text-blue-700 border-blue-200",
              },
            };
            const activeConfig =
              statusConfig[claim.status] || statusConfig.pending;
            const StatusIcon = activeConfig.icon;

            return (
              <motion.div
                key={claim.id}
                variants={itemVariants}
                className="bg-white rounded-[1.5rem] border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div
                  className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 p-4 sm:p-5 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() => toggleExpand(claim.id)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="h-16 w-16 sm:h-14 sm:w-14 shrink-0 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
                      {claim.items?.image_url ? (
                        <img
                          src={claim.items.image_url}
                          alt="Item"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center text-slate-300 text-[10px] font-semibold uppercase">
                          No Img
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-base sm:text-lg font-bold text-slate-800 truncate mb-1">
                        {claim.items?.title || "Unknown Item"}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 font-medium">
                        <span className="text-slate-700 font-semibold">
                          {d.fullName || "—"}
                        </span>
                        <span className="hidden sm:inline text-slate-300">
                          •
                        </span>
                        <span>{d.mobile || "—"}</span>
                        <span className="hidden sm:inline text-slate-300">
                          •
                        </span>
                        <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                          {claim.id.substring(0, 8).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="flex flex-col items-start sm:items-end gap-1">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border uppercase tracking-wide ${activeConfig.style}`}
                      >
                        <StatusIcon size={14} strokeWidth={2.5} />
                        {claim.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {new Date(claim.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div
                      className={`p-2 rounded-full transition-colors ${isOpen ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:bg-slate-100"}`}
                    >
                      {isOpen ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      variants={expandVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="overflow-hidden"
                    >
                      <div className="border-t border-slate-100 px-4 sm:px-6 py-5 sm:py-6 bg-slate-50/50">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <ClipboardList size={16} className="text-[#3A3B67]" />{" "}
                          Claim Details
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-8 gap-y-5">
                          <DetailRow label="Item" value={claim.items?.title} />
                          <DetailRow
                            label="Category"
                            value={d.category || claim.items?.category}
                          />
                          <DetailRow
                            label="Item Location (Found At)"
                            value={claim.items?.location}
                          />
                          <DetailRow
                            label="Lost Location"
                            value={d.lostLocation}
                          />
                          <DetailRow label="Lost Date" value={d.lostDate} />
                          <DetailRow label="Mobile" value={d.mobile} />
                          <DetailRow label="Email" value={d.email} />
                          <DetailRow
                            label="Description"
                            value={d.description}
                          />
                          <DetailRow
                            label="Unique Identifiers"
                            value={d.identifiers}
                          />
                          <DetailRow label="Item Type" value={d.itemType} />
                          <DetailRow
                            label="Color / Material"
                            value={d.colorMaterial}
                          />
                          <DetailRow
                            label="Unique Marks"
                            value={d.uniqueMarks}
                          />
                          <DetailRow label="Brand" value={d.brand} />
                          <DetailRow
                            label="Inside Contents"
                            value={d.insideItems}
                          />
                          <DetailRow
                            label="Secret / Distinct Detail"
                            value={d.secretItem}
                          />
                          <DetailRow
                            label="Last Seen Details"
                            value={d.lastSeen}
                          />
                        </div>

                        {d.lost_item_id && (
                          <div className="mt-8">
                            <h4 className="text-xs font-black text-blue-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Search size={16} /> User's Linked Lost Item
                              Report
                            </h4>
                            <div className="rounded-[1.5rem] border border-blue-100 bg-blue-50/50 p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
                              <DetailRow
                                label="Lost Item Title"
                                value={d.lostItemTitle}
                              />
                              <DetailRow label="Category" value={d.category} />
                              <DetailRow
                                label="Last Known Location"
                                value={d.lostLocation}
                              />
                              <DetailRow
                                label="Date Reported Lost"
                                value={
                                  d.lostDate
                                    ? new Date(d.lostDate).toLocaleDateString()
                                    : null
                                }
                              />
                              <div className="sm:col-span-2 lg:col-span-3">
                                <DetailRow
                                  label="Description"
                                  value={d.description}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {claim.status === "pending" && (
                          <div className="mt-8 flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200/60">
                            <button
                              onClick={() => updateStatus(claim.id, "approved")}
                              disabled={isUpdating}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 sm:py-2.5 text-sm font-bold shadow-sm shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
                            >
                              <CheckCircle size={18} />
                              {isUpdating ? "Updating..." : "Approve Claim"}
                            </button>
                            <button
                              onClick={() => updateStatus(claim.id, "rejected")}
                              disabled={isUpdating}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-white border-2 border-rose-100 hover:border-rose-200 text-rose-600 hover:bg-rose-50 px-6 py-3 sm:py-2.5 text-sm font-bold transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
                            >
                              <XCircle size={18} />
                              {isUpdating ? "Updating..." : "Reject"}
                            </button>
                          </div>
                        )}

                        {claim.status !== "pending" && (
                          <div className="mt-8 pt-6 border-t border-slate-200/60">
                            <p className="text-xs sm:text-sm text-slate-500 font-medium bg-slate-100/50 inline-block px-4 py-2 rounded-lg">
                              This claim has been{" "}
                              <strong className="text-slate-800 capitalize">
                                {claim.status}
                              </strong>
                              . Status changes require super-admin privileges.
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}