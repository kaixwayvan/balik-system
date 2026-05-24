import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  ShieldCheck,
  X,
  MapPin,
  Calendar,
  User,
  CheckCircle,
  FileText,
  AlertCircle,
} from "lucide-react";

import iphoneImg from "../../../assets/home-assets/img-items/iphone.png";

/* Backend Simulation */

const BACKEND_CATEGORIES = [
  "All Items",
  "Electronics",
  "Personal Items",
  "Accessories",
  "Wallets/Bags",
  "Documents",
  "Keys",
  "Others",
];

const useAuthStub = () => {
  return {
    user: { id: "mock-user-123", email: "user@example.com" },
  };
};

const nlpServiceStub = {
  generateEmbedding: async (query) => {
    console.log("NLP Stub: Generating embedding for", query);
    return [0.1, 0.2, 0.3];
  },
};

let GLOBAL_MOCK_DATABASE = [
  {
    id: "item-001",
    title: "iPhone 13 Pro",
    category: "Electronics",
    description:
      "Found near the library benches. Space gray color with a clear silicone case. Screen is intact.",
    location: "University Library",
    date_reported: "2026-05-20",
    status: "pending",
    type: "found",
    similarity: 0,
    image_url: null,
    metadata: { reporter: { name: "John Doe" } },
  },
  {
    id: "item-002",
    title: "Leather Bi-fold Wallet",
    category: "Wallets/Bags",
    description:
      "Black leather wallet found near the cafeteria entrance. Contains transit passes but no ID cards.",
    location: "Student Cafeteria",
    date_reported: "2026-05-22",
    status: "matching",
    type: "found",
    similarity: 0,
    image_url: null,
    metadata: { reporter: { name: "Anonymous" } },
  },
];

const itemServiceStub = {
  searchItems: async ({ query, category, type, embedding }) => {
    console.log("Item Service Stub: Fetching with params", {
      query,
      category,
      type,
      embedding,
    });

    return GLOBAL_MOCK_DATABASE.filter((item) => {
      const matchesCategory =
        category === "All Items" || item.category === category;
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());

      // Simulating NLP weight change on query match
      if (query && matchesQuery) {
        item.similarity = 0.85;
      } else {
        item.similarity = 0;
      }

      return matchesCategory && matchesQuery;
    });
  },

  logItemAction: async (payload) => {
    console.log("Item Service Stub: Logged Action ->", payload);
    return { success: true };
  },
};

const supabaseStub = {
  from: (table) => ({
    select: (columns) => ({
      eq: (colName, val) => ({
        single: async () => {
          if (table === "profiles") {
            return {
              data: {
                full_name: "Alex Smith",
                mobile_number: "+1234567890",
                email: "user@example.com",
              },
              error: null,
            };
          }
          return { data: null, error: null };
        },
        eq: (anotherCol, anotherVal) => ({
          order: async (orderCol, options) => {
            if (table === "items") {
              return {
                data: [
                  {
                    id: "lost-001",
                    title: "Lost iPhone 13",
                    category: "Electronics",
                    location: "Near Gym",
                    date_reported: "2026-05-19",
                    description:
                      "Space gray iPhone dropped somewhere on campus",
                  },
                ],
                error: null,
              };
            }
            return { data: [], error: null };
          },
        }),
      }),
    }),
    insert: async (data) => {
      console.log(`Supabase Stub: Insert into table [${table}] ->`, data);
      return { data, error: null };
    },
  }),
};

export default function SearchItems() {
  useEffect(() => {
    document.title = "Search Items - BALIK System";

    return () => {
      document.title = "Balik System";
    };
  }, []);

  const { user } = useAuthStub();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [showClaimConfirm, setShowClaimConfirm] = useState(false);
  const [claimItem, setClaimItem] = useState(null);
  const [userLostItems, setUserLostItems] = useState([]);
  const [selectedLostItem, setSelectedLostItem] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const fetchItems = async (currentQuery) => {
    setLoading(true);
    try {
      let embedding = null;
      if (currentQuery && currentQuery.trim().length > 2) {
        try {
          embedding = await nlpServiceStub.generateEmbedding(currentQuery);
        } catch (nlpError) {
          console.warn(
            "NLP embedding failed, falling back to basic search:",
            nlpError.message,
          );
        }
      }

      const data = await itemServiceStub.searchItems({
        query: currentQuery,
        category: activeCategory,
        type: "found",
        embedding,
      });
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchItems(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [activeCategory, searchQuery]);

  const filteredItems = items;

  const handleClaimClick = async (foundItem) => {
    if (!user) {
      alert("You must be logged in to claim an item.");
      return;
    }
    
    if (foundItem.status === "claimed") {
      alert("This item has already been successfully claimed.");
      return;
    }

    setClaimItem(foundItem);
    setSelectedLostItem(null);

    const [profileRes, lostRes] = await Promise.all([
      supabaseStub
        .from("profiles")
        .select("full_name, mobile_number, email")
        .eq("id", user.id)
        .single(),
      supabaseStub
        .from("items")
        .select("id, title, category, location, date_reported, description")
        .eq("user_id", user.id)
        .eq("type", "lost")
        .order("created_at", { ascending: false }),
    ]);

    setUserProfile(profileRes.data || null);
    const lost = lostRes.data || [];
    setUserLostItems(lost);

    const match = lost.find((l) => l.category === foundItem.category) || null;
    setSelectedLostItem(match);
    setShowClaimConfirm(true);
  };

  const submitClaim = async () => {
    if (!user || !claimItem) return;
    setSubmitting(true);
    try {
      const { error } = await supabaseStub.from("item_claims").insert({
        item_id: claimItem.id,
        claimer_id: user.id,
        status: "pending",
        claim_details: {
          lost_item_id: selectedLostItem?.id || null,
          fullName: userProfile?.full_name || user.email,
          mobile: userProfile?.mobile_number || "",
          email: userProfile?.email || user.email,
          lostLocation: selectedLostItem?.location || "",
          lostDate: selectedLostItem?.date_reported || "",
          description: selectedLostItem?.description || "",
          category: selectedLostItem?.category || claimItem.category,
          identifiers: "",
          lostItemTitle: selectedLostItem?.title || "",
        },
      });
      if (error) throw error;

      await itemServiceStub.logItemAction({
        item_id: claimItem.id,
        action_type: "CLAIM_SUBMITTED",
        actor_id: user.id,
        description: "User submitted a one-click claim request for this item",
        new_data: {
          status: "claimed",
          claimer_id: user.id,
          lost_item_id: selectedLostItem?.id,
        },
      });

      GLOBAL_MOCK_DATABASE = GLOBAL_MOCK_DATABASE.map((itm) =>
        itm.id === claimItem.id ? { ...itm, status: "claimed" } : itm,
      );

      setItems((prevItems) =>
        prevItems.map((itm) =>
          itm.id === claimItem.id ? { ...itm, status: "claimed" } : itm,
        ),
      );

      setShowClaimConfirm(false);
      setShowSuccess(true);
    } catch (err) {
      console.error("Claim submission error:", err);
      alert("Failed to submit claim. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Centralized cleanup utility on acknowledgement
  const handleCloseAllSuccessPipeline = () => {
    setShowSuccess(false);
    setShowClaimConfirm(false);
    setSelectedItem(null);
    setClaimItem(null);
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] p-8 transition-all duration-300">
      {/* Header Container - Hidden on lg and above */}
      <div className="mb-6 lg:hidden animate-fade-in">
        <h1 className="text-3xl font-black tracking-tight text-[#66240E]">
          Recently Reported Items
        </h1>
        <p className="mt-1.5 text-sm font-semibold text-[#997C68] leading-relaxed">
          Browse all found items reported by the community. Click on any item to
          view details and submit a claim request.
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="group mb-6 rounded-3xl border border-[#E2DCD0] bg-[#FAF8F5] p-4 shadow-sm transition-all duration-300 hover:bg-[#F3EFE6]">
        <div className="flex items-center gap-2">
          <ShieldCheck size={22} className="text-[#18344F]/80 shrink-0" />
          <p className="font-bold text-[#18344F] text-lg group-hover:text-[#0F2D70]">
            Privacy Protection
          </p>
        </div>
        <p className="text-sm text-slate-500 mt-1.5 sm:ml-7 leading-relaxed">
          Only found items are publicly searchable to protect privacy. Your lost
          item reports are stored securely for automated matching and admin
          review only.
        </p>
      </div>

      {/* Search Input wrapper */}
      <div className="mb-5 flex items-center gap-2 rounded-3xl border border-[#E2DCD0] bg-white px-4 py-4 shadow-sm transition-all duration-200 focus-within:border-[#2C4A52] focus-within:ring-4 focus-within:ring-[#2C4A52]/5">
        <Search size={18} className="text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search for lost items, brands, colors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border-none bg-transparent text-sm outline-none text-slate-800 placeholder-slate-400 font-medium"
        />
      </div>

      {/* Categories Toolbar */}
      <div className="mb-6">
        {/* Mobile Dropdown View */}
        <div className="sm:hidden relative">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-3xl border border-[#E2DCD0] bg-white px-4 py-3.5 text-base font-semibold text-slate-600 outline-none focus:border-[#2C4A52] focus:ring-4 focus:ring-[#2C4A52]/5"
          >
            {BACKEND_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        {/* Desktop Row View - Shown only on sm screens and up */}
        <div className="hidden sm:flex sm:flex-wrap gap-2">
          {BACKEND_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`cursor-pointer whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#2C4A52] text-white shadow-sm shadow-[#2C4A52]/10"
                  : "border border-[#E2DCD0] bg-white text-slate-600 hover:border-slate-300 hover:bg-[#FAF8F5]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full flex flex-col justify-center items-center py-24 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#2C4A52] border-t-transparent"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Searching Records...
            </p>
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item, index) => {
            const isClaimed = item.status === "claimed";
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isClaimed) return;
                  setSelectedItem(item);
                }}
                className={`group overflow-hidden rounded-3xl bg-white shadow-sm flex flex-col border border-[#E8E3D9] transition-all duration-300 animate-fade-in-up ${
                  isClaimed
                    ? "opacity-60 cursor-not-allowed select-none"
                    : "hover:-translate-y-1 hover:shadow-md cursor-pointer"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative overflow-hidden aspect-[4/3] bg-slate-100">
                  <img
                    src={item.image_url || iphoneImg}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    className={`absolute right-3 top-3 rounded-xl px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm z-10 ${
                      isClaimed
                        ? "bg-slate-500/90"
                        : item.status === "pending"
                          ? "bg-amber-600/90"
                          : item.status === "matching"
                            ? "bg-[#2C4A52]/90"
                            : "bg-[#86A397]"
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="absolute left-3 top-3 rounded-xl bg-slate-900/75 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                    {item.type}
                  </span>
                  {item.similarity > 0 && (
                    <span className="absolute right-3 bottom-3 rounded-xl bg-[#86A397] px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
                      {(item.similarity * 100).toFixed(0)}% Match
                    </span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <span className="inline-block rounded-xl bg-[#FAF8F5] border border-[#E2DCD0] px-2.5 py-0.5 text-[10px] font-bold text-slate-500 w-fit uppercase tracking-wide">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-[#2C4A52] text-base mt-2 truncate group-hover:text-slate-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500 line-clamp-2 min-h-[40px] leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-4 pt-3 flex items-center justify-between text-xs font-medium text-slate-400 border-t border-[#F3EFE6]">
                    <span className="flex items-center gap-1.5 truncate max-w-[60%]">
                      <MapPin size={13} className="text-yellow-500 shrink-0" />
                      <span className="truncate text-slate-600 font-medium">
                        {item.location}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 shrink-0 text-slate-600">
                      <Calendar
                        size={13}
                        className="text-yellow-500 shrink-0"
                      />
                      {new Date(item.date_reported).toLocaleDateString(
                        undefined,
                        { month: "short", day: "numeric" },
                      )}
                    </span>
                  </div>

                  <button
                    disabled={isClaimed}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isClaimed) return;
                      setSelectedItem(item);
                    }}
                    className={`mt-4 w-full rounded-2xl py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm ${
                      isClaimed
                        ? "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed button-disabled-override"
                        : "bg-[#2C4A52] text-white hover:bg-[#1E3339] cursor-pointer"
                    }`}
                  >
                    {isClaimed ? "Claimed" : "View Details"}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 px-4 bg-white rounded-3xl border border-dashed border-[#E2DCD0] text-center animate-fade-in">
            <p className="text-slate-600 text-lg font-bold">
              No records match your query
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Try clearing filters or running a broad descriptor search
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="relative w-full max-w-md md:max-w-xl rounded-3xl overflow-hidden bg-white shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[90vh] animate-scale-up">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#FAF8F5] px-5 sm:px-6 py-4 bg-white rounded-t-3xl">
                <h2 className="text-base sm:text-lg font-black text-[#2C4A52]">
                  Item Inspection
                </h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <X className="cursor-pointer h-5 w-5 text-slate-400 hover:text-slate-600" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none px-5 sm:px-6 py-4 space-y-4">
                <div className="relative rounded-2xl overflow-hidden shadow-inner bg-slate-50 aspect-[16/10]">
                  <img
                    src={selectedItem.image_url || iphoneImg}
                    alt={selectedItem.title}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-lg bg-[#86A397] px-3 py-1 text-xs sm:text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                    Found Record
                  </span>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                    <h3 className="text-lg sm:text-xl font-bold text-[#2C4A52]">
                      {selectedItem.title}
                    </h3>
                    <span className="text-xs sm:text-[11px] text-slate-400 font-mono tracking-tight sm:mt-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      ID: {selectedItem.id.substring(0, 8)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm sm:text-sm text-slate-600 leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2DCD0]/60">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CheckCircle className="h-4 w-4 text-yellow-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                        Category
                      </p>
                      <p className="text-sm sm:text-sm font-semibold text-slate-700 truncate">
                        {selectedItem.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MapPin className="h-4 w-4 text-yellow-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                        Location
                      </p>
                      <p className="text-sm sm:text-sm font-semibold text-slate-700 truncate">
                        {selectedItem.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Calendar className="h-4 w-4 text-yellow-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                        Date Logged
                      </p>
                      <p className="text-sm sm:text-sm font-semibold text-slate-700 truncate">
                        {new Date(
                          selectedItem.date_reported,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <User className="h-4 w-4 text-yellow-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                        Reporter
                      </p>
                      <p className="text-sm sm:text-sm font-semibold text-slate-700 truncate">
                        {selectedItem.metadata?.reporter?.name || "Anonymous"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E2DCD0] bg-[#FAF8F5] p-4">
                  <div className="flex items-center gap-2 text-sm sm:text-sm font-bold text-[#2C4A52]">
                    <CheckCircle
                      className="h-4 w-4 shrink-0 text-slate-500"
                      strokeWidth={3}
                    />
                    Ownership Integrity Notice
                  </div>
                  <p className="mt-1.5 text-xs sm:text-xs text-slate-500 leading-relaxed">
                    {selectedItem.similarity
                      ? `Our NLP contextual validation index matched this item with your search pattern.`
                      : `This item appears in your results based on category or keyword matching.`}{" "}
                    Initiating a claim links your tracking profiles to setup
                    validation handshakes.
                  </p>
                </div>
              </div>

              <div className="sticky bottom-0 z-10 border-t border-slate-100 px-5 sm:px-6 py-4 bg-white rounded-b-3xl">
                {selectedItem.status === "claimed" ? (
                  <button
                    disabled
                    className="w-full rounded-2xl bg-slate-200 py-3 text-sm sm:text-sm font-bold text-slate-400 cursor-not-allowed text-center"
                  >
                    Item Already Claimed
                  </button>
                ) : (
                  <button
                    onClick={() => handleClaimClick(selectedItem)}
                    className="cursor-pointer w-full rounded-2xl bg-[#2C4A52] py-3 text-sm sm:text-sm font-bold text-white hover:bg-[#1E3339] transition-all shadow-md shadow-[#2C4A52]/10"
                  >
                    Claim This Item
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Confirmation Modal */}
      {showClaimConfirm &&
        claimItem &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="relative w-full max-w-md md:max-w-lg rounded-[2rem] overflow-hidden bg-white shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[90vh] animate-scale-up">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 px-5 sm:px-6 py-4 bg-white rounded-t-[2rem]">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#2C4A52]">
                    Confirm Claim Request
                  </h2>
                  <p className="text-xs sm:text-[11px] text-slate-400 mt-0.5">
                    Verify information binding before system logging.
                  </p>
                </div>
                <button
                  onClick={() => setShowClaimConfirm(false)}
                  className="cursor-pointer p-1.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-none px-5 sm:px-6 py-4 space-y-4">
                <div className="rounded-3xl border border-[#E2DCD0] bg-[#FAF8F5] p-3.5 flex gap-3.5 items-start">
                  <img
                    src={claimItem.image_url || iphoneImg}
                    alt={claimItem.title}
                    className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl object-cover shrink-0 border border-[#E2DCD0]"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Target Selection
                    </p>
                    <p className="font-bold text-[#2C4A52] text-base sm:text-base truncate">
                      {claimItem.title}
                    </p>
                    <p className="text-sm sm:text-xs text-slate-500 truncate font-medium">
                      {claimItem.category} · {claimItem.location}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Claimer Credentials
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="rounded-2xl border border-[#E2DCD0]/70 bg-white px-3.5 py-2">
                      <p className="text-[11px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Full Name
                      </p>
                      <p className="text-sm sm:text-sm font-semibold text-slate-700 truncate mt-0.5">
                        {userProfile?.full_name || user?.email}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[#E2DCD0]/70 bg-white px-3.5 py-2">
                      <p className="text-[11px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Contact Index
                      </p>
                      <p className="text-sm sm:text-sm font-semibold text-slate-700 truncate mt-0.5">
                        {userProfile?.mobile_number || "—"}
                      </p>
                    </div>
                    <div className="sm:col-span-2 rounded-2xl border border-[#E2DCD0]/70 bg-white px-3.5 py-2">
                      <p className="text-[11px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Routing Email
                      </p>
                      <p className="text-sm sm:text-sm font-semibold text-slate-700 truncate mt-0.5">
                        {userProfile?.email || user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText size={12} className="text-slate-400" />
                    Link Lost Report
                  </p>
                  {userLostItems.filter(
                    (lost) => lost.category === claimItem.category,
                  ).length === 0 ? (
                    <div className="space-y-3">
                      <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-3.5 flex gap-3 items-start">
                        <AlertCircle
                          size={16}
                          className="text-amber-600 mt-0.5 shrink-0"
                        />
                        <p className="text-sm sm:text-xs text-amber-800 leading-relaxed font-medium">
                          No matching personal lost report found for this item's
                          category. The claim will process via standard
                          operational protocols without linking.
                        </p>
                      </div>
                      <label className="flex items-center gap-3 rounded-2xl border p-3.5 transition-all border-[#2C4A52] bg-[#FAF8F5] shadow-sm cursor-not-allowed">
                        <input
                          type="radio"
                          name="lostItem"
                          checked={true}
                          readOnly
                          className="h-4 w-4 focus:ring-[#2C4A52] shrink-0 accent-[#2C4A52] cursor-not-allowed"
                        />
                        <p className="text-sm sm:text-sm font-semibold text-slate-500">
                          DO NOT LINK REPORT
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {userLostItems
                        .filter((lost) => lost.category === claimItem.category)
                        .map((lost) => (
                          <label
                            key={lost.id}
                            className={`flex items-start gap-3 rounded-2xl border p-3.5 cursor-pointer transition-all ${
                              selectedLostItem?.id === lost.id
                                ? "border-[#2C4A52] bg-[#FAF8F5] shadow-sm"
                                : "border-[#E2DCD0]/70 bg-white hover:border-slate-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="lostItem"
                              checked={selectedLostItem?.id === lost.id}
                              onChange={() => setSelectedLostItem(lost)}
                              className="mt-1 h-4 w-4 focus:ring-[#2C4A52] shrink-0 accent-[#2C4A52]"
                            />
                            <div className="min-w-0 text-left">
                              <p className="text-sm sm:text-sm font-bold text-slate-800 truncate">
                                {lost.title}
                              </p>
                              <p className="text-xs sm:text-[11px] text-slate-500 font-medium truncate mt-0.5">
                                {lost.category} · {lost.location}
                              </p>
                            </div>
                          </label>
                        ))}
                      <label
                        className={`flex items-center gap-3 rounded-2xl border p-3.5 cursor-pointer transition-all ${
                          selectedLostItem === null
                            ? "border-[#2C4A52] bg-[#FAF8F5] shadow-sm"
                            : "border-[#E2DCD0]/70 bg-white hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="lostItem"
                          checked={selectedLostItem === null}
                          onChange={() => setSelectedLostItem(null)}
                          className="h-4 w-4 focus:ring-[#2C4A52] shrink-0 accent-[#2C4A52]"
                        />
                        <p className="text-sm sm:text-sm font-semibold text-slate-400">
                          DO NOT LINK REPORT
                        </p>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 px-5 sm:px-6 py-4 flex flex-col-reverse sm:flex-row gap-3 bg-white rounded-b-[2rem]">
                <button
                  onClick={() => setShowClaimConfirm(false)}
                  className="w-full sm:flex-1 rounded-2xl border border-slate-200 py-3 text-sm sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={submitClaim}
                  disabled={submitting}
                  className="w-full sm:flex-1 rounded-2xl bg-[#2C4A52] hover:bg-[#1E3339] py-3 text-sm sm:text-sm font-bold text-white transition-all disabled:opacity-60 cursor-pointer shadow-md shadow-[#2C4A52]/10"
                >
                  {submitting ? "Processing..." : "Verify Ownership"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Success Modal */}
      {showSuccess &&
        createPortal(
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="relative w-full max-w-xs sm:max-w-sm rounded-[2rem] overflow-hidden bg-white shadow-2xl px-6 sm:px-8 py-8 flex flex-col items-center text-center border border-slate-100 animate-scale-up">
              <button
                onClick={handleCloseAllSuccessPipeline}
                className="cursor-pointer absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition p-1.5 rounded-full hover:bg-slate-50"
              >
                <X size={18} />
              </button>

              <div className="mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#FAF8F5] text-[#86A397] border border-[#E2DCD0] animate-bounce-short">
                <svg
                  className="h-6 w-6 sm:h-7 sm:w-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-[#2C4A52] mb-1.5">
                Request Logged
              </h2>
              <p className="text-sm sm:text-sm text-slate-500 leading-relaxed mb-6 font-medium">
                Your claim is securely transferred to system ledgers for
                coordination. You will be notified once it has been processed.
              </p>

              <button
                onClick={handleCloseAllSuccessPipeline}
                className="cursor-pointer w-full rounded-xl bg-[#2C4A52] hover:bg-[#1E3339] text-white font-bold text-sm sm:text-sm py-2.5 transition-all shadow-md shadow-[#2C4A52]/10"
              >
                Acknowledge
              </button>
            </div>
          </div>,
          document.body,
        )}

      {/* Target injection style hook for animations */}
      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounceShort {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        
        .animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out both; }
        .animate-scale-up { animation: scaleUp 0.25s cubic-bezier(0.34, 1.3, 0.64, 1) both; }
        .animate-bounce-short { animation: bounceShort 0.5s ease-out 1; }
      `}</style>
    </div>
  );
}