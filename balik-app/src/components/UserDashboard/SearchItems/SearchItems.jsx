import { useState, useEffect } from "react";
import {
  Search,
  ShieldCheck,
  X,
  MapPin,
  Calendar,
  User,
  CheckCircle,
} from "lucide-react";
import DatePicker from "react-datepicker";
import { itemService } from "../../../services/itemService";
import { nlpService } from "../../../services/nlpService";

import iphoneImg from "../../../assets/home-assets/img-items/iphone.png";
import bagImg from "../../../assets/home-assets/img-items/bag.png";
import keysImg from "../../../assets/home-assets/img-items/keys.png";
import walletImg from "../../../assets/home-assets/img-items/wallet.png";
import glassesImg from "../../../assets/home-assets/img-items/glasses.png";
import bottleImg from "../../../assets/home-assets/img-items/bottle.png";

const categories = ["All Items", "Electronics", "Accessories", "Bags", "Documents", "Others"];

export default function SubmitReport() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showClaim, setShowClaim] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    try {
      let embedding = null;
      if (searchQuery && searchQuery.trim().length > 2) {
        // Generate embedding for smart search (must be > 2 chars to be meaningful)
        embedding = await nlpService.generateEmbedding(searchQuery);
      }

      const data = await itemService.searchItems({
        query: searchQuery,
        category: activeCategory,
        type: 'found',
        embedding
      });
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeCategory, searchQuery]);

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    lostLocation: "",
    lostDate: "",
    description: "",
    category: "",
    otherCategory: "",
    identifiers: "",

    itemType: "",
    colorMaterial: "",
    uniqueMarks: "",
    brand: "",
    insideItems: "",
    secretItem: "",
    lastSeen: "",
  });

  // Filtering is now handled by the fetchItems call to Supabase
  const filteredItems = items;

  const validateStep1 = () => {
    const e = {};
    if (!form.fullName) e.fullName = true;
    if (!form.mobile) e.mobile = true;
    if (!form.lostLocation) e.lostLocation = true;
    if (!form.lostDate) e.lostDate = true;
    if (!form.description) e.description = true;
    if (!form.category) e.category = true;
    if (!form.identifiers) e.identifiers = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Recently Reported Items
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Browse all found items reported by the community. Click on any item to
          view details and submit a claim request.
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="mb-6 flex gap-3 rounded-xl border border-blue-500 bg-blue-50 p-4">
        <ShieldCheck size={24} className="text-blue-500" />
        <div>
          <p className="font-bold text-slate-900">Privacy Protection</p>
          <p className="text-sm text-blue-500">
            Only found items are publicly searchable to protect privacy. Your
            lost item reports are stored securely for automated matching and
            admin review only.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border-none bg-transparent text-sm outline-none"
        />
      </div>

      {/* Categories */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition ${activeCategory === cat
              ? "bg-blue-600 text-white"
              : "border border-slate-300 bg-white text-slate-700"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm flex flex-col"
            >
              <div className="relative">
                <img
                  src={item.image_url || iphoneImg}
                  alt={item.title}
                  className="h-56 w-full object-cover"
                />
                <span className="absolute right-3 top-3 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                  Verified
                </span>
                <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white uppercase">
                  {item.type}
                </span>
                {item.similarity > 0 && (
                  <span className="absolute right-3 bottom-3 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-sm z-10">
                    {(item.similarity * 100).toFixed(0)}% Match
                  </span>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-slate-900 truncate">{item.title}</h3>
                <span className="mt-1 inline-block rounded-md bg-slate-200 px-2 py-0.5 text-xs text-slate-700 w-fit">
                  {item.category}
                </span>
                <p className="mt-2 text-sm text-slate-600 line-clamp-2 min-h-[40px]">{item.description}</p>
                <div className="mt-auto pt-3 flex justify-between text-[11px] text-slate-500 border-t">
                  <span className="flex items-center gap-1">📍 {item.location}</span>
                  <span className="flex items-center gap-1">📅 {new Date(item.date_reported).toLocaleDateString()}</span>
                </div>
                <button
                  onClick={() => setSelectedItem(item)}
                  className="cursor-pointer mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                >
                  View details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-center">
            <p className="text-slate-500 font-medium">No items matching your search</p>
            <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-300 px-6 py-4 bg-white">
              <h2 className="text-lg font-semibold">Item Details</h2>
              <button onClick={() => setSelectedItem(null)}>
                <X className="cursor-pointer h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto modal-scroll" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style>{`
                .modal-scroll::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {/* Image */}
              <div className="relative p-6 pb-0">
                <img
                  src={selectedItem.image_url || iphoneImg}
                  alt={selectedItem.title}
                  className="h-56 w-full rounded-xl object-cover"
                />
                <span className="absolute left-8 top-8 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Found Item
                </span>
              </div>

              {/* Content */}
              <div className="px-6 py-4">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-lg font-bold text-slate-900">{selectedItem.title}</h3>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 shrink-0">ID: {selectedItem.id.substring(0, 8)}</span>
                </div>

                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {selectedItem.description}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <Info
                    icon={CheckCircle}
                    label="Category"
                    value={selectedItem.category}
                  />
                  <Info
                    icon={MapPin}
                    label="Location"
                    value={selectedItem.location}
                  />
                  <Info icon={Calendar} label="Date Reported" value={new Date(selectedItem.date_reported).toLocaleDateString()} />
                  <Info icon={User} label="Reporter" value={selectedItem.metadata?.reporter?.name || "Anonymous"} />
                </div>

                <div className="mt-6 rounded-xl border border-blue-500 bg-blue-50 p-4 text-sm">
                  <div className="flex items-center gap-2 font-semibold text-blue-600">
                    <CheckCircle className="h-4 w-4" />
                    AI-Verified Match {selectedItem.similarity ? `- ${(selectedItem.similarity * 100).toFixed(1)}% Confidence` : ''}
                  </div>
                  <p className="mt-1 text-xs text-blue-600 leading-relaxed">
                    {selectedItem.similarity
                      ? `Our NLP model detected a strong semantic match between your search and this item's description.`
                      : `This item appears in your results based on category or keyword matching.`}
                    You can submit a claim request to verify ownership with the reporter or admin.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 z-10 border-t border-gray-300 px-6 py-4 bg-white">
              <button
                onClick={() => {
                  setForm((prev) => ({
                    ...prev,
                    category: selectedItem.category,
                  }));
                  setShowClaim(true);
                  setStep(1);
                }}
                className="cursor-pointer w-full rounded-lg bg-green-500 py-2 text-sm font-semibold text-white hover:bg-green-600 transition"
              >
                Claim this Item
              </button>
            </div>
          </div>
        </div>
      )}

      {showClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between border-b px-6 py-4 bg-white">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {step === 1 ? "Claiming Request Form" : "Security Questions"}
                </h2>
                {step === 2 && (
                  <p className="text-xs text-slate-400">
                    (Auto-generated based on item)
                  </p>
                )}
                <p className="mt-1 text-sm text-slate-500">ITEM ID: 40257</p>
              </div>
              <button onClick={() => setShowClaim(false)}>
                <X className="cursor-pointer h-5 w-5 text-slate-400" />
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 modal-scroll" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style>{`
                .modal-scroll::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {step === 1 ? (
                <>
                  {/* PAGE 1 — Contact Information & Item Ownership Details */}
                  <div className="space-y-4">
                    {/* Contact Information */}
                    <p className="text-sm font-semibold text-slate-800">
                      Contact Information
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={form.fullName}
                          onChange={(e) => {
                            setForm({ ...form, fullName: e.target.value });
                            setErrors((prev) => ({ ...prev, fullName: false }));
                          }}
                          className={`w-full rounded-lg border px-4 py-2 text-sm ${errors.fullName
                            ? "border-red-500"
                            : "border-slate-300"
                            }`}
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={form.mobile}
                          onChange={(e) => {
                            setForm({ ...form, mobile: e.target.value });
                            setErrors((prev) => ({ ...prev, mobile: false }));
                          }}
                          className={`w-full rounded-lg border px-4 py-2 text-sm ${errors.mobile
                            ? "border-red-500"
                            : "border-slate-300"
                            }`}
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Email Address{" "}
                          <span className="pl-1 text-black/40 ">
                            (Optional)
                          </span>
                        </label>
                        <input
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Lost Location <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={form.lostLocation}
                          onChange={(e) => {
                            setForm({ ...form, lostLocation: e.target.value });
                            setErrors((prev) => ({
                              ...prev,
                              lostLocation: false,
                            }));
                          }}
                          className={`w-full rounded-lg border px-4 py-2 text-sm ${errors.lostLocation
                            ? "border-red-500"
                            : "border-slate-300"
                            }`}
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Lost Date <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                          <Calendar className="cursor-pointer pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                          <DatePicker
                            selected={
                              form.lostDate ? new Date(form.lostDate) : null
                            }
                            onChange={(date) => {
                              setForm({
                                ...form,
                                lostDate: date
                                  ? date.toISOString().split("T")[0]
                                  : "",
                              });
                              setErrors((prev) => ({
                                ...prev,
                                lostDate: false,
                              }));
                            }}
                            maxDate={new Date()}
                            placeholderText="Select date"
                            dateFormat="MMMM d, yyyy"
                            todayButton="Today"
                            showPopperArrow={false}
                            className={`cursor-pointer w-full rounded-lg border py-2 pl-10 pr-4 text-sm ${errors.lostDate
                              ? "border-red-500"
                              : "border-slate-300"
                              }`}
                            calendarClassName="rounded-xl shadow-lg"
                          />
                        </div>
                      </div>

                      <div className="col-span-2">
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Item Description{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          value={form.description}
                          onChange={(e) => {
                            setForm({ ...form, description: e.target.value });
                            setErrors((prev) => ({
                              ...prev,
                              description: false,
                            }));
                          }}
                          className={`w-full rounded-lg border px-4 py-2 text-sm ${errors.description
                            ? "border-red-500"
                            : "border-slate-300"
                            }`}
                        />
                      </div>
                    </div>

                    {/* Item Ownership Details */}
                    <p className="mt-4 text-sm font-semibold text-slate-800">
                      Item Ownership Details (Primary Verification)
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="mb-2 block text-xs font-medium text-slate-700 italic">
                          Item Category <span className="text-red-500">*</span>
                        </label>

                        <div className="flex flex-wrap gap-3">
                          {categories
                            .filter((c) => c !== "All Items")
                            .map((cat) => (
                              <label
                                key={cat}
                                className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              >
                                <input
                                  type="radio"
                                  name="category"
                                  value={cat}
                                  checked={form.category === cat}
                                  onChange={(e) => {
                                    setForm({
                                      ...form,
                                      category: e.target.value,
                                    });
                                    setErrors((prev) => ({
                                      ...prev,
                                      category: false,
                                    }));
                                  }}
                                />
                                {cat}
                              </label>
                            ))}

                          {/* Others option */}
                          <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm">
                            <input
                              type="radio"
                              name="category"
                              value="Others"
                              checked={form.category === "Others"}
                              onChange={() => {
                                setForm({
                                  ...form,
                                  category: "Others",
                                  otherCategory: "",
                                });
                                setErrors((prev) => ({
                                  ...prev,
                                  category: false,
                                }));
                              }}
                            />
                            Others:
                            <input
                              type="text"
                              placeholder="Specify..."
                              value={form.otherCategory || ""}
                              disabled={form.category !== "Others"}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  otherCategory: e.target.value,
                                })
                              }
                              className="cursor-text ml-1 w-32 rounded border-b border-slate-300 px-2 py-0.5 text-xs disabled:bg-slate-100"
                            />
                          </label>
                        </div>

                        {errors.category && (
                          <p className="mt-1 text-xs text-red-500">
                            Please select a category.
                          </p>
                        )}
                      </div>

                      <div className="col-span-2">
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Unique Identifiers
                        </label>
                        <textarea
                          rows={2}
                          value={form.identifiers}
                          onChange={(e) => {
                            setForm({ ...form, identifiers: e.target.value });
                            setErrors((prev) => ({
                              ...prev,
                              identifiers: false,
                            }));
                          }}
                          className={`w-full rounded-lg border px-4 py-2 text-sm ${errors.identifiers
                            ? "border-red-500"
                            : "border-slate-300"
                            }`}
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Photo{" "}
                          <span className="pl-1 text-black/40">(Optional)</span>
                        </label>

                        <div className="flex items-center gap-3 border rounded-lg border-gray-400">
                          {/* Hidden input */}
                          <input
                            id="photo-upload"
                            type="file"
                            accept="image/png, image/jpeg, image/gif"
                            onChange={handleFileChange}
                            className="hidden"
                          />

                          {/* Choose button */}
                          <label
                            htmlFor="photo-upload"
                            className="cursor-pointer rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300"
                          >
                            {file ? "Change File" : "Choose File"}
                          </label>

                          {/* File name */}
                          <span className="text-sm text-slate-500">
                            {file ? file.name : "No file chosen"}
                          </span>

                          {/* Remove button */}
                          {file && (
                            <button
                              type="button"
                              onClick={() => setFile(null)}
                              className="rounded-lg border border-red-300 px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        {/* Optional image preview */}
                        {file && (
                          <div className="mt-3">
                            <img
                              src={URL.createObjectURL(file)}
                              alt="Preview"
                              className="h-24 rounded-lg border object-cover"
                            />
                          </div>
                        )}

                        <p className="mt-1 text-xs text-slate-400">
                          Supported formats: JPG, PNG, GIF (Max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* PAGE 2 — Item Details */}
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-slate-800">
                      Item Specific Details
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Item Type
                        </label>
                        <input
                          value={form.itemType}
                          onChange={(e) =>
                            setForm({ ...form, itemType: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Color / Material
                        </label>
                        <input
                          value={form.colorMaterial}
                          onChange={(e) =>
                            setForm({ ...form, colorMaterial: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Unique Marks / Features
                        </label>
                        <input
                          value={form.uniqueMarks}
                          onChange={(e) =>
                            setForm({ ...form, uniqueMarks: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Brand / Logo (if any)
                        </label>
                        <input
                          value={form.brand}
                          onChange={(e) =>
                            setForm({ ...form, brand: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Inside Contents (if applicable)
                        </label>
                        <input
                          value={form.insideItems}
                          onChange={(e) =>
                            setForm({ ...form, insideItems: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Distinct Item Only You Would Know
                        </label>
                        <input
                          value={form.secretItem}
                          onChange={(e) =>
                            setForm({ ...form, secretItem: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Last Seen Details
                        </label>
                        <input
                          value={form.lastSeen}
                          onChange={(e) =>
                            setForm({ ...form, lastSeen: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* FOOTER */}
            <div className="sticky bottom-0 z-10 flex gap-4 border-t px-6 py-4 bg-white">
              <button
                onClick={() => {
                  if (step === 1) {
                    setShowClaim(false);
                  } else {
                    setStep(1);
                  }
                }}
                className="cursor-pointer flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (step === 1) {
                    if (validateStep1()) {
                      setStep(2);
                    }
                  } else {
                    console.log("Submit", form);
                  }
                }}
                className="cursor-pointer flex-1 rounded-lg bg-green-500 py-2 text-sm font-medium text-white hover:bg-green-600 transition"
              >
                {step === 1 ? "Next" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* helper */
function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-blue-500" />
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="font-medium text-slate-700">{value}</p>
      </div>
    </div>
  );
}
