import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  RefreshCw,
  Loader2,
  MapPin,
  Files,
  CheckCircle,
  FileBadge,
  Calendar,
  Edit,
  Trash2,
  ClockFading,
  X,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import ColorPicker from "../../../shared/components/ColorPicker";
import MapPicker from "../../../shared/components/MapPicker";

const CATEGORIES = [
  "Electronics",
  "Personal Items",
  "Accessories",
  "Wallets/Bags",
  "Documents",
  "Keys",
  "Others",
];

const typeStyles = {
  lost: "bg-red-200 text-red-800",
  found: "bg-green-200 text-green-800",
  resolved: "bg-blue-200 text-blue-800",
};

const statusStyles = {
  "report submitted": "bg-gray-100 text-gray-700 border border-gray-300",
  "under review": "bg-red-500 text-white border border-red-600",
  "waiting for matches": "bg-blue-100 text-blue-800 border border-blue-300",
  "potential matches found":
    "bg-yellow-500 text-white border border-yellow-600",
  "match found": "bg-green-500 text-white border border-green-600",
  "report submission approved":
    "bg-green-600 text-white border border-green-700",
  "successfully claimed": "bg-emerald-600 text-white border border-emerald-700",
};

const INITIAL_ITEMS = [
  {
    id: "ITEM-10137",
    title: "Canon DSLR Camera",
    category: "Electronics",
    location: "PUP-Main Library",
    date: "2025-09-10",
    time: "1 hour ago",
    type: "Lost",
    status: "Report Submitted",
    brand: "Canon",
    color: "#000000",
    additionalInfo: "Has a scratch on the lens cap.",
    image: null,
  },
  {
    id: "ITEM-20146",
    title: "Student ID Card",
    category: "Personal Items",
    location: "PUP-ITech Lab 105",
    date: "2025-09-10",
    time: "1 hour ago",
    type: "Found",
    status: "Under Review",
    brand: "PUP",
    color: "#FFFFFF",
    additionalInfo: "Found under the 3rd row desk.",
    image: null,
  },
  {
    id: "ITEM-30146",
    title: "Green Card Holder",
    category: "Personal Items",
    location: "PUP-Lagoon",
    date: "2025-09-10",
    time: "1 hour ago",
    type: "Found",
    status: "Potential Matches Found",
    brand: "",
    color: "#22c55e",
    additionalInfo: "",
    image: null,
  },
];

export default function TrackItems() {
  useEffect(() => {
    document.title = "Track Items - BALIK System";

    return () => {
      document.title = "Balik System";
    };
  }, []);

  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Data State
  const [items, setItems] = useState(INITIAL_ITEMS);

  // Edit Modal State
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "",
    date: "",
    brand: "",
    location: "",
    color: "",
    additionalInfo: "",
  });
  const [newPhoto, setNewPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Map Modal State
  const [showMapPicker, setShowMapPicker] = useState(false);

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditFormData({
      title: item.title || "",
      category: item.category || "",
      date: item.date || "",
      brand: item.brand || "",
      location: item.location || "",
      color: item.color || "#cccccc",
      additionalInfo: item.additionalInfo || "",
    });
    setPhotoPreview(item.image || null);
    setNewPhoto(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
    setPhotoPreview(null);
    setNewPhoto(null);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === editingId ? { ...item, ...editFormData } : item,
      ),
    );
    handleCancelEdit();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setIsDeleting(true);
    // Simulate API delay
    setTimeout(() => {
      setItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemToDelete),
      );
      setIsDeleting(false);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }, 600);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);

    // Simulate API fetch/loading delay
    setTimeout(() => {
      setSearchQuery("");
      setFilter("All");
      setIsRefreshing(false);
    }, 1200);
  };

  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === "All" || item.type === filter;
    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F9F6F0] p-8 transition-all duration-300">
      {/* Main Content */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto">
          {/* Header Container - Hidden on lg and above */}
          <div className="mb-6 lg:hidden animate-fade-in">
            <h1 className="text-3xl font-black tracking-tight text-[#66240E]">
              Item Tracking Overview
            </h1>
            <p className="mt-1.5 text-sm font-semibold text-[#997C68] leading-relaxed">
              Track all your reported lost and found items in one place.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 lg:mb-10">
            <StatCard
              index={0} // Plays immediately
              title="Total Items"
              subtitle="All reported items"
              value={items.length}
              icon={Files}
              glowA="bg-violet-400"
              glowB="bg-fuchsia-400"
              iconGrad="from-violet-500 to-fuchsia-600"
              textGrad="from-violet-700 to-fuchsia-900"
              chartColor="text-violet-500"
              trend="+12% active"
            />
            <StatCard
              index={1} // Delays 150ms
              title="Lost Items"
              subtitle="Currently lost"
              value={items.filter((i) => i.type === "Lost").length}
              icon={Search}
              glowA="bg-rose-400"
              glowB="bg-orange-400"
              iconGrad="from-rose-500 to-orange-500"
              textGrad="from-rose-700 to-orange-900"
              chartColor="text-rose-500"
              trend="+4% unresolved"
            />
            <StatCard
              index={2} // Delays 300ms
              title="Found Items"
              subtitle="Recovered items"
              value={items.filter((i) => i.type === "Found").length}
              icon={FileBadge}
              glowA="bg-emerald-400"
              glowB="bg-teal-400"
              iconGrad="from-emerald-400 to-teal-600"
              textGrad="from-emerald-700 to-teal-900"
              chartColor="text-emerald-500"
              trend="+8% matched"
            />
            <StatCard
              index={3} // Delays 450ms
              title="Resolved"
              subtitle="Items claimed"
              value={items.filter((i) => i.type === "Resolved").length}
              icon={CheckCircle}
              glowA="bg-blue-400"
              glowB="bg-cyan-400"
              iconGrad="from-blue-500 to-cyan-500"
              textGrad="from-blue-700 to-cyan-900"
              chartColor="text-blue-500"
              trend="100% verified"
            />
          </div>

          {/* Timeline */}
          <div className="bg-[#F7F1E6] rounded-4xl p-6 shadow-sm border border-[#EDD9CC]">
            <h3 className="text-xl font-black mb-4 text-[#572F1A]">
              Recent Activity Timeline
            </h3>

            <div className="mb-6 flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label
                  htmlFor="filter"
                  className="text-base font-semibold text-slate-500"
                >
                  Filter:{" "}
                </label>
                <select
                  name="filter"
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  disabled={isRefreshing}
                  className="w-full sm:w-32 border border-[#E2DCD0] rounded-3xl bg-white px-4 py-3 text-base font-medium text-slate-700 outline-none focus-within:ring-[#DBC8BD] focus:ring-1 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="All">All</option>
                  <option value="Lost">Lost</option>
                  <option value="Found">Found</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {/* Search input container alongside the refresh button */}
              <div className="flex flex-1 w-full items-center gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-3xl border border-[#E2DCD0] bg-white px-4 py-3 focus-within:ring-1 focus-within:ring-[#DBC8BD] transition-shadow">
                  <Search size={18} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search tracking ID, title, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isRefreshing}
                    className="w-full border-none bg-transparent text-base font-medium text-slate-700 outline-none placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  title="Refresh and Reset Filters"
                  className={`p-3.5 bg-white text-[#572F1A] border border-[#E2DCD0] rounded-full shadow-sm flex items-center justify-center shrink-0 transition-all ${
                    isRefreshing
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-orange-50 active:scale-95 cursor-pointer"
                  }`}
                >
                  <RefreshCw
                    size={18}
                    strokeWidth={2.5}
                    className={
                      isRefreshing ? "animate-spin text-amber-600" : ""
                    }
                  />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {isRefreshing ? (
                // Loading Screen State
                <div className="bg-white/60 flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-200 rounded-3xl animate-pulse">
                  <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                    <Loader2
                      size={48}
                      className="text-amber-600 animate-spin"
                      strokeWidth={2.5}
                    />
                  </div>
                  <p className="text-slate-600 font-bold text-lg mb-1">
                    Fetching Latest Records...
                  </p>
                  <p className="text-slate-400 text-sm font-medium">
                    Syncing your items with the database.
                  </p>
                </div>
              ) : filteredItems.length > 0 ? (
                // Loaded Items State
                paginatedItems.map((item) => (
                  <TimelineItem
                    key={item.id}
                    {...item}
                    onEditClick={() => handleEditClick(item)}
                    onDeleteClick={() => handleDeleteClick(item.id)}
                  />
                ))
              ) : (
                // Empty State
                <div className="bg-white text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl animate-in fade-in duration-300">
                  <p className="text-slate-600 font-bold mb-1">
                    No items found matching your filters.
                  </p>
                  <p className="text-slate-400 text-sm font-medium">
                    Your reported items will appear here for tracking.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {filteredItems.length > ITEMS_PER_PAGE && (
                <div className="flex justify-end items-center gap-4 pt-6">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`px-5 py-2 rounded-full font-semibold border transition
                      ${
                        currentPage === 1
                          ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                          : "bg-white hover:bg-orange-50 border-[#E2DCD0] cursor-pointer"
                      }`}
                  >
                    Previous
                  </button>

                  <span className="text-sm font-semibold text-slate-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-5 py-2 rounded-full font-semibold border transition
                      ${
                        currentPage === totalPages
                          ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                          : "bg-white hover:bg-orange-50 border-[#E2DCD0] cursor-pointer"
                      }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Edit Modal */}
        {editingId &&
          createPortal(
            <div
              className="fixed inset-0 z-[9999] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 overflow-y-auto"
              onClick={handleCancelEdit}
              role="dialog"
              aria-modal="true"
            >
              <div
                className="relative bg-gradient-to-b from-[#FFFDFB] to-[#FFF5EA] w-full max-w-[92vw] sm:max-w-lg md:max-w-3xl lg:max-w-5xl rounded-4xl sm:rounded-4xl shadow-2xl flex flex-col my-auto max-h-[88vh] sm:max-h-[85vh] overflow-hidden border border-[#EBD2C4]/80 animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                  <div className="absolute -top-24 -right-24 w-60 h-60 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-[#EBD2C4] to-[#FDBA74] opacity-30 sm:opacity-40 blur-2xl sm:blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 w-52 h-52 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br from-[#FED7AA] to-[#EBD2C4] opacity-20 sm:opacity-30 blur-2xl sm:blur-3xl" />
                  <svg
                    className="absolute inset-0 w-full h-full opacity-[0.08] sm:opacity-[0.10]"
                    width="100%"
                    height="100%"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern
                        id="modalGrid"
                        width="32"
                        height="32"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 32 0 L 0 0 0 32"
                          fill="none"
                          stroke="#AD3218"
                          strokeWidth="0.75"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#modalGrid)" />
                  </svg>
                </div>

                {/* Header Block */}
                <div className="relative z-10 flex justify-between items-start px-3 pt-4 pb-1 sm:px-8 sm:pt-7 md:px-12 md:pt-8 xl:px-16 xl:pt-10 flex-shrink-0">
                  <div className="text-left pl-1 lg:pl-0">
                    <h2 className="text-2xl sm:text-2xl md:text-3xl xl:text-4xl text-[#5E3609] font-black uppercase mt-0.5 tracking-normal">
                      Edit Report
                    </h2>
                    <p className="text-[12px] pb-1 sm:pb-2 md:text-sm xl:text-base text-[#755E4E] leading-relaxed font-semibold mt-0.5 mb-1 sm:mb-3">
                      Update the details of your submitted report.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="p-1 sm:p-2.5 mr-2 sm:mr-0 text-slate-500 hover:text-slate-900 hover:bg-white/90 bg-white/60 backdrop-blur border border-slate-200/80 rounded-full transition active:scale-95 cursor-pointer shadow-sm relative z-50 mt-0.5 sm:mt-0 focus:outline-none focus:ring-2 focus:ring-amber-700 min-w-[34px] min-h-[34px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                  </button>
                </div>

                {/* Body Form */}
                <form
                  onSubmit={handleSaveEdit}
                  className="relative z-10 overflow-y-auto px-2 pb-4 pt-1 sm:px-6 sm:pb-8 md:px-10 md:pb-8 xl:px-16 xl:pb-10 flex-1 space-y-4 sm:space-y-6 min-w-0"
                >
                  {/* Card Container */}
                  <div className="relative z-[50] bg-white/95 backdrop-blur-md p-3 sm:p-6 md:p-8 xl:p-10 rounded-4xl sm:rounded-4xl shadow-xl space-y-4 sm:space-y-6 border border-white/90">
                    {/* Row 1: Title & Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 relative z-[90]">
                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-bold text-slate-700 text-sm sm:text-sm xl:text-base pl-0.5 uppercase tracking-wide">
                          Item Title <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={editFormData.title}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              title: e.target.value,
                            })
                          }
                          placeholder="e.g. Blue Backpack"
                          className="w-full p-3.5 sm:p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm sm:text-base outline-none focus:bg-white focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all shadow-sm font-medium min-h-[40px] sm:min-h-[46px]"
                        />
                      </div>

                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-bold text-slate-700 text-sm sm:text-sm xl:text-base pl-0.5 uppercase tracking-wide">
                          Category <span className="text-red-600">*</span>
                        </label>
                        <div className="relative w-full">
                          <select
                            required
                            value={editFormData.category}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                category: e.target.value,
                              })
                            }
                            className="cursor-pointer appearance-none w-full p-3.5 sm:p-3.5 pr-10 sm:pr-12 rounded-2xl border border-slate-200 bg-slate-50 font-semibold text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all min-h-[40px] sm:min-h-[46px]"
                          >
                            <option value="" disabled>
                              Select category
                            </option>
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-500 pointer-events-none transition-transform duration-300"
                            strokeWidth={2.5}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Date & Brand */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 relative z-[80]">
                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-bold text-slate-700 text-sm sm:text-sm xl:text-base pl-0.5 uppercase tracking-wide">
                          Date Reported <span className="text-red-600">*</span>
                        </label>
                        <div className="relative group cursor-pointer w-full">
                          <input
                            type="date"
                            required
                            value={editFormData.date}
                            max={new Date().toISOString().split("T")[0]}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                date: e.target.value,
                              })
                            }
                            onClick={(e) =>
                              e.target.showPicker && e.target.showPicker()
                            }
                            className="cursor-pointer w-[20rem] md:w-full p-3.5 sm:p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm sm:text-base outline-none focus:bg-white focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all shadow-sm font-medium min-h-[46px]"
                          />
                          <Calendar
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-hover:text-amber-700 transition-colors"
                            strokeWidth={2.5}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center gap-2 w-full">
                          <label className="font-bold text-slate-700 text-sm sm:text-sm xl:text-base block uppercase tracking-wide">
                            Brand Name
                          </label>
                          <span className="text-slate-400 text-[11px] sm:text-sm font-medium">
                            (Optional)
                          </span>
                        </div>
                        <input
                          type="text"
                          value={editFormData.brand}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              brand: e.target.value,
                            })
                          }
                          placeholder="e.g. Nike, Apple"
                          className="w-full p-3.5 sm:p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm sm:text-base outline-none focus:bg-white focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all shadow-sm font-medium min-h-[40px] sm:min-h-[46px]"
                        />
                      </div>
                    </div>

                    {/* Row 3: Photo Evidence & Color */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 relative z-[70]">
                      <div className="flex flex-col gap-1 w-full relative z-[60]">
                        <div className="pl-0.5 mt-1">
                          <div className="flex items-center gap-2">
                            <label className="font-bold text-slate-700 text-sm sm:text-sm xl:text-base block uppercase tracking-wide mb-[0.5px]">
                              Photo Evidence
                            </label>
                            <span className="text-slate-400 text-[11px] sm:text-sm font-medium">
                              (Optional)
                            </span>
                          </div>
                          <span className="text-[11px] sm:text-[0.8rem] text-slate-600 font-normal block">
                            Formats: JPG, PNG • Max: 5 MB
                          </span>
                        </div>
                        <div className="flex flex-row items-center gap-3 sm:gap-4 w-full">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="cursor-pointer w-full flex-1 h-auto p-1.5 border border-slate-200 rounded-2xl bg-slate-50 file:mr-2 file:py-2.5 file:px-3 file:cursor-pointer file:rounded-xl file:border-0 file:text-[13px] sm:file:text-sm file:font-bold file:bg-[#331e0c]/10 file:text-[#331e0c] uppercase text-sm sm:text-sm text-slate-500 font-medium file:transition-all hover:file:bg-[#331e0c]/15 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-700 min-h-[40px] sm:min-h-[46px]"
                          />
                          {photoPreview && (
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-slate-200 shadow-sm flex-shrink-0">
                              <img
                                src={photoPreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 w-full relative z-[95]">
                        <div className="pl-0.5">
                          <span className="font-bold text-slate-700 text-sm sm:text-sm xl:text-base block uppercase tracking-wide">
                            Item Color{" "}
                            <span className="text-red-600" aria-hidden="true">
                              *
                            </span>
                          </span>
                        </div>
                        <div className="w-full relative z-[999]">
                          <ColorPicker
                            value={editFormData.color}
                            onChange={(e) =>
                              setEditFormData((s) => ({
                                ...s,
                                color: e.target.value,
                              }))
                            }
                            label=""
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 4: Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 relative z-[60]">
                      <div className="flex flex-col gap-1 w-full relative">
                        <label className="font-bold text-slate-700 text-sm sm:text-sm xl:text-base pl-0.5 uppercase tracking-wide">
                          Location <span className="text-red-600">*</span>
                        </label>
                        <div className="relative flex items-center w-full">
                          <input
                            type="text"
                            required
                            value={editFormData.location}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                location: e.target.value,
                              })
                            }
                            placeholder="Type or pin map..."
                            className="w-full p-2.5 sm:p-3.5 pr-12 sm:pr-14 rounded-2xl border border-slate-200 bg-slate-50 text-sm sm:text-base outline-none focus:bg-white focus:ring-2 focus:ring-amber-700 focus:border-transparent transition-all shadow-sm font-medium min-h-[40px] sm:min-h-[46px]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowMapPicker(true)}
                            title="Pin location on map"
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-amber-700 hover:bg-orange-50 rounded-xl transition-all cursor-pointer flex items-center justify-center min-w-[34px] min-h-[34px] sm:min-w-[38px] sm:min-h-[38px]"
                          >
                            <MapPin size={18} strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                      <div className="hidden md:block w-full"></div>
                    </div>

                    {/* Additional Details */}
                    <div className="flex flex-col gap-1 w-full relative z-[50]">
                      <label className="font-bold text-slate-700 text-sm sm:text-sm xl:text-base pl-0.5 uppercase tracking-wide">
                        Additional Description Details
                      </label>
                      <textarea
                        rows={3}
                        value={editFormData.additionalInfo}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            additionalInfo: e.target.value,
                          })
                        }
                        placeholder="Specific markings, features, or unique items inside..."
                        className="w-full p-2.5 sm:p-3.5 rounded-2xl text-sm sm:text-base border border-slate-200 outline-none bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-700 focus:border-transparent resize-none transition-all shadow-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Action Row */}
                  <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-2 sm:gap-4 pt-1 w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto relative z-[40]">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="cursor-pointer w-full sm:w-1/2 px-4 py-2.5 sm:py-3.5 text-sm sm:text-base uppercase tracking-wider font-extrabold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-full transition active:scale-95 shadow-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-700 min-h-[38px] sm:min-h-[44px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="cursor-pointer w-full sm:w-1/2 bg-[#02A63E] text-white font-black py-2.5 sm:py-3.5 px-4 rounded-full shadow-lg hover:bg-[#028c34] hover:-translate-y-0.5 transition-all active:scale-95 uppercase tracking-wider text-sm sm:text-base text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 min-h-[38px] sm:min-h-[44px]"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>,
            document.body,
          )}

        {/* Delete Modal */}
        {showDeleteModal &&
          createPortal(
            <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
              <div className="bg-[#F0E7DD] rounded-[2.5rem] p-8 sm:p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 text-center relative border border-yellow-100/50">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="cursor-pointer absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors bg-white/50 w-10 h-10 rounded-full flex items-center justify-center"
                >
                  <X size={24} />
                </button>

                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 border-[2px] border-red-100/50 shadow-sm">
                    <AlertTriangle size={40} className="text-red-500" />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-[#374151] mb-4 tracking-wider uppercase">
                    Delete Report?
                  </h3>

                  <div className="space-y-4 text-[#4B5563] font-semibold mb-10 leading-relaxed text-center">
                    <p>
                      Are you sure you want to delete this report? This action{" "}
                      <span className="text-red-600 font-bold underline">
                        cannot be undone
                      </span>
                      .
                    </p>
                    <p className="text-xs font-normal sm:text-sm">
                      Removing this item will permanently delete it from our
                      system and all matching records.
                    </p>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row gap-4 w-full justify-center">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      disabled={isDeleting}
                      className="cursor-pointer flex-1 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-600 px-4 py-3 sm:py-4 rounded-4xl font-black transition-all active:scale-[0.98] text-base sm:text-lg uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      disabled={isDeleting}
                      className={`cursor-pointer flex-1 bg-red-600 hover:bg-red-700 text-white py-3 sm:py-4 rounded-4xl font-black px-4 shadow-lg shadow-red-200 transition-all active:scale-[0.98] text-base sm:text-lg uppercase tracking-wider flex justify-center items-center ${isDeleting ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      {isDeleting ? (
                        <p className="text-gray-200">Deleting ...</p>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )}

        {/* Map Picker */}
        {showMapPicker &&
          createPortal(
            <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
              <div className="bg-white rounded-[2.5rem] w-full max-w-4xl h-[85vh] overflow-hidden relative shadow-2xl flex flex-col text-left">
                <div className="p-6 sm:p-8 flex justify-between items-center border-b border-slate-50">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                      Pin Location
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                      Search or click on the map to mark the location.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowMapPicker(false)}
                    className="cursor-pointer p-2.5 hover:bg-slate-100 rounded-full text-slate-400 transition-all shrink-0"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="flex-1">
                  <MapPicker
                    onSelect={(addr) => {
                      setEditFormData((s) => ({ ...s, location: addr }));
                      setShowMapPicker(false);
                    }}
                    onClose={() => setShowMapPicker(false)}
                  />
                </div>
              </div>
            </div>,
            document.body,
          )}
      </main>

      {/* Tailwind Utility Styles specific for removing scrollbar in modal if needed */}
      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-up-fade {
          animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

function StatCard({
  title,
  subtitle,
  value,
  icon: Icon,
  glowA,
  glowB,
  iconGrad,
  textGrad,
  chartColor,
  trend,
  index = 0,
}) {
  return (
    <div
      className="group relative w-full rounded-[2rem] bg-white border border-[#E8E3D9] shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-500 overflow-hidden animate-slide-up-fade"
      style={{
        animationDelay: `${index * 150}ms`,
        animationFillMode: "both",
      }}
    >
      {/* Effects */}
      <div
        className={`absolute -top-10 -right-10 w-40 h-40 ${glowA} rounded-full mix-blend-multiply filter blur-[3rem] opacity-10 group-hover:opacity-30 transition-opacity duration-700`}
      />
      <div
        className={`absolute -bottom-10 -left-10 w-40 h-40 ${glowB} rounded-full mix-blend-multiply filter blur-[3rem] opacity-10 group-hover:opacity-30 transition-opacity duration-700`}
      />

      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

      {/* Inner Content Container */}
      <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full justify-between gap-4 sm:gap-6">
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-lg sm:text-lg font-black text-slate-800 tracking-tight truncate">
              {title}
            </p>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5 truncate uppercase tracking-wider">
              {subtitle}
            </p>
          </div>

          {/* Icon Box */}
          <div
            className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-[1.25rem] shrink-0 bg-gradient-to-br ${iconGrad} shadow-inner shadow-white/30 ring-1 ring-black/5 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500`}
          >
            {Icon && (
              <Icon
                size={24}
                strokeWidth={2.25}
                className="text-white drop-shadow-md sm:w-7 sm:h-7"
              />
            )}
          </div>
        </div>

        {/* Bottom Data Row */}
        <div className="flex items-end justify-between mt-2">
          {/* Text Counter */}
          <div className="shrink-0 max-w-[50%]">
            <p
              className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br ${textGrad} drop-shadow-sm truncate`}
            >
              {value}
            </p>
          </div>

          {/* Sparkline Graph */}
          <div className="flex flex-col items-end min-w-0">
            <span className="text-[11px] sm:text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider truncate max-w-full">
              {trend}
            </span>
            <svg
              className="w-16 h-5 sm:w-20 sm:h-6 opacity-30 group-hover:opacity-100 transition-opacity duration-500"
              viewBox="0 0 100 25"
              preserveAspectRatio="none"
            >
              <path
                d="M0 20 C 20 20, 30 5, 50 15 C 70 25, 80 5, 100 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                className={`text-slate-200 group-hover:${chartColor} transition-colors duration-500`}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({
  id,
  title,
  category,
  location,
  date,
  time,
  type,
  status,
  image,
  onEditClick,
  onDeleteClick,
}) {
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
  const typeClass =
    typeStyles[type.toLowerCase()] || "bg-gray-200 text-gray-700";
  const statusClass =
    statusStyles[status.toLowerCase()] || "bg-gray-200 text-gray-700";

  const displayStatus = status
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 border-[1.5px] border-[#E6DBD3] rounded-3xl p-3.5 sm:p-4 shadow-sm bg-white hover:border-[#DBC8BD] transition-colors w-full">
      {/* Image Block */}
      <div className="w-full sm:w-28 md:w-24 h-48 sm:h-28 md:h-24 bg-slate-50 rounded-[1.25rem] overflow-hidden border border-slate-100 shrink-0 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={title || category}
            className="w-full h-full object-cover"
          />
        ) : (
          <Files size={28} className="text-slate-300 shrink-0" />
        )}
      </div>

      {/* Info Block */}
      <div className="flex-1 min-w-0 w-full pt-1 sm:pt-0">
        {/* Title & ID Container */}
        <div className="flex items-center gap-2 mb-1 w-full min-w-0">
          <h4 className="font-bold text-base sm:text-lg md:text-base text-slate-800 truncate">
            {title || "Unknown Item"}
          </h4>
          <span className="text-[10px] text-slate-400 font-mono tracking-tight bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 shrink-0">
            {id}
          </span>
        </div>

        {/* Category */}
        <p className="mb-2 sm:mb-2.5 text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wide truncate">
          {category}
        </p>

        {/* Tags/Metadata Row */}
        <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2 mt-1 sm:mt-2">
          <div className="flex items-center gap-1.5 min-w-0 max-w-full">
            <MapPin size={14} className="text-slate-400 shrink-0" />
            <p className="text-[11px] sm:text-xs font-medium text-slate-600 truncate">
              {location}
            </p>
          </div>
          <div className="flex items-center gap-1.5 min-w-0 max-w-full">
            <Calendar size={14} className="text-slate-400 shrink-0" />
            <p className="text-[11px] sm:text-xs font-medium text-slate-600 truncate">
              {date}
            </p>
          </div>
          <div className="flex items-center gap-1.5 min-w-0 max-w-full">
            <ClockFading size={14} className="text-slate-400 shrink-0" />
            <p className="text-[11px] sm:text-xs font-medium text-slate-600 truncate">
              {time}
            </p>
          </div>
          <div
            className={`px-2 py-0.5 rounded text-center w-fit shrink-0 ${typeClass}`}
          >
            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
              {typeLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Action Block */}
      <div className="flex flex-row flex-wrap sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto sm:min-w-[130px] self-stretch pt-3 sm:pt-0 mt-3 sm:mt-0 border-t sm:border-t-0 border-slate-100 gap-3 sm:gap-2">
        {/* Status Badge */}
        <span
          className={`block w-fit whitespace-normal text-[9px] sm:text-[10px] md:text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full uppercase tracking-wider text-center ${statusClass}`}
        >
          {displayStatus}
        </span>

        {/* Buttons Container */}
        <div className="flex gap-2 shrink-0 sm:mt-auto">
          {/* Edit Button */}
          <button
            onClick={onEditClick}
            className="relative group cursor-pointer bg-blue-50 text-blue-700 p-2 sm:p-2.5 rounded-xl hover:bg-blue-100 transition border border-blue-100 shadow-sm"
            aria-label="Edit Report"
          >
            <Edit size={16} className="sm:w-5 sm:h-5 md:w-5 md:h-5 shrink-0" />
            {/* Edit Tooltip */}
            <span className="hidden sm:block pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100 z-10">
              Edit Report
            </span>
          </button>

          {/* Delete Button */}
          <button
            onClick={onDeleteClick}
            className="relative group cursor-pointer bg-red-50 text-red-600 p-2 sm:p-2.5 rounded-xl hover:bg-red-100 transition border border-red-100 shadow-sm"
            aria-label="Delete Report"
          >
            <Trash2
              size={16}
              className="sm:w-5 sm:h-5 md:w-5 md:h-5 shrink-0"
            />
            {/* Delete Tooltip */}
            <span className="hidden sm:block pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100 z-10">
              Delete Report
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}