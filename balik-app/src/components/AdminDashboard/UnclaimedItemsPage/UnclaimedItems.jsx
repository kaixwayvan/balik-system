import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Calendar,
  Clock,
  Timer,
  Search,
  FilterX,
  Eye,
  CheckCircle,
  Archive,
  AlertCircle,
  MapPin,
  CalendarDays,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";

// Simulated Backend
const generateMockData = () => {
  const categories = ["Electronics", "Documents", "Bags", "Clothing", "School Supplies", "Others"];
  const locations = ["Main Library", "Cafeteria", "Science Building", "Gymnasium", "Student Union", "Parking Lot A"];
  const items = [
    { name: "iPhone 13 Pro", cat: "Electronics", desc: "Blue case, cracked screen protector." },
    { name: "Student ID Card", cat: "Documents", desc: "Belongs to John Doe, ID: 2021-0012." },
    { name: "Jansport Backpack", cat: "Bags", desc: "Black backpack containing notebooks and a water bottle." },
    { name: "Denim Jacket", cat: "Clothing", desc: "Levi's blue denim jacket, size M." },
    { name: "Casio Calculator", cat: "School Supplies", desc: "Scientific calculator, slight scratches on back." },
    { name: "Hydro Flask", cat: "Others", desc: "Yellow 32oz bottle with stickers." },
    { name: "MacBook Air", cat: "Electronics", desc: "M1 Silver, left in study room 4." },
    { name: "Passport", cat: "Documents", desc: "International student passport." },
    { name: "Nike Gym Bag", cat: "Bags", desc: "Contains running shoes and towel." },
    { name: "Umbrella", cat: "Others", desc: "Black folding umbrella." },
  ];

  return Array.from({ length: 20 }, (_, i) => {
    const template = items[i % items.length];
    const daysUnclaimed = Math.floor(Math.random() * 110) + 1; // 1 to 110 days
    const date = new Date();
    date.setDate(date.getDate() - daysUnclaimed);

    return {
      id: `ITM-${1000 + i}`,
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(template.name)}&background=random&color=fff&size=150`,
      name: template.name + (i > 9 ? ` ${i}` : ""),
      category: template.cat,
      description: template.desc,
      locationFound: locations[i % locations.length],
      dateFound: date.toISOString().split("T")[0],
      daysUnclaimed: daysUnclaimed,
      aiMatchCount: Math.floor(Math.random() * 4),
      status: "Unclaimed",
    };
  });
};

const MOCK_UNCLAIMED_ITEMS = generateMockData();

// Main Components
export default function UnclaimedItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [aging, setAging] = useState("All");
  const [sort, setSort] = useState("Newest First");

  // Pagination
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Simulate API Fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 800));
      setItems(MOCK_UNCLAIMED_ITEMS);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter & Sort Logic
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === "All Categories" || item.category === category;

        let matchesAging = true;
        if (aging === "0–30 Days") matchesAging = item.daysUnclaimed <= 30;
        else if (aging === "31–60 Days") matchesAging = item.daysUnclaimed > 30 && item.daysUnclaimed <= 60;
        else if (aging === "61–90 Days") matchesAging = item.daysUnclaimed > 60 && item.daysUnclaimed <= 90;
        else if (aging === "90+ Days") matchesAging = item.daysUnclaimed > 90;

        return matchesSearch && matchesCategory && matchesAging;
      })
      .sort((a, b) => {
        if (sort === "Newest First") return new Date(b.dateFound) - new Date(a.dateFound);
        if (sort === "Oldest First") return new Date(a.dateFound) - new Date(b.dateFound);
        if (sort === "Most Days Unclaimed") return b.daysUnclaimed - a.daysUnclaimed;
        return 0;
      });
  }, [items, search, category, aging, sort]);

  // Reset pagination
  useEffect(() => {
    setPage(1);
  }, [search, category, aging, sort]);

  const paginatedItems = filteredItems.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  // Clear Filters
  const clearFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setAging("All");
    setSort("Newest First");
  };

  // Stats Calculation
  const stats = useMemo(() => {
    const total = items.length;
    const addedThisMonth = items.filter((i) => i.daysUnclaimed <= 30).length;
    const longest = Math.max(...items.map((i) => i.daysUnclaimed), 0);
    const avg = total > 0 ? Math.round(items.reduce((acc, i) => acc + i.daysUnclaimed, 0) / total) : 0;
    return { total, addedThisMonth, longest, avg };
  }, [items]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.1 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] overflow-y-auto h-full w-full flex flex-col gap-6 shadow-xl border border-white/40"
    >
      {/* Header */}
      <div className="flex flex-col pb-2 border-b border-slate-100">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Unclaimed Items</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">
          Monitor found items that have not yet been claimed by their owners.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SummaryCard title="Total Unclaimed" value={stats.total} icon={Package} color="indigo" delay={0.1} />
        <SummaryCard title="Added This Month" value={stats.addedThisMonth} icon={Calendar} color="emerald" delay={0.2} />
        <SummaryCard title="Longest Unclaimed" value={`${stats.longest} Days`} icon={Clock} color="rose" delay={0.3} />
        <SummaryCard title="Avg. Days Unclaimed" value={`${stats.avg} Days`} icon={Timer} color="amber" delay={0.4} />
      </div>

      {/* Filters */}
      <div className="bg-slate-50/50 rounded-3xl p-5 md:p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="flex items-center font-black text-lg sm:text-xl text-red-900 tracking-tight uppercase gap-2">
            <FilterX size={18} className="text-red-900"/> Filter Inventory
          </h2>
          <button
            onClick={clearFilters}
            className="cursor-pointer text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline tracking-wide uppercase transition-colors"
          >
            Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Search Item</label>
            <div className="relative group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Name or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl bg-white text-sm md:text-base font-extrabold text-slate-600 focus:ring-2 focus:ring-indigo-500/20 outline-none hover:bg-slate-50 transition-colors placeholder-slate-400"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="cursor-pointer w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm md:text-base font-extrabold text-slate-600 focus:ring-2 focus:ring-indigo-500/20 outline-none hover:bg-slate-50 transition-colors"
            >
              <option value="All Categories">All Categories</option>
              {["Electronics", "Documents", "Bags", "Clothing", "School Supplies", "Others"].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Aging Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Aging Status</label>
            <select
              value={aging}
              onChange={(e) => setAging(e.target.value)}
              className="cursor-pointer w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm md:text-base font-extrabold text-slate-600 focus:ring-2 focus:ring-indigo-500/20 outline-none hover:bg-slate-50 transition-colors"
            >
              {["All", "0–30 Days", "31–60 Days", "61–90 Days", "90+ Days"].map((age) => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Sort By</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="cursor-pointer w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm md:text-base font-extrabold text-slate-600 focus:ring-2 focus:ring-indigo-500/20 outline-none hover:bg-slate-50 transition-colors"
            >
              {["Newest First", "Oldest First", "Most Days Unclaimed"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-auto">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              <p className="text-sm font-semibold text-slate-500 tracking-wide animate-pulse">Loading items...</p>
            </motion.div>
          ) : filteredItems.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-64 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
              <Package size={48} className="text-slate-300 mb-3" strokeWidth={1.5} />
              <p className="font-bold text-slate-700 text-lg">No unclaimed items found.</p>
              <p className="text-sm text-slate-500 mt-1">All found items have either been claimed or archived.</p>
            </motion.div>
          ) : (
            <motion.div key="data" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-visible flex flex-col h-full">
              
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto overflow-y-visible pb-12"> {/* Added pb-12 so dropdown doesn't clip horizontally */}
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                    <tr>
                      <th className="px-6 py-4 rounded-tl-xl">Item Info</th>
                      <th className="px-6 py-4">Location & Date</th>
                      <th className="px-6 py-4">Aging</th>
                      <th className="px-6 py-4">AI Matches</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center rounded-tr-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <AnimatePresence mode="popLayout">
                      {paginatedItems.map((item, index) => (
                        <motion.tr key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm" />
                              <div className="flex flex-col">
                                <span className="font-black text-slate-800">{item.name}</span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.category}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            <div className="flex flex-col gap-1.5">
                              <span className="flex items-center gap-1.5 font-bold"><MapPin size={14} className="text-slate-400" />{item.locationFound}</span>
                              <span className="flex items-center gap-1.5 text-xs font-medium"><CalendarDays size={14} className="text-slate-400" />{item.dateFound}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest border ${
                              item.daysUnclaimed > 90 ? "bg-rose-50 text-rose-700 border-rose-200" :
                              item.daysUnclaimed > 60 ? "bg-amber-50 text-amber-700 border-amber-200" :
                              "bg-slate-50 text-slate-600 border-slate-200"
                            }`}>
                              {item.daysUnclaimed} Days
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {item.aiMatchCount > 0 ? (
                              <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border border-indigo-100">
                                <Sparkles size={14} className="text-indigo-500" />
                                {item.aiMatchCount} Matches
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs font-medium italic">No matches yet</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 text-slate-600 font-bold text-xs bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                              <AlertCircle size={14} /> {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <ActionMenu 
                              item={item} 
                              onView={() => setSelectedItem(item)} 
                              isLast={index >= paginatedItems.length - 2 || paginatedItems.length <= 2} 
                            />
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="block md:hidden p-4 space-y-4">
                <AnimatePresence mode="popLayout">
                  {paginatedItems.map((item) => (
                    <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col gap-3 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />
                      <div className="flex gap-4 pl-2">
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-sm" />
                        <div className="flex flex-col justify-center">
                          <span className="font-black text-slate-800 text-base">{item.name}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.category}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pl-2 mt-2">
                        <div className="flex flex-col gap-1 bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] uppercase text-slate-500 font-black tracking-wider">Days Unclaimed</span>
                          <span className="text-sm font-bold text-slate-800">{item.daysUnclaimed} Days</span>
                        </div>
                        <div className="flex flex-col gap-1 bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] uppercase text-slate-500 font-black tracking-wider">AI Matches</span>
                          <span className={`text-sm font-bold ${item.aiMatchCount > 0 ? "text-indigo-600" : "text-slate-800"}`}>{item.aiMatchCount} Matches</span>
                        </div>
                      </div>
                      <div className="pt-3 mt-2 border-t border-slate-100 flex justify-end gap-2 pl-2">
                        <button onClick={() => setSelectedItem(item)} className="cursor-pointer flex items-center gap-2 text-sm font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 rounded-xl transition-colors w-full justify-center">
                          <Eye size={16} /> View Details
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-5 border-t border-slate-100 bg-slate-50 mt-auto rounded-b-3xl">
                <span className="text-sm font-bold text-slate-500">
                  Page <span className="text-slate-800">{page}</span> of {totalPages || 1}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setPage(p => Math.max(p - 1, 1))} 
                    disabled={page === 1} 
                    className={`p-2 rounded-lg border border-slate-200 text-slate-600 transition-colors ${page === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-slate-100 hover:text-indigo-600'}`}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button 
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))} 
                    disabled={page === totalPages || totalPages === 0} 
                    className={`p-2 rounded-lg border border-slate-200 text-slate-600 transition-colors ${page === totalPages || totalPages === 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-slate-100 hover:text-indigo-600'}`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Analytics */}
      {!loading && items.length > 0 && <AnalyticsSection items={items} />}

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedItem && <ItemDetailsModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
        </AnimatePresence>,
        document.body
      )}

    </motion.div>
  );
}

// Sub-components
function SummaryCard({ title, value, icon: Icon, color, delay }) {
  const colorClasses = {
    indigo: "from-indigo-100 to-indigo-50 text-indigo-600 border-indigo-200 shadow-indigo-900/5",
    emerald: "from-emerald-100 to-emerald-50 text-emerald-600 border-emerald-200 shadow-emerald-900/5",
    rose: "from-rose-100 to-rose-50 text-rose-600 border-rose-200 shadow-rose-900/5",
    amber: "from-amber-100 to-amber-50 text-amber-600 border-amber-200 shadow-amber-900/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 24 }}
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-[2rem] p-4 sm:p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[130px]`}
    >
      <div className="flex justify-between items-start">
        <div className="p-2.5 rounded-2xl bg-white shadow-sm">
          <Icon size={18} strokeWidth={2.5} />
        </div>
      </div>
      <div>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-none">{value}</h3>
        <p className="mt-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">{title}</p>
      </div>
    </motion.div>
  );
}

// ActionMenu
function ActionMenu({ item, onView, isLast }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left z-10" onMouseLeave={() => setIsOpen(false)}>
      <button onClick={() => setIsOpen(!isOpen)} className="cursor-pointer p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
        <MoreVertical size={18} />
      </button>
      <AnimatePresence>
        {isOpen && (
          // Use 'bottom-full mb-2' if it's the last item to prevent it from getting stuck under the table
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: isLast ? 10 : -10 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: isLast ? 10 : -10 }} 
            className={`absolute right-0 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-[60] overflow-hidden text-left p-1.5 ${isLast ? 'bottom-full mb-2' : 'top-10 mt-1'}`}
          >
            <button onClick={onView} className="cursor-pointer w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-bold rounded-lg transition-colors">
              <Eye size={16} /> View Details
            </button>
            <button className="cursor-pointer w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-bold rounded-lg transition-colors">
              <Sparkles size={16} /> AI Matches ({item.aiMatchCount})
            </button>
            <button className="cursor-pointer w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 font-bold rounded-lg transition-colors">
              <CheckCircle size={16} /> Mark as Claimed
            </button>
            <div className="h-px bg-slate-100 my-1 mx-2" />
            <button className="cursor-pointer w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-bold rounded-lg transition-colors">
              <Archive size={16} /> Archive Item
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnalyticsSection({ items }) {
  const categories = ["Documents", "Electronics", "Bags", "Clothing", "School Supplies", "Others"];
  const catCounts = categories.map(cat => ({ name: cat, count: items.filter(i => i.category === cat).length }));
  const maxCatCount = Math.max(...catCounts.map(c => c.count), 1);

  const agingRanges = [
    { label: "0–30 Days", count: items.filter(i => i.daysUnclaimed <= 30).length },
    { label: "31–60 Days", count: items.filter(i => i.daysUnclaimed > 30 && i.daysUnclaimed <= 60).length },
    { label: "61–90 Days", count: items.filter(i => i.daysUnclaimed > 60 && i.daysUnclaimed <= 90).length },
    { label: "90+ Days", count: items.filter(i => i.daysUnclaimed > 90).length },
  ];
  const totalAging = items.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Category Chart */}
      <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] border border-slate-200/60 shadow-sm flex flex-col h-[320px] transition-all duration-300 hover:shadow-md">
        <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          Unclaimed by Category
        </h3>
        <div className="flex-1 flex items-end justify-between gap-1 sm:gap-2 px-1 sm:px-2 relative h-full">
          {catCounts.map((cat, i) => {
            const heightPerc = (cat.count / maxCatCount) * 100;
            return (
              <div key={i} className="flex flex-col items-center gap-2 sm:gap-3 w-full group h-full justify-end">
                <div className="relative w-full h-full flex justify-center items-end">
                  <div className="absolute -top-8 sm:-top-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-slate-800 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-lg z-10 shadow-lg pointer-events-none">
                    {cat.count}
                  </div>
                  <motion.div
                    initial={{ height: 0 }} 
                    animate={{ height: `${heightPerc}%` }} 
                    transition={{ duration: 0.8, delay: i * 0.1, type: "spring", bounce: 0.4 }}
                    className="w-full max-w-[28px] sm:max-w-[44px] bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-2xl opacity-85 group-hover:opacity-100 transition-opacity shadow-[0_-4px_15px_rgba(99,102,241,0.15)]"
                  />
                </div>
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 text-center leading-tight truncate w-full" title={cat.name}>
                  {cat.name.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Aging Progress */}
      <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] border border-slate-200/60 shadow-sm flex flex-col h-[320px] transition-all duration-300 hover:shadow-md">
        <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          Unclaimed Item Aging
        </h3>
        <div className="flex-1 flex flex-col justify-center gap-5 sm:gap-6">
          {agingRanges.map((range, i) => {
            const widthPerc = totalAging > 0 ? (range.count / totalAging) * 100 : 0;
            return (
              <div key={i} className="space-y-2 group">
                <div className="flex justify-between text-[10px] sm:text-xs font-black uppercase tracking-wider">
                  <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{range.label}</span>
                  <span className="text-slate-500">{range.count} Items</span>
                </div>
                <div className="w-full bg-slate-100/80 rounded-full h-3 sm:h-3.5 overflow-hidden shadow-inner border border-slate-200/50 relative">
                  <motion.div
                    initial={{ width: 0 }} 
                    animate={{ width: `${widthPerc}%` }} 
                    transition={{ duration: 0.8, delay: i * 0.1, type: "spring", bounce: 0.2 }}
                    className={`absolute left-0 top-0 h-full rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)] ${
                      i === 3 ? "bg-gradient-to-r from-rose-400 to-rose-500" : 
                      i === 2 ? "bg-gradient-to-r from-amber-400 to-amber-500" : 
                      "bg-gradient-to-r from-emerald-400 to-emerald-500"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ItemDetailsModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-[2rem] w-full max-w-2xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden ring-1 ring-slate-900/5"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-3 rounded-2xl shadow-inner">
              <Package className="text-indigo-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Item Details</h2>
              <p className="text-[11px] text-slate-500 font-mono font-bold mt-0.5 tracking-widest uppercase">ID: {item.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="cursor-pointer p-2.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-8">
          {/* Main Info Row */}
          <div className="flex flex-col sm:flex-row gap-6">
            <img src={item.image} alt={item.name} className="w-32 h-32 rounded-4xl object-cover border-4 border-white shadow-md shrink-0" />
            <div className="flex flex-col justify-center space-y-3">
              <div>
                <h3 className="text-3xl font-black text-slate-800 leading-tight tracking-tight">{item.name}</h3>
                <span className="inline-block mt-2 px-3 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-200">
                  {item.category}
                </span>
              </div>
              <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-md">{item.description}</p>
            </div>
          </div>

          {/* Grid Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-1.5"><MapPin size={14}/> Location Found</span>
              <span className="text-sm font-bold text-slate-800">{item.locationFound}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-1.5"><CalendarDays size={14}/> Date Found</span>
              <span className="text-sm font-bold text-slate-800">{item.dateFound}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-1.5"><Clock size={14}/> Aging Status</span>
              <span className={`text-sm font-bold ${item.daysUnclaimed > 60 ? "text-rose-600" : "text-slate-800"}`}>{item.daysUnclaimed} Days Unclaimed</span>
            </div>
            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1.5 mb-1.5"><Sparkles size={14}/> System Matches</span>
              <span className="text-sm font-bold text-indigo-700">{item.aiMatchCount} Potential Matches Found</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/80 flex flex-wrap gap-3 justify-end rounded-b-[2rem]">
          <button onClick={onClose} className="cursor-pointer px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-100 font-bold tracking-wide transition-all shadow-sm text-sm">
            Close Panel
          </button>
          {item.aiMatchCount > 0 && (
            <button className="cursor-pointer px-6 py-3 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 font-bold tracking-wide transition-all shadow-sm text-sm flex items-center gap-2">
              <Sparkles size={18} /> View Matches
            </button>
          )}
          <button className="cursor-pointer px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold tracking-wide transition-all shadow-md hover:shadow-lg text-sm flex items-center gap-2">
            <CheckCircle size={18} /> Mark as Claimed
          </button>
        </div>
      </motion.div>
    </div>
  );
}