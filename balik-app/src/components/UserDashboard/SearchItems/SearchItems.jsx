import { useState } from "react";
import {
  Search,
  ShieldCheck,
  X,
  MapPin,
  Calendar,
  User,
  CheckCircle,
} from "lucide-react";

import iphoneImg from "../../../assets/home-assets/img-items/iphone.png";
import bagImg from "../../../assets/home-assets/img-items/bag.png";
import keysImg from "../../../assets/home-assets/img-items/keys.png";
import walletImg from "../../../assets/home-assets/img-items/wallet.png";
import glassesImg from "../../../assets/home-assets/img-items/glasses.png";
import bottleImg from "../../../assets/home-assets/img-items/bottle.png";

const categories = ["All Items", "Electronics", "Accessories", "Bags"];

const items = [
  {
    id: 1,
    title: "iPhone 15",
    category: "Electronics",
    tag: "Electronics",
    description:
      "Black iPhone 15 with baby blue phone case, found in Main Bldg",
    location: "PUP - Main Bldg",
    date: "2025-11-28",
    image: iphoneImg,
  },
  {
    id: 2,
    title: "Brown Leather Bag",
    category: "Bags",
    tag: "Bag",
    description: "Brown leather bag with books inside, found in Main Library",
    location: "PUP - Main Library",
    date: "2025-11-28",
    image: bagImg,
  },
  {
    id: 3,
    title: "Car Keys",
    category: "Accessories",
    tag: "Accessories",
    description: "Toyota car keys remote with black fur key chains.",
    location: "PUP - Itech Parking",
    date: "2025-11-28",
    image: keysImg,
  },
  {
    id: 4,
    title: "Black Leather Wallet",
    category: "Accessories",
    tag: "Accessories",
    description: "YSL black leather wallet containing credit cards and ID.",
    location: "PUP - Lagoon",
    date: "2025-11-28",
    image: walletImg,
  },
  {
    id: 5,
    title: "Prescription Glasses",
    category: "Accessories",
    tag: "Accessories",
    description: "Black frame prescription glasses with white cleaning cloth.",
    location: "PUP - CEA",
    date: "2025-11-28",
    image: glassesImg,
  },
  {
    id: 6,
    title: "Water Bottle",
    category: "Accessories",
    tag: "Accessories",
    description: "White Aquaflask water bottle, found in Itech Lab 105.",
    location: "PUP - Itech Lab 105",
    date: "2025-11-28",
    image: bottleImg,
  },
];

export default function SubmitReport() {
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showClaim, setShowClaim] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    lostLocation: "",
    lostDate: "",
    identifiers: "",
    description: "",

    itemType: "",
    colorMaterial: "",
    uniqueMarks: "",
    brand: "",
    insideItems: "",
    secretItem: "",
    lastSeen: "",
  });

  const filteredItems =
    activeCategory === "All Items"
      ? items
      : items.filter((item) => item.category === activeCategory);

  const validateStep1 = () => {
    const e = {};
    if (!form.fullName) e.fullName = true;
    if (!form.mobile) e.mobile = true;
    if (!form.lostLocation) e.lostLocation = true;
    if (!form.lostDate) e.lostDate = true;
    if (!form.description) e.description = true;
    setErrors(e);
    return Object.keys(e).length === 0;
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
          className="w-full border-none bg-transparent text-sm outline-none"
        />
      </div>

      {/* Categories */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeCategory === cat
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
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl bg-white shadow-sm"
          >
            <div className="relative">
              <img
                src={item.image}
                alt={item.title}
                className="h-56 w-full object-cover"
              />
              <span className="absolute right-3 top-3 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                Verified
              </span>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-slate-900">{item.title}</h3>

              <span className="mt-1 inline-block rounded-md bg-slate-200 px-2 py-0.5 text-xs text-slate-700">
                {item.tag}
              </span>

              <p className="mt-2 text-sm text-slate-600">{item.description}</p>

              <div className="mt-3 flex justify-between text-xs text-slate-500">
                <span>📍 {item.location}</span>
                <span>📅 {item.date}</span>
              </div>

              <button
                onClick={() => setSelectedItem(item)}
                className="cursor-pointer mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white"
              >
                View details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-300 px-6 py-4">
              <h2 className="text-lg font-semibold">Item Details</h2>
              <button onClick={() => setSelectedItem(null)}>
                <X className="cursor-pointer h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* Image */}
            <div className="relative p-6 pb-0">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="h-56 w-full rounded-xl object-cover"
              />
              <span className="absolute left-8 top-8 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Found Item
              </span>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-bold">{selectedItem.title}</h3>
                <span className="text-xs text-slate-400">ITEM ID: 40257</span>
              </div>

              <p className="mt-1 text-sm text-slate-600">
                {selectedItem.description}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
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
                <Info icon={Calendar} label="Date" value={selectedItem.date} />
                <Info icon={User} label="Reported By" value="Dj Mod Kalkal" />
              </div>

              <div className="mt-5 rounded-xl border border-blue-500 bg-blue-50 p-4 text-sm">
                <div className="flex items-center gap-2 font-semibold text-blue-600">
                  <CheckCircle className="h-4 w-4" />
                  95% Match with your search
                </div>
                <p className="mt-1 text-xs text-blue-600">
                  This item closely matches your search criteria based on
                  category, location, and description.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 border-t border-gray-300 px-6 py-4">
              <button
                onClick={() => {
                  setShowClaim(true);
                  setSelectedItem(null);
                }}
                className="cursor-pointer flex-1 rounded-lg bg-green-500 py-2 text-sm font-semibold text-white"
              >
                Claim this Item
              </button>

              <button
                onClick={() => setSelectedItem(null)}
                className="cursor-pointer flex-1 rounded-lg border border-slate-300 py-2 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between border-b px-6 py-4">
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
            <div className="px-6 py-5 space-y-6 overflow-y-auto">
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
                          onChange={(e) =>
                            setForm({ ...form, fullName: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={form.mobile}
                          onChange={(e) =>
                            setForm({ ...form, mobile: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Email Address
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
                          onChange={(e) =>
                            setForm({ ...form, lostLocation: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Lost Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={form.lostDate}
                          onChange={(e) =>
                            setForm({ ...form, lostDate: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Item Description{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          value={form.description}
                          onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                        />
                      </div>
                    </div>

                    {/* Item Ownership Details */}
                    <p className="mt-4 text-sm font-semibold text-slate-800">
                      Item Ownership Details (Primary Verification)
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="mb-1 block text-xs font-medium text-slate-700 italic">
                          Item Category <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={selectedItem?.title || ""}
                          readOnly
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm bg-slate-100"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Unique Identifiers
                        </label>
                        <textarea
                          rows={2}
                          value={form.identifiers}
                          onChange={(e) =>
                            setForm({ ...form, identifiers: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Photo (Optional)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
                        />
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
            <div className="sticky bottom-0 z-10 flex gap-4 border-t px-6 py-4">
              <button
                onClick={() => (step === 1 ? setShowClaim(false) : setStep(1))}
                className="cursor-pointer flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white"
              >
                Back
              </button>
              <button
                onClick={() => (step === 1 ? setStep(2) : null)}
                className="cursor-pointer flex-1 rounded-lg bg-green-500 py-2 text-sm font-medium text-white"
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
