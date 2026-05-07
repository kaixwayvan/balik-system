import { useState, useMemo, useEffect } from "react";
import { Search, Calendar, Eye, QrCode, Plus } from "lucide-react";
import LostItemDetailsModal from "./LostItemDetailsModal";
import QRModal from "./QRModal";
import AdminReportLost from "../AdminHome/AdminReportLost";
import { supabase } from "../../../utils/supabaseClient";

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

const statuses = ["All Status", "Active", "Matched", "Claimed", "Archived"];

const statusStyles = {
  Active: "bg-blue-100 text-blue-600",
  Matched: "bg-green-100 text-green-600",
  Claimed: "bg-purple-100 text-purple-600",
  Archived: "bg-gray-200 text-gray-600",
};

const tableHeaders = [
  { label: "Item", align: "text-left" },
  { label: "Category", align: "text-left" },
  { label: "Location", align: "text-left" },
  { label: "Owner", align: "text-left" },
  { label: "Status", align: "text-left" },
  { label: "Date", align: "text-left" },
  { label: "Actions", align: "text-center" },
];

function TooltipIcon({ icon: Icon, color, label, onClick }) {
  return (
    <div className="relative group">
      <Icon
        className={`${color} cursor-pointer`}
        size={18}
        onClick={onClick}
      />
      <span
        className="absolute -top-6 left-1/2 -translate-x-1/2 
                   whitespace-nowrap bg-gray-800 text-white 
                   text-xs px-2 py-1 rounded opacity-0 
                   group-hover:opacity-100 transition-opacity"
      >
        {label}
      </span>
    </div>
  );
}

export default function LostItems() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [showAdminReport, setShowAdminReport] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLostItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("type", "lost")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedData = data.map(dbItem => {
        const reporter = dbItem.metadata?.reporter || {};
        return {
          id: dbItem.id,
          name: dbItem.title || dbItem.category || "Unknown Item",
          description: dbItem.description,
          category: dbItem.category || "Other",
          location: dbItem.location,
          owner: reporter.name || "Unknown",
          email: reporter.email || "No email",
          status: dbItem.status === 'pending' ? 'Active' : dbItem.status === 'resolved' ? 'Claimed' : 'Active',
          date: dbItem.created_at,
          formattedDate: new Date(dbItem.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
          raw: dbItem
        }
      });
      setLostItems(formattedData);
    } catch (err) {
      console.error("Error fetching lost items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLostItems();
  }, []);

  // FILTER STATES
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Debounce search (300ms)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  // FILTER LOGIC
  const filteredItems = useMemo(() => {
    return lostItems.filter((item) => {
      const itemDate = new Date(item.date);

      const matchesSearch =
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.description
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        item.owner.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All Status" || item.status === statusFilter;

      const matchesFromDate = !fromDate || itemDate >= new Date(fromDate);

      const matchesToDate = !toDate || itemDate <= new Date(toDate);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesFromDate &&
        matchesToDate
      );
    });
  }, [debouncedSearch, categoryFilter, statusFilter, fromDate, toDate, lostItems]);

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleQRClick = (item) => {
    setSelectedItem(item);
    setIsQRModalOpen(true);
  };

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setStatusFilter("All Status");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="p-6 space-y-6 bg-[#EEF1F8]">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Lost Items Management
          </h1>
          <p className="text-gray-500 text-sm">
            Admin-only access for managing lost item reports
          </p>
        </div>

        <button 
          onClick={() => setShowAdminReport(true)}
          className="cursor-pointer flex items-center gap-2 bg-[#7B1C1C] hover:bg-red-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-red-900/10"
        >
          <Plus size={18} />
          Encode Lost Item
        </button>
      </div>

      {/* FILTER CARD */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex justify-between">
          <h2 className="font-bold text-lg">Filter Lost Items</h2>

          <button
            onClick={clearFilters}
            className="cursor-pointer font-semibold text-sm text-green-600 hover:underline"
          >
            Clear All Filters
          </button>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {/* SEARCH */}
          <div>
            <label className="text-sm font-semibold">Search</label>

            <div className="flex items-center relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items..."
                className="w-full border border-gray-400 rounded-lg pl-9 pr-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* CATEGORY */}
          <div>
            <label className="text-sm font-semibold">Category</label>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="cursor-pointer w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label className="text-sm font-semibold">Status</label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="cursor-pointer w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
            >
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* FROM DATE */}
          <div>
            <label className="text-sm font-semibold">From Date</label>

            <div className="relative">
              <Calendar
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                onFocus={(e) => e.target.showPicker?.()}
                onClick={(e) => e.target.showPicker?.()}
                className="cursor-pointer w-full border border-gray-400 rounded-lg pl-9 pr-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* TO DATE */}
          <div>
            <label className="text-sm font-semibold">To Date</label>

            <div className="relative">
              <Calendar
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                onFocus={(e) => e.target.showPicker?.()}
                onClick={(e) => e.target.showPicker?.()}
                className="cursor-pointer w-full border border-gray-400 rounded-lg pl-9 pr-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
        <div className="p-5 font-bold text-lg border-b border-slate-200 bg-slate-50/50">
          Filter Lost Items ({filteredItems.length})
        </div>

        <table className="w-full text-sm border-collapse">
          <thead className="bg-slate-50 text-slate-500">
            <tr className="border-b border-slate-200">
              {tableHeaders.map((header, i) => (
                <th key={i} className={`px-6 py-4 uppercase text-[11px] font-black tracking-widest ${header.align}`}>
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="7" className="py-20 text-center text-slate-400 font-medium">Loading items...</td></tr>
            ) : filteredItems.length === 0 ? (
              <tr><td colSpan="7" className="py-20 text-center text-slate-400 font-medium">No items found matching your criteria.</td></tr>
            ) : filteredItems.map((item, i) => (
              <tr key={item.id || i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5">
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-slate-500 text-xs line-clamp-1">{item.description}</p>
                </td>

                <td className="px-6 py-5">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                    {item.category}
                  </span>
                </td>

                <td className="px-6 py-5 text-slate-600 font-medium max-w-[200px] truncate">
                  {item.location}
                </td>

                <td className="px-6 py-5">
                  <p className="font-bold text-slate-900">{item.owner}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{item.email}</p>
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      statusStyles[item.status] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-6 py-5 text-slate-500 font-medium">{item.formattedDate}</td>

                <td className="px-6 py-5">
                  <div className="flex justify-center gap-3">
                    <TooltipIcon
                      icon={Eye}
                      color="text-slate-400 hover:text-green-600"
                      label="View Details"
                      onClick={() => handleViewItem(item)}
                    />

                    <TooltipIcon
                      icon={QrCode}
                      color="text-slate-400 hover:text-purple-600"
                      label="Generate QR"
                      onClick={() => handleQRClick(item)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <LostItemDetailsModal
          item={selectedItem}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isQRModalOpen && (
        <QRModal
          item={selectedItem}
          onClose={() => setIsQRModalOpen(false)}
        />
      )}

      <AdminReportLost 
        isOpen={showAdminReport} 
        onClose={() => {
          setShowAdminReport(false);
          fetchLostItems(); // Refresh list after report
        }} 
      />
    </div>
  );
}