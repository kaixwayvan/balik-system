import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Eye,
  CheckCircle,
  ScanQrCode,
  XCircle,
  Clock,
  Info,
} from "lucide-react";
import ClaimQrModal from "./ClaimQrModal";
import ClaimDetailsModal from "./ClaimDetailsModal";

// Mock Data Simulation
const mockUser = { id: "user_123", name: "Student Profile" };
const MOCK_CLAIMS = [
  {
    id: "cl_8f7d9a1",
    claimId: "CL-8F7D",
    title: "Black Leather Wallet",
    description: "Contains several IDs and a small amount of cash.",
    category: "Personal Items",
    foundAt: "Library, 2nd Floor",
    date: new Date().toLocaleDateString(),
    dateFound: new Date(Date.now() - 86400000).toLocaleDateString(),
    dateClaimed: new Date().toLocaleDateString(),
    status: "Approved",
    points: 50,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=400",
    qrCode: "BALIK-8F7D9A",
    booth: "Main Admin Booth",
    location: "Student Center, 1st Floor",
  },
  {
    id: "cl_2b4c6e8",
    claimId: "CL-2B4C",
    title: "Wireless Sony Headphones",
    description: "Black over-ear headphones with a scratch on the left cup.",
    category: "Electronics",
    foundAt: "Cafeteria",
    date: new Date(Date.now() - 172800000).toLocaleDateString(),
    dateFound: new Date(Date.now() - 259200000).toLocaleDateString(),
    dateClaimed: new Date(Date.now() - 172800000).toLocaleDateString(),
    status: "Pending",
    points: 0,
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400",
    qrCode: "BALIK-2B4C6E",
    booth: "Main Admin Booth",
    location: "Student Center, 1st Floor",
  },
];
// -----------------------------

const TABS = ["All Claims", "Pending", "Approved", "Released", "Rejected"];

const statusStyles = {
  approved: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  released: "bg-blue-100 text-blue-800 border-blue-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

export default function MyClaims() {
  useEffect(() => {
    document.title = "My Claims - BALIK System";

    return () => {
      document.title = "BALIK System";
    };
  }, []);

  const [activeTab, setActiveTab] = useState("All Claims");
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated Backend Fetch
    const fetchMyClaims = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setClaims(MOCK_CLAIMS);
      } catch (err) {
        console.error("Error fetching my claims:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyClaims();
  }, []);

  const filteredClaims =
    activeTab === "All Claims"
      ? claims
      : claims.filter(
          (c) => c.status.toLowerCase() === activeTab.toLowerCase(),
        );

  return (
    <div className="p-8 sm:p-8 md:p-8 bg-[#F9F6F0] min-h-screen transition-all duration-300">
      {/* Inline Styles */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.5s ease-out forwards; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Hidden Header for large screens */}
      <div className="lg:hidden animate-fade-in-up mb-6">
        <h1 className="text-3xl font-black tracking-tight text-[#66240E]">
          My Claims
        </h1>
        <p className="mt-1.5 text-sm font-semibold text-[#997C68] leading-relaxed">
          Track all your claimed items and review their current status.
        </p>
      </div>

      {/* Responsive Scrollable Tabs */}
      <div
        className="w-full sm:w-auto bg-[#FAF8F5] border border-[#E2DCD0] p-1 rounded-3xl shadow-sm inline-block animate-fade-in-up mb-6 lg:mb-8"
        style={{ animationDelay: "100ms" }}
      >
        <div
          className="grid grid-cols-2 sm:flex sm:flex-row gap-1 bg-none p-1"
          role="tablist"
          aria-label="Claim Status Tabs"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab)}
                className={`
            cursor-pointer group flex items-center justify-center gap-2 px-3 py-2.5 sm:px-5 sm:py-3 rounded-2xl text-xs font-black uppercase tracking-wider w-full sm:w-auto
            transition-all duration-300 ease-out transform active:scale-95 focus:outline-none
            ${
              isActive
                ? "bg-white text-[#801803] shadow-md border border-[#E2DCD0] scale-100"
                : "text-[#997C68] bg-transparent hover:text-[#8F1E1E] hover:bg-white/60 hover:scale-[1.02]"
            }
          `}
              >
                <span className="whitespace-nowrap transition-transform duration-300">
                  {tab}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-4 sm:space-y-6">
        {loading ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center animate-pulse">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">
              Fetching your claims securely...
            </p>
          </div>
        ) : filteredClaims.length > 0 ? (
          filteredClaims.map((item, index) => (
            <div
              key={item.id}
              className="group bg-white rounded-4xl shadow-sm hover:shadow-lg border border-gray-100 p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 animate-slide-up flex flex-col sm:flex-row gap-4 sm:gap-6"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Responsive Image */}
              <div className="w-full sm:w-36 md:w-48 shrink-0 overflow-hidden rounded-3xl">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-110 bg-gray-50"
                />
              </div>

              {/* Card Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                      {item.title}
                    </h2>
                    <span
                      className={`inline-flex items-center px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border ${
                        statusStyles[item.status.toLowerCase()] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 sm:line-clamp-none mb-4">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl">
                      <MapPin size={16} className="text-red-500" />
                      {item.foundAt}
                    </span>
                    <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl">
                      <Calendar size={16} className="text-blue-500" />
                      {item.date}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-5 sm:mt-6">
                  {item.status.toLowerCase() === "approved" && (
                    <button
                      onClick={() => {
                        setSelectedClaim(item);
                        setShowQrModal(true);
                      }}
                      className="cursor-pointer w-full sm:w-auto flex justify-center items-center gap-2 px-7 py-2.5 text-sm font-semibold bg-[#701302] hover:bg-red-800 text-white rounded-3xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 shadow-sm"
                    >
                      <ScanQrCode size={18} />
                      Show QR Code
                    </button>
                  )}

                  {item.status.toLowerCase() === "released" && (
                    <div className="cursor-not-allowed w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-green-50 text-green-700 rounded-3xl border border-green-200">
                      <CheckCircle size={18} />
                      Successfully Collected
                    </div>
                  )}

                  {item.status.toLowerCase() === "pending" && (
                    <div className="cursor-not-allowed w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-yellow-50 text-yellow-700 rounded-3xl border border-yellow-200">
                      <Clock size={18} />
                      Awaiting Verification
                    </div>
                  )}

                  {item.status.toLowerCase() === "rejected" && (
                    <div className="cursor-not-allowed w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-red-50 text-red-700 rounded-3xl border border-red-200">
                      <XCircle size={18} />
                      Claim Rejected
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setSelectedClaim(item);
                      setShowDetails(true);
                    }}
                    className="cursor-pointer w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 rounded-3xl transition-all focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    <Eye size={18} />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center animate-fade-in">
            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Info size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-900 font-bold text-lg mb-1">
              No Claims Found
            </p>
            <p className="text-gray-500 text-sm">
              You haven't claimed any items in this category yet.
            </p>
          </div>
        )}
      </div>

      {/* Explainer Section */}
      <div
        className="mt-12 backdrop-blur-md border border-[#E2DCD0] bg-[#FAF8F5] rounded-[2rem] p-6 sm:p-8 shadow-sm animate-slide-up"
        style={{ animationDelay: "300ms" }}
      >
        {/* Header Section */}
        <div className="flex items-start sm:items-center gap-3.5 mb-6 sm:mb-8">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-900/5 text-gray-600 backdrop-blur-sm border border-gray-900/5 shrink-0">
            <Info size={16} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base sm:text-lg tracking-tight">
              Understanding the Claim Process
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">
              Track your items seamlessly through each stage of administrative
              verification.
            </p>
          </div>
        </div>

        {/* Status Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-md">
          {/* Pending */}
          <div className="group relative bg-white/50 hover:bg-white/90 border border-white/80 rounded-2xl p-4 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse" />
              <span className="font-bold text-gray-900 tracking-tight">
                Pending
              </span>
            </div>
            <p className="text-gray-500 text-xs sm:text-[13px] leading-relaxed font-medium">
              Under secure review by the administrative team.
            </p>
          </div>

          {/* Approved */}
          <div className="group relative bg-white/50 hover:bg-white/90 border border-white/80 rounded-2xl p-4 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="font-bold text-gray-900 tracking-tight">
                Approved
              </span>
            </div>
            <p className="text-gray-500 text-xs sm:text-[13px] leading-relaxed font-medium">
              Verified! Present your unique QR code at the designated booth.
            </p>
          </div>

          {/* Released */}
          <div className="group relative bg-white/50 hover:bg-white/90 border border-white/80 rounded-2xl p-4 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <span className="font-bold text-gray-900 tracking-tight">
                Released
              </span>
            </div>
            <p className="text-gray-500 text-xs sm:text-[13px] leading-relaxed font-medium">
              The item has been successfully returned to you.
            </p>
          </div>

          {/* Rejected */}
          <div className="group relative bg-white/50 hover:bg-white/90 border border-white/80 rounded-2xl p-4 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
              <span className="font-bold text-gray-900 tracking-tight">
                Rejected
              </span>
            </div>
            <p className="text-gray-500 text-xs sm:text-[13px] leading-relaxed font-medium">
              Verification failed. Contact admin for clarification.
            </p>
          </div>
        </div>
      </div>

      <ClaimQrModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        claim={selectedClaim}
      />

      <ClaimDetailsModal
        isOpen={showDetails}
        claim={selectedClaim}
        onClose={() => setShowDetails(false)}
      />
    </div>
  );
}