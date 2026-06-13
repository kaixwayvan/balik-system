import { useState, useMemo, useEffect } from "react";
import { Search, Calendar, Eye, QrCode, Plus, SlidersHorizontal, Trash2, Filter, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LostItemDetailsModal from "./LostItemDetailsModal";
import QRCodeModal from "./QRCodeModal";
import AdminReport from "../AdminHome/AdminReport";

const categories = [
  "All",
  "Electronics",
  "Books",
  "Bags",
  "Keys",
  "Jewelry",
  "Clothing",
  "Documents",
  "Equipment",
  "Personal Items",
  "Other",
];

const statuses = ["All Status", "Pending", "Approved", "Matched", "Ready for Release", "Claimed", "Released", "Archived", "Unclaimed"];

const statusStyles = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Approved: "bg-blue-100 text-blue-700 border-blue-200",
  Matched: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Ready for Release": "bg-rose-100 text-rose-700 border-rose-200",
  Claimed: "bg-purple-100 text-purple-700 border-purple-200",
  Released: "bg-indigo-100 text-indigo-700 border-indigo-200",
  Archived: "bg-slate-200 text-slate-600 border-slate-300",
  Unclaimed: "bg-orange-100 text-orange-700 border-orange-200",
};

const tableHeaders = [
  { label: "Item Details", align: "text-left" },
  { label: "Category", align: "text-left" },
  { label: "Location", align: "text-left" },
  { label: "Owner Context", align: "text-left" },
  { label: "Status", align: "text-center" },
  { label: "Date Logged", align: "text-left" },
  { label: "Actions", align: "text-center" },
];

function TooltipIcon({ icon: Icon, color, hoverBg, label, onClick }) {
  return (
    <div className="relative group/tooltip flex items-center justify-center">
      <button
        onClick={onClick}
        className="cursor-pointer p-2.5 rounded-xl transition-all duration-300 border border-transparent outline-none focus:ring-2 focus:ring-slate-200 active:scale-95"
        style={{ color: color }}
        aria-label={label}
      >
        <Icon size={18} strokeWidth={2.5} />
      </button>
      <span className="absolute z-50 -top-8 whitespace-nowrap bg-slate-800 text-white text-xs font-bold px-2.5 py-1 rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity shadow-sm pointer-events-none tracking-wide">
        {label}
      </span>
    </div>
  );
}

export default function LostItems() {
  
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [qrItem, setQrItem] = useState(null);
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLostItems();
  }, []);

  const fetchLostItems = () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        { id: "LST-081", name: "MacBook Pro M2", description: "Space Gray, 14-inch with dev stickers", category: "Electronics", location: "Main Library, 2nd Floor", owner: "Alex Reyes", email: "areyes@pup.edu.ph", status: "Pending", date: new Date().toISOString(), formattedDate: "Oct 24, 2026", image_url: null },
        { id: "LST-082", name: "HydroFlask 32oz", description: "Navy blue with dents on bottom", category: "Personal Items", location: "Cafeteria", owner: "Samira Cruz", email: "scruz@pup.edu.ph", status: "Approved", date: new Date(Date.now() - 86400000).toISOString(), formattedDate: "Oct 23, 2026", image_url: null },
        { id: "LST-083", name: "Honda Car Keys", description: "Attached to a red lanyard", category: "Keys", location: "Parking Lot B", owner: "Mike Tan", email: "mtan@pup.edu.ph", status: "Matched", date: new Date(Date.now() - 172800000).toISOString(), formattedDate: "Oct 22, 2026", image_url: null },
        { id: "LST-084", name: "Leather Wallet", description: "Brown leather, contains student ID", category: "Personal Items", location: "Engineering Building", owner: "John Doe", email: "jdoe@pup.edu.ph", status: "Ready for Release", date: new Date(Date.now() - 259200000).toISOString(), formattedDate: "Oct 21, 2026", image_url: null },
        { id: "LST-085", name: "Sony Headphones", description: "WH-1000XM4, Black", category: "Electronics", location: "Lagoon", owner: "Jane Smith", email: "jsmith@pup.edu.ph", status: "Pending", date: new Date().toISOString(), formattedDate: "Oct 24, 2026", image_url: null },
        { id: "LST-086", name: "Calculus Textbook", description: "7th Edition, hardbound", category: "Books", location: "South Wing", owner: "Peter Parker", email: "pparker@pup.edu.ph", status: "Unclaimed", date: new Date().toISOString(), formattedDate: "Oct 24, 2026", image_url: null },
        { id: "LST-087", name: "Jansport Backpack", description: "Red, slight tear on the side", category: "Bags", location: "Gymnasium", owner: "Clark Kent", email: "ckent@pup.edu.ph", status: "Pending", date: new Date().toISOString(), formattedDate: "Oct 24, 2026", image_url: null },
        { id: "LST-088", name: "Apple iPad Air", description: "Blue, with Apple Pencil", category: "Electronics", location: "Library", owner: "Bruce Wayne", email: "bwayne@pup.edu.ph", status: "Matched", date: new Date().toISOString(), formattedDate: "Oct 24, 2026", image_url: null },
      ];
      setLostItems(mockData);
      setLoading(false);
    }, 800);
  };

  const handleEncodeSuccess = () => {
    setIsReportModalOpen(false);
    fetchLostItems();
  };

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const filteredItems = useMemo(() => {
    return lostItems.filter((item) => {
      const itemDate = new Date(item.date);
      const matchesSearch = item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                            item.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                            item.owner.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
      const matchesStatus = statusFilter === "All Status" || item.status === statusFilter;
      const matchesFromDate = !fromDate || itemDate >= new Date(fromDate);
      const matchesToDate = !toDate || itemDate <= new Date(toDate);
      
      return matchesSearch && matchesCategory && matchesStatus && matchesFromDate && matchesToDate;
    });
  }, [debouncedSearch, categoryFilter, statusFilter, fromDate, toDate, lostItems]);

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setStatusFilter("All Status");
    setFromDate("");
    setToDate("");
  };

  useEffect(() => {
    document.title = `Lost Items (${filteredItems.length}) | BALIK Admin`;

    return () => {
      document.title = "BALIK Admin";
    };
  }, [filteredItems.length]);

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-200/60 relative custom-scrollbar">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 border-b border-slate-100 pb-5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-[#5C1313]/10 p-2.5 rounded-2xl text-[#5C1313]">
            <SlidersHorizontal size={20} strokeWidth={2.5} />
          </div>
          <h2 className="font-black text-xl sm:text-2xl text-[#5E0300] tracking-tight uppercase">Filter Directory</h2>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center gap-3 w-full lg:w-auto">
          <button
            onClick={clearFilters}
            className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-colors outline-none focus:ring-2 focus:ring-rose-200"
          >
            <Trash2 size={16} strokeWidth={2.5} /> Clear Filters
          </button>
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-[#5C1313] to-[#7A1919] hover:from-[#4A0F0F] hover:to-[#5C1313] text-white px-6 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md shadow-[#5C1313]/20 transition-all active:scale-95 uppercase tracking-wider outline-none focus:ring-2 focus:ring-[#5C1313]/40"
          >
            <Plus size={18} strokeWidth={3} />
            Encode Lost Item
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 my-5 shrink-0">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Search Keywords</label>
          <div className="relative flex items-center w-full">
            <Search size={15} className="absolute left-4 text-slate-400 pointer-events-none" />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Search records..." 
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl bg-white text-sm md:text-base font-extrabold text-slate-600 focus:ring-2 focus:ring-[#5C1313]/20 outline-none hover:bg-slate-50 transition-colors placeholder-slate-400" 
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Category</label>
          <div className="relative flex items-center w-full">
            <Layers size={15} className="absolute left-4 text-slate-400 pointer-events-none" />
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)} 
              className="cursor-pointer appearance-none w-full pl-10 pr-10 py-3 border border-slate-200 rounded-2xl bg-white text-sm md:text-base font-extrabold text-slate-600 focus:ring-2 focus:ring-[#5C1313]/20 outline-none hover:bg-slate-50 transition-colors"
            >
              {categories.map((c) => (<option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>))}
            </select>
            <div className="absolute right-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500 w-0 h-0" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Status</label>
          <div className="relative flex items-center w-full">
            <Filter size={15} className="absolute left-4 text-slate-400 pointer-events-none" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)} 
              className="cursor-pointer appearance-none w-full pl-10 pr-10 py-3 border border-slate-200 rounded-2xl bg-white text-sm md:text-base font-extrabold text-slate-600 focus:ring-2 focus:ring-[#5C1313]/20 outline-none hover:bg-slate-50 transition-colors"
            >
              {statuses.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
            <div className="absolute right-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500 w-0 h-0" />
          </div>
        </div>

        {/* FROM DATE */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">From Date</label>
          <div className="relative flex items-center w-full">
            <Calendar size={15} className="absolute left-4 text-slate-400 pointer-events-none z-10" />
            <input 
              type="date" 
              value={fromDate} 
              min="2025-01-01" 
              max={todayStr} 
              onChange={(e) => setFromDate(e.target.value)} 
              onClick={(e) => e.target.showPicker?.()} 
              className="cursor-pointer w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl bg-white text-sm md:text-base font-extrabold text-slate-600 focus:ring-2 focus:ring-[#5C1313]/20 outline-none hover:bg-slate-50 transition-colors" 
            />
          </div>
        </div>

        {/* TO DATE */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">To Date</label>
          <div className="relative flex items-center w-full">
            <Calendar size={15} className="absolute left-4 text-slate-400 pointer-events-none z-10" />
            <input 
              type="date" 
              value={toDate} 
              min="2025-01-01" 
              max={todayStr} 
              onChange={(e) => setToDate(e.target.value)} 
              onClick={(e) => e.target.showPicker?.()} 
              className="cursor-pointer w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl bg-white text-sm md:text-base font-extrabold text-slate-600 focus:ring-2 focus:ring-[#5C1313]/20 outline-none hover:bg-slate-50 transition-colors" 
            />
          </div>
        </div>
      </div>

      <div className="mb-3 pl-1 shrink-0">
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
          Showing <span className="text-[#5C1313]">{filteredItems.length}</span> Results
        </p>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto overflow-y-visible pb-4 shrink-0">
        <table className="w-full text-sm text-left min-w-[1000px] border-collapse">
          <thead className="bg-slate-50/80 text-xs font-black text-slate-400 uppercase tracking-widest border-y border-slate-200/60 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              {tableHeaders.map((header, i) => (
                <th key={i} className={`px-4 py-4 ${header.align} first:rounded-tl-xl last:rounded-tr-xl`}>
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {loading ? (
                <tr><td colSpan="7" className="py-16 text-center text-sm font-bold text-slate-400 animate-pulse">Syncing Matrix...</td></tr>
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan="7" className="py-16 text-center text-base font-bold text-slate-500 italic">No records found matching your filters.</td></tr>
              ) : filteredItems.map((item, i) => (
                <motion.tr 
                  key={item.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-4 py-4 max-w-[220px]">
                    <p className="font-black text-slate-800 tracking-tight truncate text-base">{item.name}</p>
                    <p className="text-sm font-bold text-slate-400 truncate mt-0.5">{item.description}</p>
                  </td>

                  <td className="px-4 py-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-black bg-slate-100 text-slate-600 tracking-wider uppercase">{item.category}</span>
                  </td>

                  <td className="px-4 py-4 max-w-[150px]">
                    <p className="font-bold text-slate-600 truncate text-sm">{item.location}</p>
                  </td>

                  <td className="px-4 py-4 max-w-[150px]">
                    <p className="font-black text-slate-700 truncate text-base">{item.owner}</p>
                    <p className="text-xs font-bold text-slate-400 truncate mt-0.5">{item.email}</p>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${statusStyles[item.status] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                      {item.status}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <p className="font-bold text-slate-500 text-sm">{item.formattedDate}</p>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <TooltipIcon icon={Eye} color="#2563EB" label="View Record" onClick={() => handleViewItem(item)} />
                      <TooltipIcon icon={QrCode} color="#7C3AED" label="Generate QR" onClick={() => { setQrItem(item); setIsQRModalOpen(true); }} />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && <LostItemDetailsModal item={selectedItem} onClose={() => setIsModalOpen(false)} />}
        {isQRModalOpen && <QRCodeModal item={qrItem} onClose={() => setIsQRModalOpen(false)} />}
        {isReportModalOpen && (
          <AdminReport 
            isOpen={isReportModalOpen} 
            initialType="Missing Item" 
            onClose={() => {
              setIsReportModalOpen(false);
              handleEncodeSuccess();
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}